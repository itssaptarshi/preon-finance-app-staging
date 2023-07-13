// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text, useDisclosure, Divider } from "@chakra-ui/react";
import CoinAmount from "../../components/CoinAmount";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { newWeeklyAPR, format, getNum, formatWithDecimals } from "../../Utils/number";
import Tooltip from "../../components/Tooltip";
import PoolRewardsModal from "../Pool/PoolRewardsModal";
import { getNewEstimatedWeeklyRewardsAmount } from "./veStakeCard.utils";
import { useLiquity } from "../../hooks/LiquityContext";

const selector = ({ vePREONStaked, boostedFarm }: LiquityStoreState) => ({
  vePREONStaked,
  boostedFarm
});

const VEAllocation: React.FC = () => {
  const { vePREONStaked, boostedFarm } = useLiquitySelector(selector);
  const totalPreon: Decimal = vePREONStaked.totalPreon;
  // console.log("totalPreon :",totalPreon)
  const { liquity } = useLiquity();
  let AmountStakedUnallocated = format(vePREONStaked.preonStake);
  let vePreonOnUnallocated = formatWithDecimals(vePREONStaked.vePREONGain, 36);
  let WeeklyvePreonGrowthUnallocated =
    AmountStakedUnallocated * 604800 * format(vePREONStaked.accumulationRate);
  let AmountStakedLP = format(vePREONStaked.preonStakeOnFarm);
  // console.log("AmountStakedLP",AmountStakedLP);

  let vePreonOnLp = formatWithDecimals(vePREONStaked.vePreonOnFarm, 36);

  let WeeklyvePreonGrowthLP = format(
    AmountStakedLP * 604800 * format(vePREONStaked.accumulationRate)
  );
  // console.log("format(vePREONStaked.boostFactor)",  Math.pow(format(vePREONStaked.boostFactor), 2) / format(vePREONStaked.preonStakeOnFarm))
  let AppliedVePreon: number;

  if (format(vePREONStaked.preonStakeOnFarm) == 0 || format(vePREONStaked.boostFactor) == 0) {
    AppliedVePreon = 0;
  } else {
    AppliedVePreon =
      (Math.pow(format(vePREONStaked.boostFactor), 2) /
        format(boostedFarm.lpTokenBalance) /
        10 ** 18) *
      10 ** 22;
  }

  let PendingVePreon = vePreonOnLp - AppliedVePreon;
  console.log("pendingvepreon", PendingVePreon);

  let stakeShare: number;
  if (vePREONStaked.totalUserPreon != undefined && vePREONStaked.totalPreon != undefined) {
    stakeShare = format(vePREONStaked.totalUserPreon.div(vePREONStaked.totalPreon)) * 100;
  } else {
    stakeShare = 0;
  }

  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      {/* <Flex flex={1} ml={[0, null, 3]} mt={[6, null, 0]}>
        <Box layerStyle="card" flex={1}>
          <Text textStyle="title3" mb={3}>
            Stake Allocations
          </Text>
          <Divider />
          <SimpleGrid columns={5} mb={3} spacingX="30px" spacingY="10px" mt={5}>
            <Text textStyle="subtitle2" fontWeight="normal" color="white">
              Location
            </Text>
            <Text textStyle="subtitle2" fontWeight="normal" color="white">
              PREON Staked
            </Text>
            <Text textStyle="subtitle2" fontWeight="normal" color="white">
              Applied vePREON
            </Text>
            <Text textStyle="subtitle2" fontWeight="normal" color="white">
              Pending vePREON
            </Text>
            <Text textStyle="subtitle2" fontWeight="normal" color="white">
              Utility
            </Text>
            <Text textStyle="subtitle2" color="purple" mr={1}>
              Unallocated
            </Text>
            <Text textStyle="subtitle2" color="purple" mr={1}>
              {getNum(AmountStakedUnallocated, 3)}
            </Text>
            <Text textStyle="subtitle2" color="purple" mr={1}>
              {getNum(vePreonOnUnallocated, 3)}
            </Text>
            <Text textStyle="subtitle2" color="purple" mr={1}>
              0.000
            </Text>
            <Text textStyle="subtitle2" color="purple" mr={1}>
              N/A
            </Text>
            <Text textStyle="subtitle2" mr={1}>
              LP Boost
            </Text>
            <Text textStyle="subtitle2" mr={1}>
              {getNum(AmountStakedLP, 3)}
            </Text>
            <Text textStyle="subtitle2" mr={1}>
              {getNum(AppliedVePreon, 3)}
            </Text>
            <Text textStyle="subtitle2" mr={1}>
              {getNum(PendingVePreon, 3)}
            </Text>
            <Text textStyle="subtitle2" mr={1}>
              <Tooltip>15% of Curve LP emissions go to vePREON accumulators who also LP</Tooltip>
            </Text>
          </SimpleGrid>
        </Box>
      </Flex> */}
    </>
  );
};

export default VEAllocation;
