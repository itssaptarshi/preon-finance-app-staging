<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@liquity/lib-ethers](./lib-ethers.md) &gt; [EthersLiquity](./lib-ethers.ethersliquity.md) &gt; [depositSTARInStabilityPool](./lib-ethers.ethersliquity.depositstarinstabilitypool.md)

## EthersLiquity.depositSTARInStabilityPool() method

Make a new Stability Deposit, or top up existing one.

<b>Signature:</b>

```typescript
depositSTARInStabilityPool(amount: any, overrides: any): any;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | any | Amount of STAR to add to new or existing deposit. |
|  overrides | any |  |

<b>Returns:</b>

any

## Exceptions

Throws [EthersTransactionFailedError](./lib-ethers.etherstransactionfailederror.md) in case of transaction failure. Throws [EthersTransactionCancelledError](./lib-ethers.etherstransactioncancellederror.md) if the transaction is cancelled or replaced.

## Remarks

The `frontendTag` parameter is only effective when making a new deposit.

As a side-effect, the transaction will also pay out an existing Stability Deposit's [collateral gain](./lib-base.stabilitydeposit.collateralgain.md) and .

