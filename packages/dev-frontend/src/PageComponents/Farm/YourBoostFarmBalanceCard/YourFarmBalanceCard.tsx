// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Spacer,
  Text,
  useDisclosure,
  Collapse,
  IconButton
} from "@chakra-ui/react";
import { Icon, CoinAmount } from "../../../components";
import { Decimal, LiquityStoreState, TroveMappings } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { getBalanceInfo, getBalanceInfoCollapsed } from "./YourBalance.utils";
import { newWeeklyAPR, format, formatWithDecimals, getNum } from "../../../Utils/number";
import Tooltip from "../../../components/Tooltip";
import { useLiquity } from "../../../hooks/LiquityContext";
import PoolRewardsModal from "../../Pool/PoolRewardsModal";
import { FarmPoolRewardsInfo, calculateFarmPoolRewards } from "../FarmUtils";
import { contractAddresses } from "../../../config/constants";

// console.log("getbalanceinfo", getBalanceInfo.tot)

const selector = ({ boostedFarm, PREONPrice, vePREONStaked }: LiquityStoreState) => ({
  boostedFarm,
  PREONPrice,
  vePREONStaked
});

const preontoken = contractAddresses.preonToken.address;

const YourBoostFarmBalanceCard: React.FC = () => {
  const { boostedFarm, PREONPrice, vePREONStaked } = useLiquitySelector(selector);

  const earned: TroveMappings = {
    preontoken: boostedFarm.earnedPREON
  };

  const farmPoolRewardInfo = calculateFarmPoolRewards(
    vePREONStaked,
    format(PREONPrice),
    boostedFarm
  );

  let AppliedVePreon: number;

  if (format(vePREONStaked.preonStakeOnFarm) === 0 || format(vePREONStaked.boostFactor) === 0) {
    AppliedVePreon = 0;
  } else {
    AppliedVePreon =
      (Math.pow(format(vePREONStaked.boostFactor), 2) /
        format(boostedFarm.lpTokenBalance) /
        10 ** 18) *
      10 ** 22;
  }
  const balanceInfo = getBalanceInfo(
    //staked
    format(boostedFarm.lpTokenBalance),
    //lpShare
    farmPoolRewardInfo.userBoostedRewardShare * 100,
    //weeklyRewards,
    !boostedFarm.lpTokenBalance.eq(Decimal.from(0))
      ? (format(boostedFarm.rewardRate) * 604800 * format(boostedFarm.lpTokenBalance)) /
          format(boostedFarm.totalLPStaked)
      : 0,
    //baseWeeklyrewards
    farmPoolRewardInfo.userAnnualBaseReward / 52.143,
    //boostWeeklyReards
    farmPoolRewardInfo.userAnnualBoostedReward / 52.143,
    //accvePreon
    AppliedVePreon,
    //stake share
    format(boostedFarm.lpTokenBalance.div(boostedFarm.totalLPStaked)) * 100,
    !isNaN(+Object.values(earned)[0]) ? format(+Object.values(earned)[0]) : 0
  );

  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={earned}
        notStability={true}
        mode="LP"
        key="prm"
      />

      <Flex justify="flex-end" mt={4}>
        <Button variant="gradient" onClick={onPoolRewardsOpen}>
          View Rewards
        </Button>
      </Flex>
    </>
  );
};

export default YourBoostFarmBalanceCard;
