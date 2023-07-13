import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Log } from "@ethersproject/abstract-provider";
import { BytesLike } from "@ethersproject/bytes";
import { Overrides, CallOverrides, PayableOverrides, EventFilter } from "@ethersproject/contracts";

import { _TypedLiquityContract, _TypedLogDescription } from "../src/contracts";
import { EthersTransactionOverrides } from "../src/types";

interface ActivePoolCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  defaultPoolAddress(_overrides?: CallOverrides): Promise<string>;
  getETH(_overrides?: CallOverrides): Promise<BigNumber>;
  getSTARDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  owner(_overrides?: CallOverrides): Promise<string>;
  stabilityPoolAddress(_overrides?: CallOverrides): Promise<string>;
  troveManagerAddress(_overrides?: CallOverrides): Promise<string>;
}

interface ActivePoolTransactions {
  decreaseSTARDebt(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  increaseSTARDebt(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  sendETH(_account: string, _amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _borrowerOperationsAddress: string,
    _troveManagerAddress: string,
    _stabilityPoolAddress: string,
    _defaultPoolAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface ActivePool extends _TypedLiquityContract<ActivePoolCalls, ActivePoolTransactions> {
  getAllCollateral(): any;
  getCollateralVC(coll: string): any;
  readonly filters: {
    ActivePoolAddressChanged(_newActivePoolAddress?: null): EventFilter;
    ActivePoolETHBalanceUpdated(_ETH?: null): EventFilter;
    ActivePoolSTARDebtUpdated(_STARDebt?: null): EventFilter;
    BorrowerOperationsAddressChanged(_newBorrowerOperationsAddress?: null): EventFilter;
    DefaultPoolAddressChanged(_newDefaultPoolAddress?: null): EventFilter;
    ETHBalanceUpdated(_newBalance?: null): EventFilter;
    EtherSent(_to?: null, _amount?: null): EventFilter;
    STARBalanceUpdated(_newBalance?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    StabilityPoolAddressChanged(_newStabilityPoolAddress?: null): EventFilter;
    TroveManagerAddressChanged(_newTroveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _newActivePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "ActivePoolETHBalanceUpdated"
  ): _TypedLogDescription<{ _ETH: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "ActivePoolSTARDebtUpdated"
  ): _TypedLogDescription<{ _STARDebt: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _newBorrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolAddressChanged"
  ): _TypedLogDescription<{ _newDefaultPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "ETHBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "EtherSent"
  ): _TypedLogDescription<{ _to: string; _amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "STARBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressChanged"
  ): _TypedLogDescription<{ _newStabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _newTroveManagerAddress: string }>[];
  extractEvents(logs: Log[], name: "CollateralsSent"): _TypedLogDescription<any>[];
  removeListener;
  on;
}

interface BorrowerOperationsCalls {
  BORROWING_FEE_FLOOR(_overrides?: CallOverrides): Promise<BigNumber>;
  CCR(_overrides?: CallOverrides): Promise<BigNumber>;
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  STAR_GAS_COMPENSATION(_overrides?: CallOverrides): Promise<BigNumber>;
  MCR(_overrides?: CallOverrides): Promise<BigNumber>;
  MIN_NET_DEBT(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  PERCENT_DIVISOR(_overrides?: CallOverrides): Promise<BigNumber>;
  _100pct(_overrides?: CallOverrides): Promise<BigNumber>;
  activePool(_overrides?: CallOverrides): Promise<string>;
  defaultPool(_overrides?: CallOverrides): Promise<string>;
  getCompositeDebt(_debt: BigNumberish, _overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemColl(_overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  preonStaking(_overrides?: CallOverrides): Promise<string>;
  preonStakingAddress(_overrides?: CallOverrides): Promise<string>;
  starToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  priceFeed(_overrides?: CallOverrides): Promise<string>;
  sortedTroves(_overrides?: CallOverrides): Promise<string>;
  troveManager(_overrides?: CallOverrides): Promise<string>;
  openTroveLeverUp(...args: any): Promise<unknown>;
}

interface BorrowerOperationsTransactions {
  addColl(_upperHint: string, _lowerHint: string, _overrides?: PayableOverrides): Promise<void>;
  adjustTrove(
    _collateralNamesDeposit: string[],
    _amountDeposit: string[],
    _collateralNamesWithdraw: string[],
    _amountWithdraw: string[],
    _borrowChange: BigNumberish,
    _isDebtIncrease: boolean,
    _upperHint: string,
    _lowerHint: string,
    _maxBorrowingRate: BigNumberish,
    _overrides?: PayableOverrides
  ): Promise<void>;
  claimCollateral(_overrides?: Overrides): Promise<void>;
  closeTrove(_overrides?: Overrides): Promise<void>;
  moveETHGainToTrove(
    _borrower: string,
    _upperHint: string,
    _lowerHint: string,
    _overrides?: PayableOverrides
  ): Promise<void>;
  openTrove(
    _maxFeePercentage: BigNumberish,
    _STARAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string,
    _collateralNames: any,
    _collateral: any,
    _overrides: PayableOverrides
  ): Promise<void>;
  repaySTAR(
    _STARAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string,
    _overrides?: Overrides
  ): Promise<void>;
  setAddresses(
    _troveManagerAddress: string,
    _activePoolAddress: string,
    _defaultPoolAddress: string,
    _stabilityPoolAddress: string,
    _gasPoolAddress: string,
    _collSurplusPoolAddress: string,
    _priceFeedAddress: string,
    _sortedTrovesAddress: string,
    _starTokenAddress: string,
    _preonStakingAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
  withdrawColl(
    _collWithdrawal: BigNumberish,
    _upperHint: string,
    _lowerHint: string,
    _overrides?: Overrides
  ): Promise<void>;
  withdrawSTAR(
    _maxFeePercentage: BigNumberish,
    _STARAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface BorrowerOperations
  extends _TypedLiquityContract<BorrowerOperationsCalls, BorrowerOperationsTransactions> {
  readonly filters: {
    ActivePoolAddressChanged(_activePoolAddress?: null): EventFilter;
    CollSurplusPoolAddressChanged(_collSurplusPoolAddress?: null): EventFilter;
    DefaultPoolAddressChanged(_defaultPoolAddress?: null): EventFilter;
    GasPoolAddressChanged(_gasPoolAddress?: null): EventFilter;
    PREONStakingAddressChanged(_preonStakingAddress?: null): EventFilter;
    STARBorrowingFeePaid(_borrower?: string | null, _STARFee?: null): EventFilter;
    STARTokenAddressChanged(_starTokenAddress?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    PriceFeedAddressChanged(_newPriceFeedAddress?: null): EventFilter;
    SortedTrovesAddressChanged(_sortedTrovesAddress?: null): EventFilter;
    StabilityPoolAddressChanged(_stabilityPoolAddress?: null): EventFilter;
    TroveCreated(_borrower?: string | null, arrayIndex?: null): EventFilter;
    TroveManagerAddressChanged(_newTroveManagerAddress?: null): EventFilter;
    TroveUpdated(
      _borrower?: string | null,
      _debt?: null,
      _coll?: null,
      stake?: null,
      operation?: null
    ): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _activePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "CollSurplusPoolAddressChanged"
  ): _TypedLogDescription<{ _collSurplusPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolAddressChanged"
  ): _TypedLogDescription<{ _defaultPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "GasPoolAddressChanged"
  ): _TypedLogDescription<{ _gasPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "PREONStakingAddressChanged"
  ): _TypedLogDescription<{ _preonStakingAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "STARBorrowingFeePaid"
  ): _TypedLogDescription<{ _borrower: string; _STARFee: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "STARTokenAddressChanged"
  ): _TypedLogDescription<{ _starTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "PriceFeedAddressChanged"
  ): _TypedLogDescription<{ _newPriceFeedAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "SortedTrovesAddressChanged"
  ): _TypedLogDescription<{ _sortedTrovesAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressChanged"
  ): _TypedLogDescription<{ _stabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveCreated"
  ): _TypedLogDescription<{ _borrower: string; arrayIndex: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _newTroveManagerAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveUpdated"
  ): _TypedLogDescription<{
    _borrower: string;
    _debt: BigNumber;
    _coll: BigNumber;
    stake: BigNumber;
    operation: number;
  }>[];

  removeListener;
  on;
}

interface CollSurplusPoolCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  activePoolAddress(_overrides?: CallOverrides): Promise<string>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  getCollateral(_account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getETH(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  owner(_overrides?: CallOverrides): Promise<string>;
  troveManagerAddress(_overrides?: CallOverrides): Promise<string>;
}

interface CollSurplusPoolTransactions {
  accountSurplus(_account: string, _amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  claimColl(_account: string, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _borrowerOperationsAddress: string,
    _troveManagerAddress: string,
    _activePoolAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface CollSurplusPool
  extends _TypedLiquityContract<CollSurplusPoolCalls, CollSurplusPoolTransactions> {
  hasClaimableCollateral(address: any);
  getRedemptionBonus(address: any);
  getAmountsClaimable(userAddress: string, overrides: any): any;
  readonly filters: {
    ActivePoolAddressChanged(_newActivePoolAddress?: null): EventFilter;
    BorrowerOperationsAddressChanged(_newBorrowerOperationsAddress?: null): EventFilter;
    CollBalanceUpdated(_account?: string | null, _newBalance?: null): EventFilter;
    EtherSent(_to?: null, _amount?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    TroveManagerAddressChanged(_newTroveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _newActivePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _newBorrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "CollBalanceUpdated"
  ): _TypedLogDescription<{ _account: string; _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "EtherSent"
  ): _TypedLogDescription<{ _to: string; _amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _newTroveManagerAddress: string }>[];
}

interface CommunityIssuanceCalls {
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  ISSUANCE_FACTOR(_overrides?: CallOverrides): Promise<BigNumber>;
  PREONSupplyCap(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  SECONDS_IN_ONE_MINUTE(_overrides?: CallOverrides): Promise<BigNumber>;
  deploymentTime(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  preonToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  stabilityPoolAddress(_overrides?: CallOverrides): Promise<string>;
  totalPREONIssued(_overrides?: CallOverrides): Promise<BigNumber>;
}

interface CommunityIssuanceTransactions {
  issuePREON(_overrides?: Overrides): Promise<BigNumber>;
  sendPREON(_account: string, _PREONamount: BigNumberish, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _preonTokenAddress: string,
    _stabilityPoolAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface CommunityIssuance
  extends _TypedLiquityContract<CommunityIssuanceCalls, CommunityIssuanceTransactions> {
  readonly filters: {
    PREONTokenAddressSet(_preonTokenAddress?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    StabilityPoolAddressSet(_stabilityPoolAddress?: null): EventFilter;
    TotalPREONIssuedUpdated(_totalPREONIssued?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "PREONTokenAddressSet"
  ): _TypedLogDescription<{ _preonTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressSet"
  ): _TypedLogDescription<{ _stabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TotalPREONIssuedUpdated"
  ): _TypedLogDescription<{ _totalPREONIssued: BigNumber }>[];
}

interface DefaultPoolCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  activePoolAddress(_overrides?: CallOverrides): Promise<string>;
  getETH(_overrides?: CallOverrides): Promise<BigNumber>;
  getSTARDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  owner(_overrides?: CallOverrides): Promise<string>;
  troveManagerAddress(_overrides?: CallOverrides): Promise<string>;
}

interface DefaultPoolTransactions {
  decreaseSTARDebt(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  increaseSTARDebt(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  sendETHToActivePool(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _troveManagerAddress: string,
    _activePoolAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface DefaultPool
  extends _TypedLiquityContract<DefaultPoolCalls, DefaultPoolTransactions> {
  address;
  getAllCollateral(): any;
  getCollateralVC(coll: string): any;
  readonly filters: {
    ActivePoolAddressChanged(_newActivePoolAddress?: null): EventFilter;
    DefaultPoolAddressChanged(_newDefaultPoolAddress?: null): EventFilter;
    DefaultPoolETHBalanceUpdated(_ETH?: null): EventFilter;
    DefaultPoolSTARDebtUpdated(_STARDebt?: null): EventFilter;
    ETHBalanceUpdated(_newBalance?: null): EventFilter;
    EtherSent(_to?: null, _amount?: null): EventFilter;
    STARBalanceUpdated(_newBalance?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    StabilityPoolAddressChanged(_newStabilityPoolAddress?: null): EventFilter;
    TroveManagerAddressChanged(_newTroveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _newActivePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolAddressChanged"
  ): _TypedLogDescription<{ _newDefaultPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolETHBalanceUpdated"
  ): _TypedLogDescription<{ _ETH: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolSTARDebtUpdated"
  ): _TypedLogDescription<{ _STARDebt: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "ETHBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "EtherSent"
  ): _TypedLogDescription<{ _to: string; _amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "STARBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressChanged"
  ): _TypedLogDescription<{ _newStabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _newTroveManagerAddress: string }>[];
}

interface ERC20MockCalls {
  allowance(owner: string, spender: string, _overrides?: CallOverrides): Promise<BigNumber>;
  balanceOf(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  decimals(_overrides?: CallOverrides): Promise<number>;
  name(_overrides?: CallOverrides): Promise<string>;
  symbol(_overrides?: CallOverrides): Promise<string>;
  totalSupply(_overrides?: CallOverrides): Promise<BigNumber>;
}

interface ERC20MockTransactions {
  approve(spender: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  approveInternal(
    owner: string,
    spender: string,
    value: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  burn(account: string, amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  mint(account: string, amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  transfer(recipient: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  transferInternal(
    from: string,
    to: string,
    value: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface ERC20Mock extends _TypedLiquityContract<ERC20MockCalls, ERC20MockTransactions> {
  readonly filters: {
    Approval(owner?: string | null, spender?: string | null, value?: null): EventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "Approval"
  ): _TypedLogDescription<{ owner: string; spender: string; value: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "Transfer"
  ): _TypedLogDescription<{ from: string; to: string; value: BigNumber }>[];
}

interface GasPoolCalls {}

interface GasPoolTransactions {}

export interface GasPool extends _TypedLiquityContract<GasPoolCalls, GasPoolTransactions> {
  readonly filters: {};
}

interface HintHelpersCalls {
  BORROWING_FEE_FLOOR(_overrides?: CallOverrides): Promise<BigNumber>;
  CCR(_overrides?: CallOverrides): Promise<BigNumber>;
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  STAR_GAS_COMPENSATION(_overrides?: CallOverrides): Promise<BigNumber>;
  MCR(_overrides?: CallOverrides): Promise<BigNumber>;
  MIN_NET_DEBT(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  PERCENT_DIVISOR(_overrides?: CallOverrides): Promise<BigNumber>;
  _100pct(_overrides?: CallOverrides): Promise<BigNumber>;
  activePool(_overrides?: CallOverrides): Promise<string>;
  computeCR(
    _coll: BigNumberish,
    _debt: BigNumberish,
    _price: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<BigNumber>;
  computeNominalCR(
    _coll: BigNumberish,
    _debt: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<BigNumber>;
  defaultPool(_overrides?: CallOverrides): Promise<string>;
  getApproxHint(
    _CR: BigNumberish,
    _numTrials: BigNumberish,
    _inputRandomSeed: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<{ hintAddress: string; diff: BigNumber; latestRandomSeed: BigNumber }>;
  getEntireSystemColl(_overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  getRedemptionHints(
    _STARamount: BigNumberish,
    _price: BigNumberish,
    _maxIterations?: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<{
    firstRedemptionHint: string;
    partialRedemptionHintAICR: BigNumber;
    truncatedSTARamount: BigNumber;
  }>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  owner(_overrides?: CallOverrides): Promise<string>;
  priceFeed(_overrides?: CallOverrides): Promise<string>;
  sortedTroves(_overrides?: CallOverrides): Promise<string>;
  troveManager(_overrides?: CallOverrides): Promise<string>;
}

interface HintHelpersTransactions {
  setAddresses(
    _sortedTrovesAddress: string,
    _troveManagerAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface HintHelpers
  extends _TypedLiquityContract<HintHelpersCalls, HintHelpersTransactions> {
  readonly filters: {
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    SortedTrovesAddressChanged(_sortedTrovesAddress?: null): EventFilter;
    TroveManagerAddressChanged(_troveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "SortedTrovesAddressChanged"
  ): _TypedLogDescription<{ _sortedTrovesAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _troveManagerAddress: string }>[];
}

interface IERC20Calls {
  allowance(owner: string, spender: string, _overrides?: CallOverrides): Promise<BigNumber>;
  balanceOf(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  totalSupply(_overrides?: CallOverrides): Promise<BigNumber>;
}

interface IERC20Transactions {
  approve(spender: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  transfer(recipient: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
}

export interface IERC20 extends _TypedLiquityContract<IERC20Calls, IERC20Transactions> {
  readonly filters: {
    Approval(owner?: string | null, spender?: string | null, value?: null): EventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "Approval"
  ): _TypedLogDescription<{ owner: string; spender: string; value: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "Transfer"
  ): _TypedLogDescription<{ from: string; to: string; value: BigNumber }>[];
}

interface LockupContractFactoryCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  SECONDS_IN_ONE_YEAR(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  isRegisteredLockup(_contractAddress: string, _overrides?: CallOverrides): Promise<boolean>;
  lockupContractToDeployer(arg0: string, _overrides?: CallOverrides): Promise<string>;
  preonTokenAddress(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
}

interface LockupContractFactoryTransactions {
  deployLockupContract(
    _beneficiary: string,
    _unlockTime: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  setPREONTokenAddress(_preonTokenAddress: string, _overrides?: Overrides): Promise<void>;
}

export interface LockupContractFactory
  extends _TypedLiquityContract<LockupContractFactoryCalls, LockupContractFactoryTransactions> {
  readonly filters: {
    PREONTokenAddressSet(_preonTokenAddress?: null): EventFilter;
    LockupContractDeployedThroughFactory(
      _lockupContractAddress?: null,
      _beneficiary?: null,
      _unlockTime?: null,
      _deployer?: null
    ): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "PREONTokenAddressSet"
  ): _TypedLogDescription<{ _preonTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "LockupContractDeployedThroughFactory"
  ): _TypedLogDescription<{
    _lockupContractAddress: string;
    _beneficiary: string;
    _unlockTime: BigNumber;
    _deployer: string;
  }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
}

interface STARTokenCalls {
  allowance(owner: string, spender: string, _overrides?: CallOverrides): Promise<BigNumber>;
  balanceOf(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  decimals(_overrides?: CallOverrides): Promise<number>;
  domainSeparator(_overrides?: CallOverrides): Promise<string>;
  name(_overrides?: CallOverrides): Promise<string>;
  nonces(owner: string, _overrides?: CallOverrides): Promise<BigNumber>;
  permitTypeHash(_overrides?: CallOverrides): Promise<string>;
  stabilityPoolAddress(_overrides?: CallOverrides): Promise<string>;
  symbol(_overrides?: CallOverrides): Promise<string>;
  totalSupply(_overrides?: CallOverrides): Promise<BigNumber>;
  troveManagerAddress(_overrides?: CallOverrides): Promise<string>;
  version(_overrides?: CallOverrides): Promise<string>;
}

interface STARTokenTransactions {
  approve(spender: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  burn(_account: string, _amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  mint(_account: string, _amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  permit(
    owner: string,
    spender: string,
    amount: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    _overrides?: Overrides
  ): Promise<void>;
  returnFromPool(
    _poolAddress: string,
    _receiver: string,
    _amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  sendToPool(
    _sender: string,
    _poolAddress: string,
    _amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  transfer(recipient: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
}

export interface STARToken extends _TypedLiquityContract<STARTokenCalls, STARTokenTransactions> {
  readonly filters: {
    Approval(owner?: string | null, spender?: string | null, value?: null): EventFilter;
    BorrowerOperationsAddressChanged(_newBorrowerOperationsAddress?: null): EventFilter;
    STARTokenBalanceUpdated(_user?: null, _amount?: null): EventFilter;
    StabilityPoolAddressChanged(_newStabilityPoolAddress?: null): EventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): EventFilter;
    TroveManagerAddressChanged(_troveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "Approval"
  ): _TypedLogDescription<{ owner: string; spender: string; value: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _newBorrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "STARTokenBalanceUpdated"
  ): _TypedLogDescription<{ _user: string; _amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressChanged"
  ): _TypedLogDescription<{ _newStabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "Transfer"
  ): _TypedLogDescription<{ from: string; to: string; value: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _troveManagerAddress: string }>[];
}

interface PREONStakingCalls {
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  F_ETH(_overrides?: CallOverrides): Promise<BigNumber>;
  F_STAR(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  activePoolAddress(_overrides?: CallOverrides): Promise<string>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  getPendingETHGain(_user: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getPendingSTARGain(_user: string, _overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  preonToken(_overrides?: CallOverrides): Promise<string>;
  starToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  snapshots(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ F_ETH_Snapshot: BigNumber; F_STAR_Snapshot: BigNumber }>;
  stakes(arg0: string, _overrides?: CallOverrides): Promise<BigNumber>;
  totalvePREONStaked(_overrides?: CallOverrides): Promise<BigNumber>;
  troveManagerAddress(_overrides?: CallOverrides): Promise<string>;
}

interface PREONStakingTransactions {
  increaseF_ETH(_ETHFee: BigNumberish, _overrides?: Overrides): Promise<void>;
  increaseF_STAR(_STARFee: BigNumberish, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _preonTokenAddress: string,
    _starTokenAddress: string,
    _troveManagerAddress: string,
    _borrowerOperationsAddress: string,
    _activePoolAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
  stake(_PREONamount: BigNumberish, _overrides?: Overrides): Promise<void>;
  unstake(_PREONamount: BigNumberish, _overrides?: Overrides): Promise<void>;
}

export interface PREONStaking
  extends _TypedLiquityContract<PREONStakingCalls, PREONStakingTransactions> {
  readonly filters: {
    ActivePoolAddressSet(_activePoolAddress?: null): EventFilter;
    BorrowerOperationsAddressSet(_borrowerOperationsAddress?: null): EventFilter;
    EtherSent(_account?: null, _amount?: null): EventFilter;
    F_ETHUpdated(_F_ETH?: null): EventFilter;
    F_STARUpdated(_F_STAR?: null): EventFilter;
    PREONTokenAddressSet(_preonTokenAddress?: null): EventFilter;
    STARTokenAddressSet(_starTokenAddress?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    StakeChanged(staker?: string | null, newStake?: null): EventFilter;
    StakerSnapshotsUpdated(_staker?: null, _F_ETH?: null, _F_STAR?: null): EventFilter;
    StakingGainsWithdrawn(staker?: string | null, STARGain?: null, ETHGain?: null): EventFilter;
    TotalvePREONStakedUpdated(_totalvePREONStaked?: null): EventFilter;
    TroveManagerAddressSet(_troveManager?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressSet"
  ): _TypedLogDescription<{ _activePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressSet"
  ): _TypedLogDescription<{ _borrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "EtherSent"
  ): _TypedLogDescription<{ _account: string; _amount: BigNumber }>[];
  extractEvents(logs: Log[], name: "F_ETHUpdated"): _TypedLogDescription<{ _F_ETH: BigNumber }>[];
  extractEvents(logs: Log[], name: "F_STARUpdated"): _TypedLogDescription<{ _F_STAR: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "PREONTokenAddressSet"
  ): _TypedLogDescription<{ _preonTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "STARTokenAddressSet"
  ): _TypedLogDescription<{ _starTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "StakeChanged"
  ): _TypedLogDescription<{ staker: string; newStake: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "StakerSnapshotsUpdated"
  ): _TypedLogDescription<{ _staker: string; _F_ETH: BigNumber; _F_STAR: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "StakingGainsWithdrawn"
  ): _TypedLogDescription<{ staker: string; STARGain: BigNumber; ETHGain: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TotalvePREONStakedUpdated"
  ): _TypedLogDescription<{ _totalvePREONStaked: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressSet"
  ): _TypedLogDescription<{ _troveManager: string }>[];
}

interface PREONTokenCalls {
  ONE_YEAR_IN_SECONDS(_overrides?: CallOverrides): Promise<BigNumber>;
  allowance(owner: string, spender: string, _overrides?: CallOverrides): Promise<BigNumber>;
  balanceOf(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  communityIssuanceAddress(_overrides?: CallOverrides): Promise<string>;
  decimals(_overrides?: CallOverrides): Promise<number>;
  domainSeparator(_overrides?: CallOverrides): Promise<string>;
  getDeploymentStartTime(_overrides?: CallOverrides): Promise<BigNumber>;
  getLpRewardsEntitlement(_overrides?: CallOverrides): Promise<BigNumber>;
  lockupContractFactory(_overrides?: CallOverrides): Promise<string>;
  preonStakingAddress(_overrides?: CallOverrides): Promise<string>;
  multisigAddress(_overrides?: CallOverrides): Promise<string>;
  name(_overrides?: CallOverrides): Promise<string>;
  nonces(owner: string, _overrides?: CallOverrides): Promise<BigNumber>;
  permitTypeHash(_overrides?: CallOverrides): Promise<string>;
  symbol(_overrides?: CallOverrides): Promise<string>;
  totalSupply(_overrides?: CallOverrides): Promise<BigNumber>;
  version(_overrides?: CallOverrides): Promise<string>;
}

interface PREONTokenTransactions {
  approve(spender: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
  permit(
    owner: string,
    spender: string,
    amount: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    _overrides?: Overrides
  ): Promise<void>;
  sendToPREONStaking(_sender: string, _amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  transfer(recipient: string, amount: BigNumberish, _overrides?: Overrides): Promise<boolean>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    _overrides?: Overrides
  ): Promise<boolean>;
}

export interface PREONToken extends _TypedLiquityContract<PREONTokenCalls, PREONTokenTransactions> {
  readonly filters: {
    Approval(owner?: string | null, spender?: string | null, value?: null): EventFilter;
    CommunityIssuanceAddressSet(_communityIssuanceAddress?: null): EventFilter;
    PREONStakingAddressSet(_preonStakingAddress?: null): EventFilter;
    LockupContractFactoryAddressSet(_lockupContractFactoryAddress?: null): EventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "Approval"
  ): _TypedLogDescription<{ owner: string; spender: string; value: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "CommunityIssuanceAddressSet"
  ): _TypedLogDescription<{ _communityIssuanceAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "PREONStakingAddressSet"
  ): _TypedLogDescription<{ _preonStakingAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "LockupContractFactoryAddressSet"
  ): _TypedLogDescription<{ _lockupContractFactoryAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "Transfer"
  ): _TypedLogDescription<{ from: string; to: string; value: BigNumber }>[];
}

interface MultiTroveGetterCalls {
  getMultipleSortedTroves(
    _startIdx: BigNumberish,
    _count: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<
    {
      owner: string;
      debt: BigNumber;
      coll: BigNumber;
      stake: BigNumber;
      snapshotETH: BigNumber;
      snapshotSTARDebt: BigNumber;
    }[]
  >;
  sortedTroves(_overrides?: CallOverrides): Promise<string>;
  troveManager(_overrides?: CallOverrides): Promise<string>;
}

interface MultiTroveGetterTransactions {}

export interface MultiTroveGetter
  extends _TypedLiquityContract<MultiTroveGetterCalls, MultiTroveGetterTransactions> {
  readonly filters: {};
}

interface PriceFeedCalls {
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  ETHUSD_TELLOR_REQ_ID(_overrides?: CallOverrides): Promise<BigNumber>;
  MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND(_overrides?: CallOverrides): Promise<BigNumber>;
  MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  TARGET_DIGITS(_overrides?: CallOverrides): Promise<BigNumber>;
  TELLOR_DIGITS(_overrides?: CallOverrides): Promise<BigNumber>;
  TIMEOUT(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  lastGoodPrice(_overrides?: CallOverrides): Promise<BigNumber>;
  owner(_overrides?: CallOverrides): Promise<string>;
  priceAggregator(_overrides?: CallOverrides): Promise<string>;
  status(_overrides?: CallOverrides): Promise<number>;
  tellorCaller(_overrides?: CallOverrides): Promise<string>;
}

interface PriceFeedTransactions {
  fetchPrice(_overrides?: Overrides): Promise<BigNumber>;
  setAddresses(
    _priceAggregatorAddress: string,
    _tellorCallerAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface PriceFeed extends _TypedLiquityContract<PriceFeedCalls, PriceFeedTransactions> {
  readonly filters: {
    LastGoodPriceUpdated(_lastGoodPrice?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    PriceFeedStatusChanged(newStatus?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "LastGoodPriceUpdated"
  ): _TypedLogDescription<{ _lastGoodPrice: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "PriceFeedStatusChanged"
  ): _TypedLogDescription<{ newStatus: number }>[];
  fetchPrice_v(_overrides?: Overrides): Promise<BigNumber>;
}

interface PriceFeedTestnetCalls {
  getPrice(_overrides?: CallOverrides): Promise<BigNumber>;
}

interface PriceFeedTestnetTransactions {
  fetchPrice(_overrides?: Overrides): Promise<BigNumber>;
  fetchPrice_v(_overrides?: Overrides): Promise<BigNumber>;
  setPrice(price: BigNumberish, _overrides?: Overrides): Promise<boolean>;
}

export interface PriceFeedTestnet
  extends _TypedLiquityContract<PriceFeedTestnetCalls, PriceFeedTestnetTransactions> {
  readonly filters: {
    LastGoodPriceUpdated(_lastGoodPrice?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "LastGoodPriceUpdated"
  ): _TypedLogDescription<{ _lastGoodPrice: BigNumber }>[];
}

interface SortedTrovesCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  contains(_id: string, _overrides?: CallOverrides): Promise<boolean>;
  data(
    _overrides?: CallOverrides
  ): Promise<{ head: string; tail: string; maxSize: BigNumber; size: BigNumber }>;
  findInsertPosition(
    _NICR: BigNumberish,
    _prevId: string,
    _nextId: string,
    _overrides?: CallOverrides
  ): Promise<[string, string]>;
  getFirst(_overrides?: CallOverrides): Promise<string>;
  getLast(_overrides?: CallOverrides): Promise<string>;
  getMaxSize(_overrides?: CallOverrides): Promise<BigNumber>;
  getNext(_id: string, _overrides?: CallOverrides): Promise<string>;
  getPrev(_id: string, _overrides?: CallOverrides): Promise<string>;
  getSize(_overrides?: CallOverrides): Promise<BigNumber>;
  isEmpty(_overrides?: CallOverrides): Promise<boolean>;
  isFull(_overrides?: CallOverrides): Promise<boolean>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  owner(_overrides?: CallOverrides): Promise<string>;
  troveManager(_overrides?: CallOverrides): Promise<string>;
  validInsertPosition(
    _NICR: BigNumberish,
    _prevId: string,
    _nextId: string,
    _overrides?: CallOverrides
  ): Promise<boolean>;
}

interface SortedTrovesTransactions {
  insert(
    _id: string,
    _NICR: BigNumberish,
    _prevId: string,
    _nextId: string,
    _overrides?: Overrides
  ): Promise<void>;
  reInsert(
    _id: string,
    _newNICR: BigNumberish,
    _prevId: string,
    _nextId: string,
    _overrides?: Overrides
  ): Promise<void>;
  remove(_id: string, _overrides?: Overrides): Promise<void>;
  setParams(
    _size: BigNumberish,
    _troveManagerAddress: string,
    _borrowerOperationsAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
}

export interface SortedTroves
  extends _TypedLiquityContract<SortedTrovesCalls, SortedTrovesTransactions> {
  globalBoostFactor();
  getDecayedBoost(address: any);
  readonly filters: {
    BorrowerOperationsAddressChanged(_borrowerOperationsAddress?: null): EventFilter;
    NodeAdded(_id?: null, _NICR?: null): EventFilter;
    NodeRemoved(_id?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    SortedTrovesAddressChanged(_sortedDoublyLLAddress?: null): EventFilter;
    TroveManagerAddressChanged(_troveManagerAddress?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _borrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "NodeAdded"
  ): _TypedLogDescription<{ _id: string; _NICR: BigNumber }>[];
  extractEvents(logs: Log[], name: "NodeRemoved"): _TypedLogDescription<{ _id: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "SortedTrovesAddressChanged"
  ): _TypedLogDescription<{ _sortedDoublyLLAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _troveManagerAddress: string }>[];
}

interface StabilityPoolCalls {
  BORROWING_FEE_FLOOR(_overrides?: CallOverrides): Promise<BigNumber>;
  CCR(_overrides?: CallOverrides): Promise<BigNumber>;
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  STAR_GAS_COMPENSATION(_overrides?: CallOverrides): Promise<BigNumber>;
  MCR(_overrides?: CallOverrides): Promise<BigNumber>;
  MIN_NET_DEBT(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  P(_overrides?: CallOverrides): Promise<BigNumber>;
  PERCENT_DIVISOR(_overrides?: CallOverrides): Promise<BigNumber>;
  SCALE_FACTOR(_overrides?: CallOverrides): Promise<BigNumber>;
  _100pct(_overrides?: CallOverrides): Promise<BigNumber>;
  activePool(_overrides?: CallOverrides): Promise<string>;
  borrowerOperations(_overrides?: CallOverrides): Promise<string>;
  communityIssuance(_overrides?: CallOverrides): Promise<string>;
  currentEpoch(_overrides?: CallOverrides): Promise<BigNumber>;
  currentScale(_overrides?: CallOverrides): Promise<BigNumber>;
  defaultPool(_overrides?: CallOverrides): Promise<string>;
  depositSnapshots(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ S: BigNumber; P: BigNumber; G: BigNumber; scale: BigNumber; epoch: BigNumber }>;
  deposits(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ initialValue: BigNumber; frontEndTag: string }>;
  epochToScaleToG(
    arg0: BigNumberish,
    arg1: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<BigNumber>;
  epochToScaleToSum(
    arg0: BigNumberish,
    arg1: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<BigNumber>;
  frontEndSnapshots(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ S: BigNumber; P: BigNumber; G: BigNumber; scale: BigNumber; epoch: BigNumber }>;
  frontEndStakes(arg0: string, _overrides?: CallOverrides): Promise<BigNumber>;
  frontEnds(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ kickbackRate: BigNumber; registered: boolean }>;
  getCompoundedFrontEndStake(_frontEnd: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getCompoundedSTARDeposit(_depositor: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getDepositorETHGain(_depositor: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getDepositorPREONGain(_depositor: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getETH(_overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemColl(_overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  getFrontEndPREONGain(_frontEnd: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getTotalSTARDeposits(_overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  lastETHError_Offset(_overrides?: CallOverrides): Promise<BigNumber>;
  lastPREONError(_overrides?: CallOverrides): Promise<BigNumber>;
  lastSTARLossError_Offset(_overrides?: CallOverrides): Promise<BigNumber>;
  starToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  priceFeed(_overrides?: CallOverrides): Promise<string>;
  sortedTroves(_overrides?: CallOverrides): Promise<string>;
  troveManager(_overrides?: CallOverrides): Promise<string>;
}

interface StabilityPoolTransactions {
  offset(
    _debtToOffset: BigNumberish,
    _collToAdd: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  // provideToSP(_amount: BigNumberish, _frontEndTag: string, _overrides?: Overrides): Promise<void>;
  provideToSP(
    overrides: Overrides,
    addGasForPREONIssuance: BigNumberish,
    depositSTAR: BigNumberish
  ): Promise<void>;
  registerFrontEnd(_kickbackRate: BigNumberish, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _borrowerOperationsAddress: string,
    _troveManagerAddress: string,
    _activePoolAddress: string,
    _starTokenAddress: string,
    _sortedTrovesAddress: string,
    _priceFeedAddress: string,
    _communityIssuanceAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
  withdrawETHGainToTrove(
    _upperHint: string,
    _lowerHint: string,
    _overrides?: Overrides
  ): Promise<void>;
  withdrawFromSP(_amount: BigNumberish, _overrides?: Overrides): Promise<void>;
}

export interface StabilityPool
  extends _TypedLiquityContract<StabilityPoolCalls, StabilityPoolTransactions> {
  readonly filters: {
    ActivePoolAddressChanged(_newActivePoolAddress?: null): EventFilter;
    BorrowerOperationsAddressChanged(_newBorrowerOperationsAddress?: null): EventFilter;
    CommunityIssuanceAddressChanged(_newCommunityIssuanceAddress?: null): EventFilter;
    DefaultPoolAddressChanged(_newDefaultPoolAddress?: null): EventFilter;
    DepositSnapshotUpdated(_depositor?: string | null, _P?: null, _S?: null, _G?: null): EventFilter;
    ETHGainWithdrawn(_depositor?: string | null, _ETH?: null, _STARLoss?: null): EventFilter;
    EpochUpdated(_currentEpoch?: null): EventFilter;
    EtherSent(_to?: null, _amount?: null): EventFilter;
    FrontEndRegistered(_frontEnd?: string | null, _kickbackRate?: null): EventFilter;
    FrontEndSnapshotUpdated(_frontEnd?: string | null, _P?: null, _G?: null): EventFilter;
    FrontEndStakeChanged(
      _frontEnd?: string | null,
      _newFrontEndStake?: null,
      _depositor?: null
    ): EventFilter;
    FrontEndTagSet(_depositor?: string | null, _frontEnd?: string | null): EventFilter;
    G_Updated(_G?: null, _epoch?: null, _scale?: null): EventFilter;
    PREONPaidToDepositor(_depositor?: string | null, _PREON?: null): EventFilter;
    PREONPaidToFrontEnd(_frontEnd?: string | null, _PREON?: null): EventFilter;
    STARTokenAddressChanged(_newSTARTokenAddress?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    P_Updated(_P?: null): EventFilter;
    PriceFeedAddressChanged(_newPriceFeedAddress?: null): EventFilter;
    S_Updated(_S?: null, _epoch?: null, _scale?: null): EventFilter;
    ScaleUpdated(_currentScale?: null): EventFilter;
    SortedTrovesAddressChanged(_newSortedTrovesAddress?: null): EventFilter;
    StabilityPoolETHBalanceUpdated(_newBalance?: null): EventFilter;
    StabilityPoolSTARBalanceUpdated(_newBalance?: null): EventFilter;
    TroveManagerAddressChanged(_newTroveManagerAddress?: null): EventFilter;
    UserDepositChanged(_depositor?: string | null, _newDeposit?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _newActivePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _newBorrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "CommunityIssuanceAddressChanged"
  ): _TypedLogDescription<{ _newCommunityIssuanceAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolAddressChanged"
  ): _TypedLogDescription<{ _newDefaultPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DepositSnapshotUpdated"
  ): _TypedLogDescription<{ _depositor: string; _P: BigNumber; _S: BigNumber; _G: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "ETHGainWithdrawn"
  ): _TypedLogDescription<{ _depositor: string; _ETH: BigNumber; _STARLoss: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "EpochUpdated"
  ): _TypedLogDescription<{ _currentEpoch: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "EtherSent"
  ): _TypedLogDescription<{ _to: string; _amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "FrontEndRegistered"
  ): _TypedLogDescription<{ _frontEnd: string; _kickbackRate: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "FrontEndSnapshotUpdated"
  ): _TypedLogDescription<{ _frontEnd: string; _P: BigNumber; _G: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "FrontEndStakeChanged"
  ): _TypedLogDescription<{ _frontEnd: string; _newFrontEndStake: BigNumber; _depositor: string }>[];
  extractEvents(
    logs: Log[],
    name: "FrontEndTagSet"
  ): _TypedLogDescription<{ _depositor: string; _frontEnd: string }>[];
  extractEvents(
    logs: Log[],
    name: "G_Updated"
  ): _TypedLogDescription<{ _G: BigNumber; _epoch: BigNumber; _scale: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "PREONPaidToDepositor"
  ): _TypedLogDescription<{ _depositor: string; _PREON: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "PREONPaidToFrontEnd"
  ): _TypedLogDescription<{ _frontEnd: string; _PREON: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "STARTokenAddressChanged"
  ): _TypedLogDescription<{ _newSTARTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(logs: Log[], name: "P_Updated"): _TypedLogDescription<{ _P: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "PriceFeedAddressChanged"
  ): _TypedLogDescription<{ _newPriceFeedAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "S_Updated"
  ): _TypedLogDescription<{ _S: BigNumber; _epoch: BigNumber; _scale: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "ScaleUpdated"
  ): _TypedLogDescription<{ _currentScale: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "SortedTrovesAddressChanged"
  ): _TypedLogDescription<{ _newSortedTrovesAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolETHBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolSTARBalanceUpdated"
  ): _TypedLogDescription<{ _newBalance: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveManagerAddressChanged"
  ): _TypedLogDescription<{ _newTroveManagerAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "UserDepositChanged"
  ): _TypedLogDescription<{ _depositor: string; _newDeposit: BigNumber }>[];

  getDepositorGains(address: string, overrides: any): any;
  getDepositorPREONGain(address: string, overrides: any): any;
  getEstimatedPREONPoolRewards(a: any, b: any): any;
  address;
  removeListener;
  on;
}

interface TroveManagerCalls {
  BETA(_overrides?: CallOverrides): Promise<BigNumber>;
  BOOTSTRAP_PERIOD(_overrides?: CallOverrides): Promise<BigNumber>;
  BORROWING_FEE_FLOOR(_overrides?: CallOverrides): Promise<BigNumber>;
  CCR(_overrides?: CallOverrides): Promise<BigNumber>;
  DECIMAL_PRECISION(_overrides?: CallOverrides): Promise<BigNumber>;
  STAR_GAS_COMPENSATION(_overrides?: CallOverrides): Promise<BigNumber>;
  L_ETH(_overrides?: CallOverrides): Promise<BigNumber>;
  L_STARDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  MAX_BORROWING_FEE(_overrides?: CallOverrides): Promise<BigNumber>;
  MCR(_overrides?: CallOverrides): Promise<BigNumber>;
  MINUTE_DECAY_FACTOR(_overrides?: CallOverrides): Promise<BigNumber>;
  MIN_NET_DEBT(_overrides?: CallOverrides): Promise<BigNumber>;
  NAME(_overrides?: CallOverrides): Promise<string>;
  PERCENT_DIVISOR(_overrides?: CallOverrides): Promise<BigNumber>;
  REDEMPTION_FEE_FLOOR(_overrides?: CallOverrides): Promise<BigNumber>;
  SECONDS_IN_ONE_MINUTE(_overrides?: CallOverrides): Promise<BigNumber>;
  TroveOwners(arg0: BigNumberish, _overrides?: CallOverrides): Promise<string>;
  Troves(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{
    debt: BigNumber;
    coll: BigNumber;
    stake: BigNumber;
    status: number;
    arrayIndex: BigNumber;
  }>;
  _100pct(_overrides?: CallOverrides): Promise<BigNumber>;
  activePool(_overrides?: CallOverrides): Promise<string>;
  baseRate(_overrides?: CallOverrides): Promise<BigNumber>;
  borrowerOperationsAddress(_overrides?: CallOverrides): Promise<string>;
  checkRecoveryMode(_price: BigNumberish, _overrides?: CallOverrides): Promise<boolean>;
  defaultPool(_overrides?: CallOverrides): Promise<string>;
  getBorrowingFee(_STARDebt: BigNumberish, _overrides?: CallOverrides): Promise<BigNumber>;
  getBorrowingFeeWithDecay(_STARDebt: BigNumberish, _overrides?: CallOverrides): Promise<BigNumber>;
  getBorrowingRate(_overrides?: CallOverrides): Promise<BigNumber>;
  getBorrowingRateWithDecay(_overrides?: CallOverrides): Promise<BigNumber>;
  getCurrentICR(
    _borrower: string,
    _price: BigNumberish,
    _overrides?: CallOverrides
  ): Promise<BigNumber>;
  getEntireDebtAndColl(
    _borrower: string,
    _overrides?: CallOverrides
  ): Promise<{
    debt: BigNumber;
    coll: BigNumber;
    pendingSTARDebtReward: BigNumber;
    pendingETHReward: BigNumber;
  }>;
  getEntireSystemColl(_overrides?: CallOverrides): Promise<BigNumber>;
  getEntireSystemDebt(_overrides?: CallOverrides): Promise<BigNumber>;
  getNominalICR(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getPendingETHReward(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getPendingSTARDebtReward(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getRedemptionFeeWithDecay(_ETHDrawn: BigNumberish, _overrides?: CallOverrides): Promise<BigNumber>;
  getRedemptionRate(_overrides?: CallOverrides): Promise<BigNumber>;
  getRedemptionRateWithDecay(_overrides?: CallOverrides): Promise<BigNumber>;
  getTCR(_price: BigNumberish, _overrides?: CallOverrides): Promise<BigNumber>;
  getTroveColl(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getTroveColls(address: string, overrides?: any): any;
  getTroveDebt(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getTroveFromTroveOwnersArray(_index: BigNumberish, _overrides?: CallOverrides): Promise<string>;
  getTroveOwnersCount(_overrides?: CallOverrides): Promise<BigNumber>;
  getTroveStake(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  getTroveStatus(_borrower: string, _overrides?: CallOverrides): Promise<BigNumber>;
  hasPendingRewards(_borrower: string, _overrides?: CallOverrides): Promise<boolean>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  lastETHError_Redistribution(_overrides?: CallOverrides): Promise<BigNumber>;
  lastFeeOperationTime(_overrides?: CallOverrides): Promise<BigNumber>;
  lastSTARDebtError_Redistribution(_overrides?: CallOverrides): Promise<BigNumber>;
  preonStaking(_overrides?: CallOverrides): Promise<string>;
  preonToken(_overrides?: CallOverrides): Promise<string>;
  starToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  priceFeed(_overrides?: CallOverrides): Promise<string>;
  rewardSnapshots(
    arg0: string,
    _overrides?: CallOverrides
  ): Promise<{ ETH: BigNumber; STARDebt: BigNumber }>;
  sortedTroves(_overrides?: CallOverrides): Promise<string>;
  stabilityPool(_overrides?: CallOverrides): Promise<string>;
  totalCollateralSnapshot(_overrides?: CallOverrides): Promise<BigNumber>;
  totalStakes(_overrides?: CallOverrides): Promise<BigNumber>;
  totalStakesSnapshot(_overrides?: CallOverrides): Promise<BigNumber>;
}

interface TroveManagerTransactions {
  addTroveOwnerToArray(_borrower: string, _overrides?: Overrides): Promise<BigNumber>;
  applyPendingRewards(_borrower: string, _overrides?: Overrides): Promise<void>;
  batchLiquidateTroves(_troveArray: string[], _overrides?: Overrides): Promise<void>;
  closeTrove(_borrower: string, _overrides?: Overrides): Promise<void>;
  decayBaseRateFromBorrowing(_overrides?: Overrides): Promise<void>;
  decreaseTroveColl(
    _borrower: string,
    _collDecrease: BigNumberish,
    _overrides?: Overrides
  ): Promise<BigNumber>;
  decreaseTroveDebt(
    _borrower: string,
    _debtDecrease: BigNumberish,
    _overrides?: Overrides
  ): Promise<BigNumber>;
  increaseTroveColl(
    _borrower: string,
    _collIncrease: BigNumberish,
    _overrides?: Overrides
  ): Promise<BigNumber>;
  increaseTroveDebt(
    _borrower: string,
    _debtIncrease: BigNumberish,
    _overrides?: Overrides
  ): Promise<BigNumber>;
  liquidate(_borrower: string, _overrides?: Overrides): Promise<void>;
  liquidateTroves(_n: BigNumberish, _overrides?: Overrides): Promise<void>;
  redeemCollateral(
    _overrides: EthersTransactionOverrides, //1
    _STARamount: BigNumberish, //3
    _STARMaxFee: BigNumberish, //4
    _firstRedemptionHint: string, //5
    _upperPartialRedemptionHint: string, //6
    _lowerPartialRedemptionHint: BigNumberish, //7
    _partialRedemptionHintAICR: BigNumberish, //8
    _maxIterations: BigNumberish //9
  ): Promise<void>;
  removeStake(_borrower: string, _overrides?: Overrides): Promise<void>;
  setAddresses(
    _borrowerOperationsAddress: string,
    _activePoolAddress: string,
    _defaultPoolAddress: string,
    _stabilityPoolAddress: string,
    _gasPoolAddress: string,
    _collSurplusPoolAddress: string,
    _priceFeedAddress: string,
    _starTokenAddress: string,
    _sortedTrovesAddress: string,
    _preonTokenAddress: string,
    _preonStakingAddress: string,
    _overrides?: Overrides
  ): Promise<void>;
  setTroveStatus(_borrower: string, _num: BigNumberish, _overrides?: Overrides): Promise<void>;
  updateStakeAndTotalStakes(_borrower: string, _overrides?: Overrides): Promise<BigNumber>;
  updateTroveRewardSnapshots(_borrower: string, _overrides?: Overrides): Promise<void>;
}

export interface TroveManager
  extends _TypedLiquityContract<TroveManagerCalls, TroveManagerTransactions> {
  getCurrentAICR(borrower: any): any;
  getTroveVC(userAddress: any, arg1: any): any;
  readonly filters: {
    ActivePoolAddressChanged(_activePoolAddress?: null): EventFilter;
    BaseRateUpdated(_baseRate?: null): EventFilter;
    BorrowerOperationsAddressChanged(_newBorrowerOperationsAddress?: null): EventFilter;
    CollSurplusPoolAddressChanged(_collSurplusPoolAddress?: null): EventFilter;
    DefaultPoolAddressChanged(_defaultPoolAddress?: null): EventFilter;
    GasPoolAddressChanged(_gasPoolAddress?: null): EventFilter;
    PREONStakingAddressChanged(_preonStakingAddress?: null): EventFilter;
    PREONTokenAddressChanged(_preonTokenAddress?: null): EventFilter;
    LTermsUpdated(_L_ETH?: null, _L_STARDebt?: null): EventFilter;
    STARTokenAddressChanged(_newSTARTokenAddress?: null): EventFilter;
    LastFeeOpTimeUpdated(_lastFeeOpTime?: null): EventFilter;
    Liquidation(
      _liquidatedDebt?: null,
      _liquidatedColl?: null,
      _collGasCompensation?: null,
      _STARGasCompensation?: null
    ): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    PriceFeedAddressChanged(_newPriceFeedAddress?: null): EventFilter;
    Redemption(
      _attemptedSTARAmount?: null,
      _actualSTARAmount?: null,
      _ETHSent?: null,
      _ETHFee?: null
    ): EventFilter;
    SortedTrovesAddressChanged(_sortedTrovesAddress?: null): EventFilter;
    StabilityPoolAddressChanged(_stabilityPoolAddress?: null): EventFilter;
    SystemSnapshotsUpdated(
      _totalStakesSnapshot?: null,
      _totalCollateralSnapshot?: null
    ): EventFilter;
    TotalStakesUpdated(_newTotalStakes?: null): EventFilter;
    TroveIndexUpdated(_borrower?: null, _newIndex?: null): EventFilter;
    TroveLiquidated(
      _borrower?: string | null,
      _debt?: null,
      _coll?: null,
      _operation?: null
    ): EventFilter;
    TroveSnapshotsUpdated(_L_ETH?: null, _L_STARDebt?: null): EventFilter;
    TroveUpdated(
      _borrower?: string | null,
      _debt?: null,
      _coll?: null,
      _stake?: null,
      _operation?: null
    ): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "ActivePoolAddressChanged"
  ): _TypedLogDescription<{ _activePoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "BaseRateUpdated"
  ): _TypedLogDescription<{ _baseRate: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "BorrowerOperationsAddressChanged"
  ): _TypedLogDescription<{ _newBorrowerOperationsAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "CollSurplusPoolAddressChanged"
  ): _TypedLogDescription<{ _collSurplusPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "DefaultPoolAddressChanged"
  ): _TypedLogDescription<{ _defaultPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "GasPoolAddressChanged"
  ): _TypedLogDescription<{ _gasPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "PREONStakingAddressChanged"
  ): _TypedLogDescription<{ _preonStakingAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "PREONTokenAddressChanged"
  ): _TypedLogDescription<{ _preonTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "LTermsUpdated"
  ): _TypedLogDescription<{ _L_ETH: BigNumber; _L_STARDebt: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "STARTokenAddressChanged"
  ): _TypedLogDescription<{ _newSTARTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "LastFeeOpTimeUpdated"
  ): _TypedLogDescription<{ _lastFeeOpTime: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "Liquidation"
  ): _TypedLogDescription<{
    _liquidatedDebt: BigNumber;
    _liquidatedColl: BigNumber;
    _collGasCompensation: BigNumber;
    _STARGasCompensation: BigNumber;
  }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(
    logs: Log[],
    name: "PriceFeedAddressChanged"
  ): _TypedLogDescription<{ _newPriceFeedAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "Redemption"
  ): _TypedLogDescription<{
    _attemptedSTARAmount: BigNumber;
    _actualSTARAmount: BigNumber;
    STARfee: BigNumber;
    tokens: string[];
    amounts: BigNumber[];
  }>[];
  extractEvents(
    logs: Log[],
    name: "SortedTrovesAddressChanged"
  ): _TypedLogDescription<{ _sortedTrovesAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "StabilityPoolAddressChanged"
  ): _TypedLogDescription<{ _stabilityPoolAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "SystemSnapshotsUpdated"
  ): _TypedLogDescription<{
    _totalStakesSnapshot: BigNumber;
    _totalCollateralSnapshot: BigNumber;
  }>[];
  extractEvents(
    logs: Log[],
    name: "TotalStakesUpdated"
  ): _TypedLogDescription<{ _newTotalStakes: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveIndexUpdated"
  ): _TypedLogDescription<{ _borrower: string; _newIndex: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveLiquidated"
  ): _TypedLogDescription<{
    _borrower: string;
    _debt: BigNumber;
    _coll: BigNumber;
    _operation: number;
  }>[];
  extractEvents(
    logs: Log[],
    name: "TroveSnapshotsUpdated"
  ): _TypedLogDescription<{ _L_ETH: BigNumber; _L_STARDebt: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "TroveUpdated"
  ): _TypedLogDescription<{
    _borrower: string;
    _debt: BigNumber;
    _coll: BigNumber;
    _stake: BigNumber;
    _operation: number;
  }>[];

  getL_Coll(arg0: any, arg1?: any): any;
  getL_STAR(arg0: any, arg1?: any): any;
  getRewardSnapshotColl(address: any, coll: any): any;
  getRewardSnapshotSTAR(address: any, coll: any): any;

  removeListener;
  on;
}

interface UnipoolCalls {
  NAME(_overrides?: CallOverrides): Promise<string>;
  balanceOf(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  duration(_overrides?: CallOverrides): Promise<BigNumber>;
  earned(account: string, _overrides?: CallOverrides): Promise<BigNumber>;
  isOwner(_overrides?: CallOverrides): Promise<boolean>;
  lastTimeRewardApplicable(_overrides?: CallOverrides): Promise<BigNumber>;
  lastUpdateTime(_overrides?: CallOverrides): Promise<BigNumber>;
  preonToken(_overrides?: CallOverrides): Promise<string>;
  owner(_overrides?: CallOverrides): Promise<string>;
  periodFinish(_overrides?: CallOverrides): Promise<BigNumber>;
  rewardPerToken(_overrides?: CallOverrides): Promise<BigNumber>;
  rewardPerTokenStored(_overrides?: CallOverrides): Promise<BigNumber>;
  rewardRate(_overrides?: CallOverrides): Promise<BigNumber>;
  rewards(arg0: string, _overrides?: CallOverrides): Promise<BigNumber>;
  totalSupply(_overrides?: CallOverrides): Promise<BigNumber>;
  uniToken(_overrides?: CallOverrides): Promise<string>;
  userRewardPerTokenPaid(arg0: string, _overrides?: CallOverrides): Promise<BigNumber>;
}

interface UnipoolTransactions {
  claimReward(_overrides?: Overrides): Promise<void>;
  setParams(
    _preonTokenAddress: string,
    _uniTokenAddress: string,
    _duration: BigNumberish,
    _overrides?: Overrides
  ): Promise<void>;
  stake(amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  withdraw(amount: BigNumberish, _overrides?: Overrides): Promise<void>;
  withdrawAndClaim(_overrides?: Overrides): Promise<void>;
}

export interface Unipool extends _TypedLiquityContract<UnipoolCalls, UnipoolTransactions> {
  readonly filters: {
    PREONTokenAddressChanged(_preonTokenAddress?: null): EventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): EventFilter;
    RewardAdded(reward?: null): EventFilter;
    RewardPaid(user?: string | null, reward?: null): EventFilter;
    Staked(user?: string | null, amount?: null): EventFilter;
    UniTokenAddressChanged(_uniTokenAddress?: null): EventFilter;
    Withdrawn(user?: string | null, amount?: null): EventFilter;
  };
  extractEvents(
    logs: Log[],
    name: "PREONTokenAddressChanged"
  ): _TypedLogDescription<{ _preonTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "OwnershipTransferred"
  ): _TypedLogDescription<{ previousOwner: string; newOwner: string }>[];
  extractEvents(logs: Log[], name: "RewardAdded"): _TypedLogDescription<{ reward: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "RewardPaid"
  ): _TypedLogDescription<{ user: string; reward: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "Staked"
  ): _TypedLogDescription<{ user: string; amount: BigNumber }>[];
  extractEvents(
    logs: Log[],
    name: "UniTokenAddressChanged"
  ): _TypedLogDescription<{ _uniTokenAddress: string }>[];
  extractEvents(
    logs: Log[],
    name: "Withdrawn"
  ): _TypedLogDescription<{ user: string; amount: BigNumber }>[];
}
