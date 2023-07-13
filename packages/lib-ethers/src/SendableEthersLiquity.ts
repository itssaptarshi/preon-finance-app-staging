/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: Testing
import {
  CollateralGainTransferDetails,
  Decimalish,
  LiquidationDetails,
  LiquityReceipt,
  RedemptionDetails,
  SendableLiquity,
  SentLiquityTransaction,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  TroveAdjustmentDetails,
  TroveAdjustmentParams,
  TroveClosureDetails,
  TroveCreationDetails,
  TroveCreationParams
} from "@liquity/lib-base";

import {
  EthersTransactionOverrides,
  EthersTransactionReceipt,
  EthersTransactionResponse
} from "./types";

import {
  BorrowingOperationOptionalParams,
  PopulatableEthersLiquity,
  PopulatedEthersLiquityTransaction,
  SentEthersLiquityTransaction
} from "./PopulatableEthersLiquity";

const sendTransaction = <T>(tx: PopulatedEthersLiquityTransaction<T>) => tx.send();

/**
 * Ethers-based implementation of {@link @liquity/lib-base#SendableLiquity}.
 *
 * @public
 */
export class SendableEthersLiquity
  implements SendableLiquity<EthersTransactionReceipt, EthersTransactionResponse> {
  private _populate: PopulatableEthersLiquity;

  constructor(populatable: PopulatableEthersLiquity) {
    this._populate = populatable;
  }

  async approveToken(tokenAddress: any, toAddress: any, amount: any, overrides: any): Promise<any> {
    return this._populate
      .approveERC20(tokenAddress, toAddress, amount, overrides)
      .then(sendTransaction);
  }
  async multipleApproveERC20(tokenAddresses: any, toAddresses: any, amounts: any): Promise<any> {
    return this._populate.multipleApproveERC20(tokenAddresses, toAddresses, amounts);
  }
  async mintToken(tokenAddress: any, overrides: any): Promise<any> {
    return this._populate.mintERC20(tokenAddress, overrides).then(sendTransaction);
  }
  async mintTokenNoLimit(tokenAddress: any, amount: any, overrides: any): Promise<any> {
    return this._populate.mintERC20NoLimit(tokenAddress, amount, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.openTrove} */
  async openTrove(
    params?: any,
    ICRWithFees?: any,
    maxBorrowingRateOrOptionalParams?: any,
    overrides?: any
  ): Promise<any> {
    return this._populate
      .openTrove(params, ICRWithFees, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.openTroveLeverUp} */
  async openTroveLeverUp(
    params: any,
    ICRWithFees: any,
    troveOpen: any,
    maxBorrowingRateOrOptionalParams: any,
    overrides: any
  ): Promise<any> {
    return this._populate
      .openTroveLeverUp(params, ICRWithFees, troveOpen, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.closeTrove} */
  // @ts-expect-error: Testing
  closeTrove(overrides) {
    return this._populate.closeTrove(overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.closeTroveUnleverUp} */
  closeTroveUnleverUp(params: any, overrides: any): any {
    return this._populate.closeTroveUnleverUp(params, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.adjustTrove} */
  // @ts-expect-error: Testing
  adjustTrove(
    params: any,
    ICRWithFees: any,
    maxBorrowingRateOrOptionalParams: any,
    overrides: any
  ): any {
    return this._populate
      .adjustTrove(params, ICRWithFees, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.addCollLeverUp} */
  addCollLeverUp(
    params: any,
    ICRWithFees: any,
    maxBorrowingRateOrOptionalParams: any,
    overrides: any
  ): any {
    return this._populate
      .addCollLeverUp(params, ICRWithFees, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.addCollLeverUp} */
  withdrawCollUnleverUp(
    params: any,
    ICRWithFees: any,
    maxBorrowingRateOrOptionalParams: any,
    overrides: any
  ): any {
    return this._populate
      .withdrawCollUnleverUp(params, ICRWithFees, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositCollateral} */
  // @ts-expect-error: Testing
  depositCollateral(collaterals: any, ICRWithFees: any, overrides: any): any {
    return this._populate
      .depositCollateral(collaterals, ICRWithFees, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawCollateral} */
  // @ts-expect-error: Testing
  withdrawCollateral(collaterals: any, ICRWithFees: any, overrides: any): any {
    return this._populate
      .withdrawCollateral(collaterals, ICRWithFees, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.borrowSTAR} */
  // @ts-expect-error: Testing
  borrowSTAR(amount, ICRWithFees, maxBorrowingRate, overrides: any): any {
    return this._populate
      .borrowSTAR(amount, ICRWithFees, maxBorrowingRate, overrides)
      .then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.repaySTAR} */
  // @ts-expect-error: Testing
  repaySTAR(amount: any, ICRWithFees: any, overrides: any): any {
    return this._populate.repaySTAR(amount, ICRWithFees, overrides).then(sendTransaction);
  }
  /** @internal */
  // @ts-expect-error: Testing
  setPrice(price: any, overrides: any): any {
    return this._populate.setPrice(price, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidate} */
  // @ts-expect-error: Testing
  liquidate(address: any, liquidator: any, overrides: any): any {
    return this._populate.liquidate(address, liquidator, overrides).then(sendTransaction);
  }
  depositSTARInStabilityPool(amount: any, overrides: any): any {
    return this._populate.depositSTARInStabilityPool(amount, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawSTARFromStabilityPool} */
  // @ts-expect-error: Testing
  withdrawSTARFromStabilityPool(amount: any, overrides: any): any {
    return this._populate.withdrawSTARFromStabilityPool(amount, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStabilityPool} */
  // @ts-expect-error: Testing
  withdrawGainsFromStabilityPool(overrides: any): any {
    return this._populate.withdrawGainsFromStabilityPool(overrides).then(sendTransaction);
  }
  claimRewardsSwap(amount: any, overrides: any): any {
    return this._populate.claimRewardsSwap(amount, overrides).then(sendTransaction);
  }
  stakeLPTokens(amount: any, tokenId: any, overrides: any): any {
    console.log("@STAKE:", +amount, +tokenId);
    return this._populate.stakeLPTokens(amount, tokenId, overrides).then(sendTransaction);
  }
  withdrawLPTokens(amount: any, overrides: any): any {
    return this._populate.withdrawLPTokens(amount, overrides).then(sendTransaction);
  }
  stakeLPTokensOldFarm(amount: any, overrides: any): any {
    return this._populate.stakeLPTokensOldFarm(amount, overrides).then(sendTransaction);
  }
  withdrawLPTokensOldFarm(amount: any, overrides: any): any {
    return this._populate.withdrawLPTokensOldFarm(amount, overrides).then(sendTransaction);
  }
  getVePreonStakeReward(overrides: any): any {
    return this._populate.getVePreonStakeReward(overrides).then(sendTransaction);
  }
  getFarmRewards(overrides: any): any {
    return this._populate.getFarmRewards(overrides).then(sendTransaction);
  }
  getOldFarmRewards(overrides: any): any {
    return this._populate.getOldFarmRewards(overrides).then(sendTransaction);
  }
  updateVEPREON(params: any, overrides: any): any {
    return this._populate.updateVEPREON(params, overrides).then(sendTransaction);
  }
  notifyAllRewarders(overrides: any): any {
    return this._populate.notifyAllRewarders(overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.transferCollateralGainToTrove} */
  // @ts-expect-error: Testing
  transferCollateralGainToTrove(overrides: any): any {
    return this._populate.transferCollateralGainToTrove(overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendSTAR} */
  // @ts-expect-error: Testing
  sendSTAR(toAddress: any, amount: any, overrides: any): any {
    return this._populate.sendSTAR(toAddress, amount, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendPREON} */
  sendPREON(toAddress: any, amount: any, overrides: any): any {
    return this._populate.sendPREON(toAddress, amount, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.redeemSTAR} */
  // @ts-expect-error: Testing
  redeemSTAR(amount: any, maxRedemptionRate, overrides: any): any {
    return this._populate.redeemSTAR(amount, maxRedemptionRate, overrides).then(sendTransaction);
  }
  /** {@inheritDoc @liquity/lib-base#SendableLiquity.claimCollateralSurplus} */
  // @ts-expect-error: Testing
  claimCollateralSurplus(overrides: any): any {
    return this._populate.claimCollateralSurplus(overrides).then(sendTransaction);
  }

  createLock(amount: any, unlockTime: any, overrides: any): any {
    return this._populate.createLock(amount, unlockTime, overrides).then(sendTransaction);
  }

  increaseVestAmount(amount: any, tokenId: any, overrides: any): any {
    return this._populate.increaseVestAmount(amount, tokenId, overrides).then(sendTransaction);
  }
  increaseVestDuration(tokenId: any, unlockTime: any, overrides: any): any {
    return this._populate.increaseVestDuration(tokenId, unlockTime, overrides).then(sendTransaction);
  }

  merge(from: any, to: any, overrides: any): any {
    return this._populate.merge(from, to, overrides).then(sendTransaction);
  }

  unlock(tokenId: any, overrides: any): any {
    return this._populate.unlock(tokenId, overrides).then(sendTransaction);
  }

  rageQuit(tokenId: any, overrides: any): any {
    return this._populate.rageQuit(tokenId, overrides).then(sendTransaction);
  }

  claimReward(tokenId: any, token: any, overrides: any): any {
    return this._populate.claimReward(tokenId, token, overrides).then(sendTransaction);
  }

  claimMany(tokenIds: any, token: any, overrides: any): any {
    return this._populate.claimMany(tokenIds, token, overrides).then(sendTransaction);
  }

  claimable(tokenIds: any, token: any, overrides: any): any {
    return this._populate.claimable(tokenIds, token, overrides).then(sendTransaction);
  }

  attachment(tokenId: any, overrides: any): any {
    return this._populate.attachment(tokenId, overrides).then(sendTransaction);
  }

  checkTokens(userAddress: any, overrides: any): any {
    return this._populate.checkTokens(userAddress, overrides).then(sendTransaction);
  }

  claimFees(overrides: any): any {
    return this._populate.claimFees(overrides).then(sendTransaction);
  }

  getLockEnded(tokenId: any, overrides: any): any {
    return this._populate.getLockEnded(tokenId, overrides).then(sendTransaction);
  }

  // REMAINING SETTER FUNCTION

  /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendvePREON} */
  // sendvePREON(
  //   toAddress: string,
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.sendvePREON(toAddress, amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.redeemvePREON} */
  // redeemvePREON(
  //   amount: Decimalish,
  //   maxRedemptionRate?: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<RedemptionDetails>> {
  //   return this._populate.redeemvePREON(amount, maxRedemptionRate, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.stakevePREON} */
  // stakevePREON(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.stakevePREON(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.unstakevePREON} */
  // unstakevePREON(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.unstakevePREON(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.openTrove} */
  // async openTrove(
  //   params: TroveCreationParams<Decimalish>,
  //   maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveCreationDetails>> {
  //   return this._populate
  //     .openTrove(params, maxBorrowingRateOrOptionalParams, overrides)
  //     .then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.closeTrove} */
  // closeTrove(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveClosureDetails>> {
  //   return this._populate.closeTrove(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.adjustTrove} */
  // adjustTrove(
  //   params: TroveAdjustmentParams<Decimalish>,
  //   maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>> {
  //   return this._populate
  //     .adjustTrove(params, maxBorrowingRateOrOptionalParams, overrides)
  //     .then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositCollateral} */
  // depositCollateral(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>> {
  //   return this._populate.depositCollateral(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawCollateral} */
  // withdrawCollateral(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>> {
  //   return this._populate.withdrawCollateral(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.borrowSTAR} */
  // borrowSTAR(
  //   amount: Decimalish,
  //   maxBorrowingRate?: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>> {
  //   return this._populate.borrowSTAR(amount, maxBorrowingRate, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.repaySTAR} */
  // repaySTAR(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>> {
  //   return this._populate.repaySTAR(amount, overrides).then(sendTransaction);
  // }

  // /** @internal */
  // setPrice(
  //   price: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.setPrice(price, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidate} */
  // liquidate(
  //   address: string | string[],
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<LiquidationDetails>> {
  //   return this._populate.liquidate(address, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidateUpTo} */
  // liquidateUpTo(
  //   maximumNumberOfTrovesToLiquidate: number,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<LiquidationDetails>> {
  //   return this._populate
  //     .liquidateUpTo(maximumNumberOfTrovesToLiquidate, overrides)
  //     .then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositSTARInStabilityPool} */
  // depositSTARInStabilityPool(
  //   amount: Decimalish,
  //   frontendTag?: string,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<StabilityDepositChangeDetails>> {
  //   return this._populate
  //     .depositSTARInStabilityPool(amount, frontendTag, overrides)
  //     .then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawSTARFromStabilityPool} */
  // withdrawSTARFromStabilityPool(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<StabilityDepositChangeDetails>> {
  //   return this._populate.withdrawSTARFromStabilityPool(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStabilityPool} */
  // withdrawGainsFromStabilityPool(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<StabilityPoolGainsWithdrawalDetails>> {
  //   return this._populate.withdrawGainsFromStabilityPool(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.transferCollateralGainToTrove} */
  // transferCollateralGainToTrove(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<CollateralGainTransferDetails>> {
  //   return this._populate.transferCollateralGainToTrove(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendSTAR} */
  // sendSTAR(
  //   toAddress: string,
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.sendSTAR(toAddress, amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendLQTY} */
  // sendLQTY(
  //   toAddress: string,
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.sendLQTY(toAddress, amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.redeemSTAR} */
  // redeemSTAR(
  //   amount: Decimalish,
  //   maxRedemptionRate?: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<RedemptionDetails>> {
  //   return this._populate.redeemSTAR(amount, maxRedemptionRate, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.claimCollateralSurplus} */
  // claimCollateralSurplus(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.claimCollateralSurplus(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.stakeLQTY} */
  // stakeLQTY(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.stakeLQTY(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.unstakeLQTY} */
  // unstakeLQTY(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.unstakeLQTY(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStaking} */
  // withdrawGainsFromStaking(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.withdrawGainsFromStaking(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.registerFrontend} */
  // registerFrontend(
  //   kickbackRate: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.registerFrontend(kickbackRate, overrides).then(sendTransaction);
  // }

  // /** @internal */
  // _mintUniToken(
  //   amount: Decimalish,
  //   address?: string,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate._mintUniToken(amount, address, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.approveUniTokens} */
  // approveUniTokens(
  //   allowance?: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.approveUniTokens(allowance, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.stakeUniTokens} */
  // stakeUniTokens(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.stakeUniTokens(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.unstakeUniTokens} */
  // unstakeUniTokens(
  //   amount: Decimalish,
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.unstakeUniTokens(amount, overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawLQTYRewardFromLiquidityMining} */
  // withdrawLQTYRewardFromLiquidityMining(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.withdrawLQTYRewardFromLiquidityMining(overrides).then(sendTransaction);
  // }

  // /** {@inheritDoc @liquity/lib-base#SendableLiquity.exitLiquidityMining} */
  // exitLiquidityMining(
  //   overrides?: EthersTransactionOverrides
  // ): Promise<SentEthersLiquityTransaction<void>> {
  //   return this._populate.exitLiquidityMining(overrides).then(sendTransaction);
  // }
}
