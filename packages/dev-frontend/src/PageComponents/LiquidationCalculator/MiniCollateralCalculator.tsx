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
import IntermediateCollateralCalculator from "./IntermediateCollateralCalculator";
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

const MiniCollateralCalculator: React.FC<CollateralCalculatorProps> = ({ collateral }) => {
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
        <Flex>
          <Text
            fontSize="50px"
            letterSpacing="0.1em"
            fontWeight="300"
            color="white"
            textTransform="uppercase"
            mt={10}
          >
            Calculator
          </Text>
        </Flex>
        <Text
          textStyle="title2"
          fontWeight="700"
          fontSize="36px"
          fontFamily="Merriweather"
          lineHeight="30px"
          textShadow="0px 0px 11px #AC88CF"
          textAlign={["center", "left"]}
          pb="16px"
          mb="36px"
          mt={20}
          borderBottom={"1px solid rgba(255, 255, 255, 0.2)"}
        >
          Calculator Simulator
        </Text>

        <Flex>
          <Text
            mb={2}
            whiteSpace="pre-wrap"
            fontSize="md"
            textColor="white"
            textStyle={"subtitle1"}
            // style={{ textAlign: "justify" }}
          >
            Simulate Collateral asset changes to see how your trove would be impacted.
          </Text>
        </Flex>
      </Box>
    </>
  );
};

export default MiniCollateralCalculator;
