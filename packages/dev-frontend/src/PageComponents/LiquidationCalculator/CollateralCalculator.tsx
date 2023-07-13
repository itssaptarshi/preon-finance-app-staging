// @ts-nocheck
// @ts-nocheck
import {
  Box,
  useDisclosure,
  Flex,
  Tr,
  Td,
  Input,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Divider,
  NumberInput,
  NumberInputField,
  SliderMark
} from "@chakra-ui/react";
import { LiquityStoreState, Decimal } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useEffect, useState } from "react";
import { TokenTable, Header, Icon } from "../../components";
import { CoinShow, TokenData, TroveMappings } from "../../../Types";
import { format, getNum } from "../../Utils/number";
import AddCollateralTypeModal from "../Borrow/AddCollateralTypeModal";
import OverallStats from "./OverallStats";
import { useLiquity } from "../../hooks/LiquityContext";
import tokendata from "../../../src/TokenData";

type CollateralCalculatorProps = {
  collateral: TokenData[];
};

type CollateralStats = {
  adjustedPrice: number;
  adjustedPriceString: string;
  weightedCollateralValue: number;
  maxAdjustedPrice: number;
  minAdjustedPrice: number;
  adjustmentStep: number;
};

export type AdjustedCollateral = TokenData &
  CollateralStats & {
    troveBalanceString: string;
    underlyingPrices: number;
  };

export type OverallCollateralStats = CollateralStats & {
  weightedStablecoinCollateralValue: number;
};

type CalculatorState = {
  adjustedCollaterals: AdjustedCollateral[];
  overallStats: CollateralStats;
};

// this can be made more generic to handle stable coins and moved to a global util file
export const isStableCoin = (coin: TokenData) => coin.isStable === true;
export const getOverallWeightedValue = (collaterals: AdjustedCollateral[]) => {
  const value = collaterals.reduce((acc, item) => acc + item.weightedCollateralValue, 0);

  return value;
};

const selector = ({ trove, underlyingPrices, safetyRatios }: LiquityStoreState) => ({
  trove,
  underlyingPrices,
  safetyRatios
});

