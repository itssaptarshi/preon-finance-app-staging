// @ts-nocheck
// @ts-nocheck
// @ts-nocheck
import React from "react";
import {
  Flex,
  Tr,
  Td,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Input,
  Text,
  Box,
  NumberInput,
  NumberInputField,
  Grid,
  GridItem,
  Divider,
  Center
} from "@chakra-ui/react";
import { TokenTable } from "../../components";
import {
  AdjustedCollateral,
  isStableCoin,
  OverallCollateralStats,
  getOverallWeightedValue
} from "./CollateralCalculator";
import { useState } from "react";
import { useEffect } from "react";
import { getNum, format } from "../../Utils/number";
import Tooltip from "../../components/Tooltip";
import { TroveMappings } from "../../../Types";

type Summary = {
  icr: number;
  rsr: number;
  liquidatable: number;
  stable: boolean;
};
type OverallStatsProps = {
  collaterals: AdjustedCollateral[];
  overallTroveStats: OverallCollateralStats;
  setCalculatorState: any;
  debt: number;
  safetyRatios: TroveMappings;
};

const getLiquidatableText = (value: number, stable: boolean) =>
  stable ? (
    <Text>Given the stablecoins' prices remain stable, your trove is not liquidatable.</Text>
  ) : value <= 0 ? (
    <Text>
      Your simulated trove (excluding stablecoins) would have to increase by{" "}
      <Text as="u">{(value * -100).toFixed(3)}%</Text>, or be{" "}
      <Text as="u">{(1 - value).toFixed(3)}x</Text> the RAV, to no longer be liquidatable
    </Text>
  ) : (
    <Text>
      Your simulated trove (excluding stablecoins) would have to decrease by{" "}
      <Text as="u" color="purple">
        {Number.isNaN(value) ? 0 : (value * 100).toFixed(3)}%
      </Text>
      , or be{" "}
      <Text as="u" color="purple">
        {Number.isNaN(value) ? 0 : (1 - value).toFixed(3)}x
      </Text>{" "}
      the RAV, to be liquidatable
    </Text>
  );

