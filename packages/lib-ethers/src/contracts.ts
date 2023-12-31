import { JsonFragment, LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Log } from "@ethersproject/abstract-provider";

import {
  Contract,
  ContractInterface,
  ContractFunction,
  Overrides,
  CallOverrides,
  PopulatedTransaction,
  ContractTransaction
} from "@ethersproject/contracts";

import activePoolAbi from "../abi/ActivePool.json";
import borrowerOperationsAbi from "../abi/BorrowerOperations.json";
import troveManagerAbi from "../abi/TroveManager.json";
import starTokenAbi from "../abi/STARToken.json";
import collSurplusPoolAbi from "../abi/CollSurplusPool.json";
import communityIssuanceAbi from "../abi/CommunityIssuance.json";
import defaultPoolAbi from "../abi/DefaultPool.json";
import preonTokenAbi from "../abi/PREONToken.json";
import hintHelpersAbi from "../abi/HintHelpers.json";
import multiTroveGetterAbi from "../abi/MultiTroveGetter.json";
import priceFeedAbi from "../abi/PriceFeed.json";
import priceFeedTestnetAbi from "../abi/PriceFeedTestnet.json";
import sortedTrovesAbi from "../abi/SortedTroves.json";
import stabilityPoolAbi from "../abi/StabilityPool.json";
import gasPoolAbi from "../abi/GasPool.json";
import iERC20Abi from "../abi/IERC20.json";
import preonControllerAbi from "../abi/PreonController.json";
import farmAbi from "../abi/Farm.json";
import vePREONEmissionsAbi from "../abi/vePREONEmissions.json";
import vePREONAbi from "../abi/vePREON.json";
import boostedFarmAbi from "../abi/BoostedFarm.json";

import {
  ActivePool,
  BorrowerOperations,
  TroveManager,
  CollSurplusPool,
  DefaultPool,
  HintHelpers,
  MultiTroveGetter,
  PriceFeed,
  PriceFeedTestnet,
  SortedTroves,
  StabilityPool,
  GasPool,
  ERC20Mock,
  IERC20
} from "../types";

import { EthersProvider, EthersSigner } from "./types";

export interface _TypedLogDescription<T> extends Omit<LogDescription, "args"> {
  args: T;
}

type BucketOfFunctions = Record<string, (...args: unknown[]) => never>;

// Removes unsafe index signatures from an Ethers contract type
export type _TypeSafeContract<T> = Pick<
  T,
  {
    [P in keyof T]: BucketOfFunctions extends T[P] ? never : P;
  } extends {
    [_ in keyof T]: infer U;
  }
    ? U
    : never
>;

type EstimatedContractFunction<R = unknown, A extends unknown[] = unknown[], O = Overrides> = (
  overrides: O,
  adjustGas: (gas: BigNumber) => BigNumber,
  ...args: A
) => Promise<R>;

type CallOverridesArg = [overrides?: CallOverrides];

type TypedContract<T extends Contract, U, V> = _TypeSafeContract<T> &
  U &
  {
    [P in keyof V]: V[P] extends (...args: infer A) => unknown
      ? (...args: A) => Promise<ContractTransaction>
      : never;
  } & {
    readonly callStatic: {
      [P in keyof V]: V[P] extends (...args: [...infer A, never]) => infer R
        ? (...args: [...A, ...CallOverridesArg]) => R
        : never;
    };

    readonly estimateGas: {
      [P in keyof V]: V[P] extends (...args: infer A) => unknown
        ? (...args: A) => Promise<BigNumber>
        : never;
    };

    openTroveLeverUp?: unknown;

    readonly populateTransaction: {
      [P in keyof V]: V[P] extends (...args: infer A) => unknown
        ? (...args: A) => Promise<PopulatedTransaction>
        : never;
    };

    readonly estimateAndPopulate: {
      [P in keyof V]: V[P] extends (...args: [...infer A, infer O | undefined]) => unknown
        ? EstimatedContractFunction<PopulatedTransaction, A, O>
        : never;
    };
  };

// Implementations

const buildEstimatedFunctions = <T>(
  estimateFunctions: Record<string, ContractFunction<BigNumber>>,
  functions: Record<string, ContractFunction<T>>
): Record<string, EstimatedContractFunction<T>> =>
  Object.fromEntries(
    Object.keys(estimateFunctions).map(functionName => [
      functionName,
      async (overrides, adjustEstimate, ...args) => {
        if (overrides.gasLimit === undefined) {
          const estimatedGas = await estimateFunctions[functionName](...args, overrides);
          overrides = {
            ...overrides,
            gasLimit: adjustEstimate(estimatedGas)
          };
        }
        return functions[functionName](...args, overrides);
      }
    ])
  );

export class _LiquityContract extends Contract {
  readonly estimateAndPopulate: Record<string, EstimatedContractFunction<PopulatedTransaction>>;

  constructor(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: EthersSigner | EthersProvider
  ) {
    super(addressOrName, contractInterface, signerOrProvider);

    // this.estimateAndCall = buildEstimatedFunctions(this.estimateGas, this);
    this.estimateAndPopulate = buildEstimatedFunctions(this.estimateGas, this.populateTransaction);
  }

  extractEvents(logs: Log[], name: string): _TypedLogDescription<unknown>[] {
    return logs
      .filter(log => log.address === this.address)
      .map(log => this.interface.parseLog(log))
      .filter(e => e.name === name);
  }
}

/** @internal */
export type _TypedLiquityContract<T = unknown, U = unknown> = TypedContract<_LiquityContract, T, U>;

