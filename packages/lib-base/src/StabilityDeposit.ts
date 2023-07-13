import { Decimal, Decimalish } from "./Decimal";

/**
 * Represents the change between two Stability Deposit states.
 *
 * @public
 */
export type StabilityDepositChange<T> =
  | { depositSTAR: T; withdrawSTAR?: undefined }
  | { depositSTAR?: undefined; withdrawSTAR: T; withdrawAllSTAR: boolean };

/**
 * A Stability Deposit and its accrued gains.
 *
 * @public
 */
export class StabilityDeposit {
  /** Amount of STAR in the Stability Deposit at the time of the last direct modification. */
  readonly initialSTAR: Decimal;

  /** Amount of STAR left in the Stability Deposit. */
  readonly currentSTAR: Decimal;

  /** Amount of native currency (e.g. Ether) received in exchange for the used-up STAR. */
  readonly collateralGain: Decimal;

  /** Amount of PREON rewarded since the last modification of the Stability Deposit. */
  readonly preonReward: Decimal;

  /**
   * Address of frontend through which this Stability Deposit was made.
   *
   * @remarks
   * If the Stability Deposit was made through a frontend that doesn't tag deposits, this will be
   * the zero-address.
   */

  /** @internal */
  constructor(
    initialSTAR: Decimal,
    currentSTAR: Decimal,
    collateralGain: Decimal,
    preonReward: Decimal
  ) {
    this.initialSTAR = initialSTAR;
    this.currentSTAR = currentSTAR;
    this.collateralGain = collateralGain;
    this.preonReward = preonReward;

    if (this.currentSTAR.gt(this.initialSTAR)) {
      throw new Error("currentSTAR can't be greater than initialSTAR");
    }
  }

  get isEmpty(): boolean {
    return (
      this.initialSTAR.isZero &&
      this.currentSTAR.isZero &&
      this.collateralGain.isZero &&
      this.preonReward.isZero
    );
  }

  /** @internal */
  toString(): string {
    return (
      `{ initialSTAR: ${this.initialSTAR}` +
      `, currentSTAR: ${this.currentSTAR}` +
      `, collateralGain: ${this.collateralGain}` +
      `, preonReward: ${this.preonReward}`
    );
  }

  /**
   * Compare to another instance of `StabilityDeposit`.
   */
  equals(that: StabilityDeposit): boolean {
    return (
      this.initialSTAR.eq(that.initialSTAR) &&
      this.currentSTAR.eq(that.currentSTAR) &&
      JSON.stringify(this.collateralGain) == JSON.stringify(that.collateralGain) &&
      this.preonReward.eq(that.preonReward)
    );
  }

  /**
   * Calculate the difference between the `currentSTAR` in this Stability Deposit and `thatSTAR`.
   *
   * @returns An object representing the change, or `undefined` if the deposited amounts are equal.
   */
  whatChanged(thatSTAR: Decimalish): StabilityDepositChange<Decimal> | undefined {
    thatSTAR = Decimal.from(thatSTAR);

    if (thatSTAR.lt(this.currentSTAR)) {
      return { withdrawSTAR: this.currentSTAR.sub(thatSTAR), withdrawAllSTAR: thatSTAR.isZero };
    }
    if (thatSTAR.gt(this.currentSTAR)) {
      return { depositSTAR: thatSTAR.sub(this.currentSTAR) };
    }
  }

  /**
   * Apply a {@link StabilityDepositChange} to this Stability Deposit.
   *
   * @returns The new deposited STAR amount.
   */
  apply(change: any | undefined): Decimal {
    if (!change) {
      return this.currentSTAR;
    }
    if (change.withdrawSTAR !== undefined) {
      return change.withdrawAllSTAR || this.currentSTAR.lte(change.withdrawSTAR)
        ? Decimal.ZERO
        : this.currentSTAR.sub(change.withdrawSTAR);
    } else {
      return this.currentSTAR.add(change.depositSTAR);
    }
  }
}