const CollateralCalculator: React.FC<CollateralCalculatorProps> = ({ collateral }) => {
  const {
    isOpen: isAddCollateralTypeOpen,
    onOpen: onAddCollateralTypeOpen,
    onClose: onAddCollateralTypeClose
  } = useDisclosure();
  const { liquity } = useLiquity();
  const { trove, underlyingPrices, safetyRatios } = useLiquitySelector(selector);

  const coinShow: CoinShow = {};
  collateral.forEach(coin => {
    if (coin.troveBalance === 0) {
      coinShow[coin.token] = false;
    } else {
      coinShow[coin.token] = true;
    }
  });

  const [show, setShow] = useState<CoinShow>(coinShow);

  const ratioMapping: TroveMappings = {};
  const [ratios, setRatios] = useState<TroveMappings>(ratioMapping);

  useEffect(() => {
    const newMapping: TroveMappings = {};
    let interval: any = undefined;
    interval = setInterval(async () => {
      for (let i = 0; i < collateral.length; i++) {
        if (collateral[i].underlying != "") {
          let scaleReceiptDecimals = 18 - collateral[i].underlyingDecimals;
          newMapping[collateral[i].address] = (
            await liquity.getUnderlyingPerReceipt(collateral[i].address)
          ).mul(Decimal.from(10).pow(scaleReceiptDecimals));
        } else {
          // console.log("collateral[i].address", collateral[i].address)
          newMapping[collateral[i].address] = Decimal.ONE;
        }
      }
      // console.log(ratioMapping)
      setRatios(newMapping);
    }, 1500);

    return () => clearInterval(interval);
  }, [trove.collaterals]);

  const initialAdjustedCollateral: AdjustedCollateral[] = collateral
    .filter(coin => show[coin.token])
    .map(coin => {
      const coinPrice = format(underlyingPrices[coin.address]);
      const priceAdjustmentSpread = isStableCoin(coin)
        ? coinPrice * 1.25 - coinPrice * 0.75
        : coinPrice * 5 - coinPrice;

      return {
        ...coin,
        underlyingPrices: coinPrice,
        troveBalanceString: (coin.troveBalance * format(ratios[coin.address])).toFixed(3),
        adjustedPrice: coinPrice,
        adjustedPriceString: coinPrice.toFixed(3),
        weightedCollateralValue: coin.troveBalance * coinPrice * format(safetyRatios[coin.address]),
        maxAdjustedPrice: isStableCoin(coin) ? coinPrice * 1.25 : coinPrice * 6,
        minAdjustedPrice: isStableCoin(coin) ? coinPrice * 0.75 : 0,
        adjustmentStep: priceAdjustmentSpread / 20
      };
    });

  const initialCalculatorState: CalculatorState = {
    adjustedCollaterals: initialAdjustedCollateral,
    overallStats: {
      adjustedPrice: 0,
      adjustedPriceString: "0",
      weightedCollateralValue: getOverallWeightedValue(initialAdjustedCollateral),
      maxAdjustedPrice: 500,
      minAdjustedPrice: -100,
      adjustmentStep: 5
    }
  };

  const [calculatorState, setCalculatorState] = useState<CalculatorState>(initialCalculatorState);

  let availableCollateral: TokenData[] = collateral.filter(coin => !show[coin.token]);

  const handleCollateralChange = (collateral: AdjustedCollateral, index: number) => {
    const originalWeightedCollateralValue = calculatorState.adjustedCollaterals.reduce(
      (total, collateralItem) =>
        total +
        collateralItem.troveBalance *
          format(collateralItem.underlyingPrices) *
          format(safetyRatios[collateralItem.address]),
      0
    );

    const newCollaterals = [...calculatorState.adjustedCollaterals];
    collateral.weightedCollateralValue =
      collateral.troveBalance *
      format(collateral.adjustedPrice) *
      format(safetyRatios[collateral.address]);
    newCollaterals[index] = collateral;

    const newWeightedCollateralValue = getOverallWeightedValue(newCollaterals);

    setCalculatorState({
      adjustedCollaterals: newCollaterals,
      overallStats: {
        ...calculatorState.overallStats,
        weightedCollateralValue: newWeightedCollateralValue,
        adjustedPrice:
          ((newWeightedCollateralValue - originalWeightedCollateralValue) /
            originalWeightedCollateralValue) *
          100
      }
    });
  };

  useEffect(() => {
    const oldTokens = new Set(
      calculatorState.adjustedCollaterals.map(collateral => collateral.token)
    );
    const addedTokens = new Set(
      Object.entries(show)
        .filter(([token, isShown]) => !!isShown && !oldTokens.has(token))
        .map(([token]) => token)
    );

    availableCollateral = collateral.filter(coin => !show[coin.token]);

    const newCollaterals: AdjustedCollateral[] = collateral
      .filter(coin => addedTokens.has(coin.token))
      .map(coin => {
        const coinPrice = format(underlyingPrices[coin.address]);
        const priceAdjustmentSpread = isStableCoin(coin)
          ? coinPrice * 1.25 - coinPrice * 0.75
          : coinPrice * 5 - coinPrice;

        return {
          ...coin,
          underlyingPrices: coinPrice,
          adjustedPrice: coinPrice,
          troveBalanceString: coin.troveBalance.toFixed(3),
          adjustedPriceString: coinPrice.toString(),
          weightedCollateralValue:
            coin.troveBalance * coinPrice * format(safetyRatios[coin.address]),
          maxAdjustedPrice: isStableCoin(coin) ? coinPrice * 1.25 : coinPrice * 6,
          minAdjustedPrice: isStableCoin(coin) ? coinPrice * 0.75 : 0,
          adjustmentStep: priceAdjustmentSpread / 20
        };
      });

    if (!newCollaterals.length) {
      return;
    }

    const newAdjustedCollaterals = [...calculatorState.adjustedCollaterals, ...newCollaterals];

    const originalTotalPrice = newAdjustedCollaterals.reduce(
      (underlyingPrices, collateralItem) => underlyingPrices + collateralItem.underlyingPrices,
      0
    );

    const adjustedTotalPrice = newAdjustedCollaterals.reduce(
      (underlyingPrices, collateralItem) => underlyingPrices + collateralItem.adjustedPrice,
      0
    );

    setCalculatorState({
      adjustedCollaterals: newAdjustedCollaterals,
      overallStats: {
        ...calculatorState.overallStats,
        weightedCollateralValue: getOverallWeightedValue(newAdjustedCollaterals),
        adjustedPrice: ((adjustedTotalPrice - originalTotalPrice) / originalTotalPrice) * 100
      }
    });
  }, [show]);

  const overallStats = {
    ...calculatorState.overallStats,
    weightedStablecoinCollateralValue: getOverallWeightedValue(
      calculatorState.adjustedCollaterals.filter(collateral => isStableCoin(collateral))
    )
  };

  return (
    <>
      <AddCollateralTypeModal
        isOpen={isAddCollateralTypeOpen}
        onClose={onAddCollateralTypeClose}
        show={show}
        setShow={setShow}
        availableCollateral={availableCollateral}
        borrowMode="normal"
      />
      <Box>
        <Text textStyle="title2" px={10} mb={1}>
          Overall Stats
        </Text>
        <Divider mt={3} ml={2} mr={"2em"} height="0.5px" opacity="0.4" />

        <Text textStyle="subtitle2" mt={5} mb={2} ml={10}>
          View trove's overall stats based upon simulated collateral asset changes above.
        </Text>
        <Flex mt={10} flex={1} ml={5}>
          <TokenTable
            fontSize={"16px"}
            textStyle="title4"
            headers={[
              "Collateral",
              "Balance",
              "Current Price",
              "Price Slider",
              "Price",
              "",
              "Safety Ratio",
              "",
              "Risk Adjusted Value (RAV)"
            ]}
            tooltips={[
              "A collateral in your trove",
              "The number of tokens in your trove",
              "The current market underlyingPrices of the collateral asset",
              "Simulate underlyingPrices changes of your current trove's collaterals",
              "Simulated underlyingPrices of the collateral token",
              "",
              "The safety ratio of the collateral token",
              "",
              "Balance x Safety Ratio x Price"
            ]}
            width={9}
          >
            {calculatorState.adjustedCollaterals.map((item, index) => (
              <Tr key={index}>
                <Td pt={6} pb={2}>
                  <Flex align="center" w={28}>
                    <Icon iconName={item.token} h={5} w={5} />
                    <Text ml={3} whiteSpace="pre-wrap">
                      {item.token}
                    </Text>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center">
                    <NumberInput
                      precision={3}
                      value={item.troveBalanceString}
                      defaultValue={0}
                      onChange={val => {
                        handleCollateralChange(
                          {
                            ...item,
                            troveBalance: parseFloat(val),
                            troveBalanceString: val
                          },
                          index
                        );
                      }}
                    >
                      <NumberInputField paddingRight="-3" paddingLeft="0" />
                    </NumberInput>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center">
                    <Text ml={3} whiteSpace="nowrap" color="white">
                      ${getNum(item.underlyingPrices, 2)}
                    </Text>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center" w={40} pr={6}>
                    <Slider
                      focusThumbOnChange={false}
                      aria-label="slider-ex-6"
                      value={item.adjustedPrice}
                      min={item.minAdjustedPrice}
                      max={item.maxAdjustedPrice}
                      step={item.adjustmentStep}
                      onChange={val => {
                        handleCollateralChange(
                          {
                            ...item,
                            adjustedPrice: val,
                            adjustedPriceString: val.toString()
                          },
                          index
                        );
                      }}
                    >
                      <SliderMark value={item.minAdjustedPrice} mt="1" ml="-2.5" fontSize="x-small">
                        {isStableCoin(item) ? "0.75X" : "0X"}
                      </SliderMark>
                      <SliderMark value={item.underlyingPrices} mt="1" ml="-0.5" fontSize="x-small">
                        1X
                      </SliderMark>
                      <SliderMark value={item.maxAdjustedPrice} mt="1" ml="-2.5" fontSize="x-small">
                        {isStableCoin(item) ? "1.25X" : "6X"}
                      </SliderMark>
                      <SliderTrack bg="#fff">
                        <SliderFilledTrack bg="#C157F9" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center">
                    <NumberInput
                      precision={2}
                      value={item.adjustedPriceString}
                      onChange={val => {
                        handleCollateralChange(
                          {
                            ...item,
                            adjustedPrice: parseFloat(val),
                            adjustedPriceString: val
                          },
                          index
                        );
                      }}
                    >
                      <NumberInputField paddingRight="-3" paddingLeft="0" />
                    </NumberInput>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={0} pr={0}>
                  <Flex align="center">
                    <Text ml={3} whiteSpace="nowrap" color="gray.500">
                      x
                    </Text>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center">
                    <Text ml={3} whiteSpace="nowrap">
                      {getNum(format(safetyRatios[item.address]))}
                    </Text>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={0} pr={0}>
                  <Flex align="center">
                    <Text ml={3} whiteSpace="nowrap" color="gray.500">
                      =
                    </Text>
                  </Flex>
                </Td>
                <Td pt={6} pb={2} pl={2}>
                  <Flex align="center">
                    <Text ml={3} whiteSpace="nowrap" color="white">
                      ${getNum(item.weightedCollateralValue)}
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </TokenTable>
        </Flex>
        <Flex ml={"80px"}>
          <Button
            disabled={!availableCollateral.length}
            variant="gradient"
            _active={{ bg: "transparent" }}
            mt={10}
            mx={6}
            leftIcon={<Icon iconName="BlueAddIcon" />}
            onClick={onAddCollateralTypeOpen}
          >
            Add Collateral Type
          </Button>
          <Button
            variant="gradient"
            _active={{ bg: "transparent" }}
            mt={10}
            onClick={() => {
              setCalculatorState(initialCalculatorState);
            }}
          >
            Set to Your Trove Balances
          </Button>
        </Flex>

        <OverallStats
          collaterals={calculatorState.adjustedCollaterals}
          overallTroveStats={overallStats}
          setCalculatorState={setCalculatorState}
          debt={format(trove.debt["debt"])}
          safetyRatios={safetyRatios}
        />
      </Box>
    </>
  );
};

export default CollateralCalculator;