/** @internal */
export interface _LiquityContracts {
  activePool: ActivePool;
  borrowerOperations: BorrowerOperations;
  troveManager: TroveManager;
  collSurplusPool: CollSurplusPool;
  defaultPool: DefaultPool;
  hintHelpers: HintHelpers;
  priceFeed: PriceFeed | PriceFeedTestnet;
  sortedTroves: SortedTroves;
  stabilityPool: StabilityPool;
  gasPool: GasPool;
  multiTroveGetter: MultiTroveGetter;
  communityIssuance: any; //CommunityIssuance;
  starToken: any; //STARToken;
  // starToken: STARToken; //STARToken;
  preonToken: any; //LQTYToken;
  // preonToken: PREONToken; //PREONToken;
  preonController: any; //PreonController;
  // preonController:any;//PreonController;
  farm: any; //Farm;
  boostedFarm: any; //BoostedFarm;
  vePREON: any; //VePREON;
  // vePREON: any; //VePREON;
  vePREONEmissions: any; //VePreonEmissions;
  // vePREONEmissions: any; //VePreonEmissions;
  lpToken: IERC20; //LPToken;
  STARPriceFeed: any; //PriceFeed;
  // STARPriceFeed: any;//starPriceFeed;
}

export const _getPreonVaultToken = (
  address: string,
  signerOrProvider: EthersSigner | EthersProvider
): any => {
  return {
    vault: new _LiquityContract(address, iERC20Abi, signerOrProvider)
  };
};
export const _getERC20Token = (
  address: string,
  signerOrProvider: EthersSigner | EthersProvider
): any => {
  return {
    token: new _LiquityContract(address, iERC20Abi, signerOrProvider)
  };
};
export const _getLPToken = (
  address: string,
  signerOrProvider: EthersSigner | EthersProvider
): any => {
  return {
    // ! TODO: #pending: replace lp token #address
    token: new _LiquityContract(
      "0xCF80070DBe669eE4e496246819dB45076eD4A427",
      iERC20Abi,
      signerOrProvider
    )
  };
};
export const _getTestERC20Token = (
  address: string,
  signerOrProvider: EthersSigner | EthersProvider
): any => {
  return {
    token: new _LiquityContract(address, iERC20Abi, signerOrProvider)
  };
};
export const _getTestERC20TokenNoLimit = (
  address: string,
  signerOrProvider: EthersSigner | EthersProvider
): any => {
  return {
    token: new _LiquityContract(address, iERC20Abi, signerOrProvider)
  };
};

/** @internal */
export const _priceFeedIsTestnet = (
  priceFeed: PriceFeed | PriceFeedTestnet
): priceFeed is PriceFeedTestnet => "setPrice" in priceFeed;

/** @internal */
export const _uniTokenIsMock = (uniToken: IERC20 | ERC20Mock): uniToken is ERC20Mock =>
  "mint" in uniToken;

type LiquityContractsKey = keyof _LiquityContracts;

/** @internal */
export type _LiquityContractAddresses = Record<LiquityContractsKey, string>;

type LiquityContractAbis = Record<LiquityContractsKey, JsonFragment[]>;

const getAbi = (priceFeedIsTestnet: boolean): LiquityContractAbis => ({
  activePool: activePoolAbi,
  borrowerOperations: borrowerOperationsAbi,
  troveManager: troveManagerAbi,
  starToken: starTokenAbi,
  communityIssuance: communityIssuanceAbi,
  defaultPool: defaultPoolAbi,
  preonToken: preonTokenAbi,
  hintHelpers: hintHelpersAbi,
  multiTroveGetter: multiTroveGetterAbi,
  priceFeed: priceFeedIsTestnet ? priceFeedTestnetAbi : priceFeedAbi,
  sortedTroves: sortedTrovesAbi,
  stabilityPool: stabilityPoolAbi,
  gasPool: gasPoolAbi,
  collSurplusPool: collSurplusPoolAbi,
  preonController: preonControllerAbi,
  farm: farmAbi,
  boostedFarm: boostedFarmAbi,
  vePREON: vePREONAbi,
  vePREONEmissions: vePREONEmissionsAbi,
  lpToken: iERC20Abi,
  STARPriceFeed: priceFeedIsTestnet ? priceFeedTestnetAbi : priceFeedAbi
});

const mapLiquityContracts = <T, U>(
  contracts: Record<LiquityContractsKey, T>,
  f: (t: T, key: LiquityContractsKey) => U
) =>
  Object.fromEntries(
    Object.entries(contracts).map(([key, t]) => [key, f(t, key as LiquityContractsKey)])
  ) as Record<LiquityContractsKey, U>;

/** @internal */
export interface _LiquityDeploymentJSON {
  readonly chainId: number;
  readonly addresses: _LiquityContractAddresses;
  readonly version: string;
  readonly deploymentDate: number;
  readonly startBlock: number;
  readonly bootstrapPeriod: number;
  readonly _priceFeedIsTestnet: boolean;
  readonly _uniTokenIsMock: boolean;
  readonly liquidityMiningPREONRewardRate: any;
  totalStabilityPoolPREONReward;
  pngLiquidityMiningPREONRewardRate;
  tjLiquidityMiningPREONRewardRate;
  readonly _isDev: boolean;
}

/** @internal */
export const _connectToContracts = (
  signerOrProvider: EthersSigner | EthersProvider,
  { addresses, _priceFeedIsTestnet }: _LiquityDeploymentJSON
): _LiquityContracts => {
  const abi = getAbi(_priceFeedIsTestnet);

  return mapLiquityContracts(
    addresses,
    (address, key) =>
      new _LiquityContract(address, abi[key], signerOrProvider) as _TypedLiquityContract
  ) as _LiquityContracts;
};
