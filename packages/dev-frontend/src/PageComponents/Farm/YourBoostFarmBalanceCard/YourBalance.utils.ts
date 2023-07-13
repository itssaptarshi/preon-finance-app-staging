type InfoRow = {
  title: string;
  value?: number;
  percent?: number;
  tooltip?: string;
};

export const getBalanceInfo = (
  staked: number,
  lpShare: number,
  weeklyRewards: number,
  baseWeeklyReward: number,
  boostWeeklyReward: number,
  accumulateVePreonOnReward: number,
  stakeShare: number,
  earned?: number
): InfoRow[] => [
  {
    title: "Total Amount Staked",
    value: staked
  },
  {
    title: "Staked LP Share",
    percent: stakeShare,
    tooltip: "Amount of LP tokens you have staked / Total LP tokens staked in system"
  },
  // {
  //   title: "Weight Share",
  //   percent: stakeShare
  // },
  // {
  //   title: "Estimated Base Reward",
  //   value: baseWeeklyReward,
  //   tooltip: "Estimated amount of rewards you will receive in a week based on your deposit"
  // },
  // {
  //   title: "Estimated Boosted Reward",
  //   value: boostWeeklyReward,
  //   tooltip: "Estimated amount of boosted rewards you will receive in a week based on your deposit and vePREON allocation"
  // },
  {
    title: "Weight Share",
    percent: lpShare,
    tooltip: "Percentage of boosted rewards you earn based on vePREON / LP balances"
  }
  // {
  //   title: "Accumulated vePREON on LP",
  //   value: accumulateVePreonOnReward
  // },
  // {
  //   title: "Estimated Weekly Base Reward",
  //   value: baseWeeklyReward,
  //   tooltip: "Estimated amount of base rewards you will receive in a week based on your deposit"
  // },
  // {
  //   title: "Estimated Weekly Boosted Reward",
  //   value: boostWeeklyReward,
  //   tooltip:
  //     "Estimated amount of boosted rewards you will receive in a week based on your deposit and vePREON allocation"
  // }
];

export const getBalanceInfoCollapsed = (
  staked: number,
  stakeShare: number,
  weeklyRewards: number,
  baseWeeklyReward: number,
  boostWeeklyReward: number,
  accumulateVePreonOnReward: number,
  earned?: number
): InfoRow[] => [];
