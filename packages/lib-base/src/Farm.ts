export class Farm {
  lpTokenBalance;
  earnedPREON;
  totalLPStaked;
  rewardRate;
  /** @internal */
  constructor(lpTokenBalance: any, earnedPREON: any, totalLPStaked: any, rewardRate: any) {
    this.lpTokenBalance = lpTokenBalance;
    this.earnedPREON = earnedPREON;
    this.totalLPStaked = totalLPStaked;
    this.rewardRate = rewardRate;
  }
  equals(that: {
    lpTokenBalance: any;
    earnedPREON: any;
    totalLPStaked: any;
    rewardRate: any;
  }): boolean {
    return (
      this.lpTokenBalance.eq(that.lpTokenBalance) &&
      this.earnedPREON.eq(that.earnedPREON) &&
      this.totalLPStaked.eq(that.totalLPStaked) &&
      this.rewardRate.eq(that.rewardRate)
    );
  }
}
