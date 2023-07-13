// @ts-nocheck
// @ts-nocheck
import { format, formatWithDecimals } from "../../Utils/number";
import { Decimal, Farm, vePREONStake } from "@liquity/lib-base";

export type FarmPoolRewardsInfo = {
  userBaseRewardShare: number;
  baseAPR: number;
  userAnnualBaseReward: number;
  userBoostedRewardShare: number;
  boostedAPR: number;
  userAnnualBoostedReward: number;
};

// assume adjusted Amount is in the right range when passing in
export const calculateFarmPoolRewards = (
  // Values of vePREONStaked is coming from vePREON smart contract, which is returning 0 values.
  vePREONStaked: vePREONStake,
  preonPrice: number,
  boostedFarm: Farm,
  adjustAmount?: number
): FarmPoolRewardsInfo => {
  let userBaseRewardShare: number;

  if (adjustAmount !== undefined) {
    userBaseRewardShare =
      (format(boostedFarm.lpTokenBalance) + adjustAmount) /
      (format(boostedFarm.totalLPStaked) + adjustAmount);
  } else {
    userBaseRewardShare = format(boostedFarm.lpTokenBalance.div(boostedFarm.totalLPStaked));
  }
  const annualBaseReward =
    (format(boostedFarm.rewardRate) * 7 * 86400 * formatWithDecimals(boostedFarm.totalLPStaked, 0)) /
    1000;
  // const annualBaseReward = 0 * 365 * 86400 * formatWithDecimals(vePREONStaked.boostBasePartition, 0) / 1000
  const userAnnualBaseReward = userBaseRewardShare * annualBaseReward;
  //  some values from vePREONStaked is returning 0 #staticvalue
  const baseAPR = (100 * preonPrice * annualBaseReward) / format(boostedFarm.totalLPStaked);
  console.log("baseAPR1", vePREONStaked);

  let userBoostedRewardShare: number;

  if (adjustAmount !== undefined) {
    let AppliedVePreon: number;

    if (format(vePREONStaked.preonStakeOnFarm) == 0 || format(vePREONStaked.boostFactor) == 0) {
      AppliedVePreon = 0;
    } else {
      AppliedVePreon =
        Math.pow(format(vePREONStaked.boostFactor), 2) / format(boostedFarm.lpTokenBalance);
    }
    console.log("AppliedVePreon", AppliedVePreon);
    const oldFactor = format(vePREONStaked.boostFactor);
    const newFactor = Math.sqrt(
      (format(boostedFarm.lpTokenBalance) + adjustAmount) * AppliedVePreon
    );
    const sumOfFactors = format(vePREONStaked.boostSumOfFactors) + newFactor - oldFactor;

    userBoostedRewardShare = newFactor / sumOfFactors;
  } else {
    userBoostedRewardShare = format(vePREONStaked.boostFactor.div(vePREONStaked.boostSumOfFactors));
  }

  const annualBoostedReward =
    (format(vePREONStaked.boostRewardRate) *
      365 *
      86400 *
      (1000 - formatWithDecimals(vePREONStaked.boostBasePartition, 0))) /
    1000;

  const userAnnualBoostedReward = annualBoostedReward * userBoostedRewardShare;

  let boostedAPR =
    ((100 * preonPrice * annualBoostedReward) /
      (format(boostedFarm.lpTokenBalance) + (adjustAmount !== undefined ? adjustAmount : 0))) *
    userBoostedRewardShare;

  boostedAPR = isNaN(boostedAPR) ? 0 : boostedAPR;

  return {
    userBaseRewardShare,
    baseAPR,
    userAnnualBaseReward,
    userBoostedRewardShare,
    boostedAPR,
    userAnnualBoostedReward
  };
};

export const calculateBoostRewards = (
  vePREONStaked: vePREONStake,
  preonPrice: number,
  boostedFarm: Farm,
  LPStaked: number,
  vePREONBal: number
): FarmPoolRewardsInfo => {
  let userBoostedRewardShare: number;

  const oldFactor = format(vePREONStaked.boostFactor);
  const newFactor = Math.sqrt((LPStaked * vePREONBal) / 10 ** 4);

  const sumOfFactors = format(vePREONStaked.boostSumOfFactors) + newFactor - oldFactor;

  userBoostedRewardShare = newFactor / sumOfFactors;

  const annualBoostedReward =
    (format(vePREONStaked.boostRewardRate) *
      365 *
      86400 *
      (1000 - formatWithDecimals(vePREONStaked.boostBasePartition, 0))) /
    1000;

  let userAnnualBoostedReward = annualBoostedReward * userBoostedRewardShare;

  userAnnualBoostedReward = isNaN(userAnnualBoostedReward) ? 100 : userAnnualBoostedReward;

  let boostedAPR = ((100 * preonPrice * annualBoostedReward) / LPStaked) * userBoostedRewardShare;

  boostedAPR = isNaN(boostedAPR) ? 93 : boostedAPR;

  let baseAPR = (100 * preonPrice * annualBoostedReward) / format(boostedFarm.totalLPStaked);

  baseAPR = isNaN(baseAPR) ? 0 : baseAPR;

  return {
    userBaseRewardShare: 0,
    baseAPR: 0,
    userAnnualBaseReward: 0,
    userBoostedRewardShare,
    boostedAPR,
    userAnnualBoostedReward
  };
};
