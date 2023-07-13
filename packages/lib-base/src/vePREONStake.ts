import { Decimal, Decimalish } from "./Decimal";

/**
 * Represents the change between two states of a vePREON Stake.
 *
 * @public
 */
export class vePREONStake {
  preonStake: any;
  vePREONGain: any;
  vePREONTotal: any;
  totalUserPreon: any;
  totalPreon: any;
  preonEarned: any;
  rewardRate: any;
  accumulationRate: any;
  boostAmount: any;
  boostFactor: any;
  boostRewardRate: any;
  boostBasePartition: any;
  preonStakeOnFarm: any;
  boostSumOfFactors: any;
  vePreonOnFarm: any;

  /** @internal */
  constructor(
    preonStake = Decimal.ZERO,
    vePREONGain = Decimal.ZERO,
    vePREONTotal = Decimal.ZERO,
    totalUserPreon = Decimal.ZERO,
    totalPreon = Decimal.ZERO,
    preonEarned = Decimal.ZERO,
    rewardRate = Decimal.ZERO,
    accumulationRate = Decimal.ZERO,
    boostAmount = Decimal.ZERO,
    boostFactor = Decimal.ZERO,
    boostRewardRate = Decimal.ZERO,
    boostBasePartition = Decimal.ZERO,
    preonStakeOnFarm = Decimal.ZERO,
    boostSumOfFactors = Decimal.ZERO,
    vePreonOnFarm = Decimal.ZERO,
  ) {
    this.preonStake = preonStake;
    this.vePREONGain = vePREONGain;
    this.vePREONTotal = vePREONTotal;
    this.totalUserPreon = totalUserPreon;
    this.totalPreon = totalPreon;
    this.preonEarned = preonEarned;
    this.rewardRate = rewardRate;
    this.accumulationRate = accumulationRate;
    this.boostAmount = boostAmount;
    this.boostFactor = boostFactor;
    this.boostRewardRate = boostRewardRate;
    this.boostBasePartition = boostBasePartition;
    this.preonStakeOnFarm = preonStakeOnFarm;
    this.boostSumOfFactors = boostSumOfFactors;
    (this.vePreonOnFarm = vePreonOnFarm);
  }
  get isEmpty(): boolean {
    return this.preonStake.isZero && this.vePREONGain.isZero && this.vePREONTotal.isZero;
  }
  /**
   * Compare to another instance of `PREONStake`.
   */
  equals(that: any): boolean {
    return (
      this.preonStake.eq(that.preonStake) &&
      this.vePREONGain.eq(that.vePREONGain) &&
      this.vePREONTotal.eq(that.vePREONTotal)
    );
  }
}