const OverallStats: React.FC<OverallStatsProps> = ({
  collaterals,
  overallTroveStats,
  setCalculatorState,
  debt,
  safetyRatios
}) => {
  const [currentDebt, setCurrentDebt] = useState<{ debt: number; debtString: string }>({
    debt,
    debtString: debt.toFixed(3)
  });
  const [summary, setSummary] = useState<Summary>({
    icr: (overallTroveStats.weightedCollateralValue / currentDebt.debt) * 100,
    rsr: 0,
    liquidatable: 0,
    stable: false
  });

  const handleOverallPriceChange = (val: number) => {
    const newCollaterals = [...collaterals].map(collateral => {
      if (isStableCoin(collateral)) {
        return {
          ...collateral,
          adjustedPrice: collateral.underlyingPrices,
          adjustedPriceString: collateral.underlyingPrices.toString(),
          weightedCollateralValue:
            collateral.troveBalance *
            collateral.underlyingPrices *
            format(safetyRatios[collateral.address])
        };
      }

      const adjPrice = collateral.underlyingPrices + (collateral.underlyingPrices * val) / 100;
      return {
        ...collateral,
        adjustedPrice: adjPrice,
        adjustedPriceString: adjPrice.toString(),
        weightedCollateralValue:
          collateral.troveBalance * adjPrice * format(safetyRatios[collateral.address])
      };
    });

    const weightedCollateral = getOverallWeightedValue(newCollaterals);

    setCalculatorState({
      adjustedCollaterals: newCollaterals,
      overallStats: {
        ...overallTroveStats,
        adjustedPrice: val,
        weightedCollateralValue: weightedCollateral
      }
    });
  };

  useEffect(() => {
    const weightedCollateralValueExcludingStablecoins =
      overallTroveStats.weightedCollateralValue -
      overallTroveStats.weightedStablecoinCollateralValue;
    const currentDebtExcludingStablecoins =
      currentDebt.debt - overallTroveStats.weightedStablecoinCollateralValue / 1.1;
    let liquidatable =
      1 - (currentDebtExcludingStablecoins * 1.1) / weightedCollateralValueExcludingStablecoins;
    setSummary({
      ...summary,
      icr: (overallTroveStats.weightedCollateralValue / currentDebt.debt) * 100,
      liquidatable: liquidatable,
      stable: overallTroveStats.weightedStablecoinCollateralValue > currentDebt.debt
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDebt, overallTroveStats.weightedCollateralValue]);

  return (
    <>
      <Flex>
        <TokenTable headers={["", "", ""]} width={4}>
          <Tr>
            <Text textStyle="title5" color="purple" ml={5}>
              SCALE NON-STABLE COLLATERAL PRICES
            </Text>
            <Flex ml={5} mt={30} align="center" w={"95%"}>
              <Slider
                color="purple"
                focusThumbOnChange={false}
                min={overallTroveStats.minAdjustedPrice}
                max={overallTroveStats.maxAdjustedPrice}
                step={overallTroveStats.adjustmentStep}
                value={overallTroveStats.adjustedPrice}
                onChange={handleOverallPriceChange}
              >
                <SliderMark value={-100} mt="5" color="white">
                  0X
                </SliderMark>
                <SliderMark value={0} mt="5" ml="2" color="white">
                  1X
                </SliderMark>
                <SliderMark value={100} mt="5" ml="6" color="white">
                  2X
                </SliderMark>
                <SliderMark value={300} mt="5" ml="1" color="white">
                  4X
                </SliderMark>
                <SliderMark value={490} mt="5" mr="1" color="white">
                  6X
                </SliderMark>
                <SliderTrack height="6px" borderRadius="5px" bg="purple">
                  <SliderFilledTrack bg="brand.1000" />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
          </Tr>
          <Tr>
            <Flex ml={5} mt={20} mb={5} textStyle="subtitle1" color="purple">
              DEBT
            </Flex>

            <Flex ml={5} align="center" w={"95%"}>
              <Slider
                color="purple"
                focusThumbOnChange={false}
                min={2000}
                max={(overallTroveStats.weightedCollateralValue * 1) / 1.1}
                step={(overallTroveStats.weightedCollateralValue * 1) / 1.1 / 20}
                value={currentDebt.debt}
                onChange={val => {
                  setCurrentDebt({ debt: val, debtString: val.toFixed(3).toString() });
                }}
              >
                <SliderMark value={2000} mt="5" color="white">
                  $2000
                </SliderMark>
                <SliderMark
                  value={(overallTroveStats.weightedCollateralValue * 1) / 1.1}
                  mt="5"
                  ml="-3.5"
                  color="white"
                >
                  ${getNum((overallTroveStats.weightedCollateralValue * 1) / 1.1)}
                </SliderMark>
                <SliderTrack height="6px" borderRadius="5px" bg="purple">
                  <SliderFilledTrack bg="brand.1000" />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Text fontSize="small" ml={100} mt={20} textAlign={"center"}>
              {"Max debt ≈ 90.9% of RAV "}
              {<Tooltip>{"This is the opposite of Min ICR: Max LTV = 90.9% = 1 / 110%"}</Tooltip>}
            </Text>
          </Tr>
          <Grid
            justifyContent={"space-between"}
            ml={"17px"}
            mt={"70px"}
            templateColumns="repeat(4, 1fr)"
            gap={8}
            textStyle="subtitle1"
          >
            <GridItem color="#C157F9 ">
              {" "}
              TOTAL RISK ADJUSTED VALUE (RAV){" "}
              <Td color="white">
                {" "}
                $ {getNum((overallTroveStats.weightedCollateralValue * 1) / 1.1)}
              </Td>
            </GridItem>
            <GridItem color="#C157F9">
              {console.log("eee", summary)}
              INDIVIDUAL COLLATERAL RATIO{" "}
              <Td color="white">{Number.isNaN(summary.icr) ? 0 : summary.icr.toFixed(2)}%</Td>{" "}
            </GridItem>
            <GridItem color="#C157F9">
              TOTAL STAR DEBT
              <Td color="white" mt={"30px"}>
                <NumberInput
                  precision={2}
                  value={currentDebt.debtString}
                  onChange={val => {
                    setCurrentDebt({ debt: parseFloat(val), debtString: val.toString() });
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </Td>
            </GridItem>
          </Grid>
          <Tr>
            <Td pt={8} pb={2}>
              <Flex ml={"6px"} align="center" w={44} color="#C157F9" textStyle="title5">
                SUMMARY
              </Flex>
              <Flex ml={"6px"} mt={"20px"} align="center">
                {getLiquidatableText(summary.liquidatable, summary.stable)}
              </Flex>
            </Td>
          </Tr>
        </TokenTable>
      </Flex>
    </>
  );
};

export default OverallStats;
