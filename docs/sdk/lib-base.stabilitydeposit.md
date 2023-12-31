<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@liquity/lib-base](./lib-base.md) &gt; [StabilityDeposit](./lib-base.stabilitydeposit.md)

## StabilityDeposit class

A Stability Deposit and its accrued gains.

<b>Signature:</b>

```typescript
export declare class StabilityDeposit 
```

## Remarks

The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the `StabilityDeposit` class.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [collateralGain](./lib-base.stabilitydeposit.collateralgain.md) |  | [Decimal](./lib-base.decimal.md) | Amount of native currency (e.g. Ether) received in exchange for the used-up STAR. |
|  [currentSTAR](./lib-base.stabilitydeposit.currentstar.md) |  | [Decimal](./lib-base.decimal.md) | Amount of STAR left in the Stability Deposit. |
|  [initialSTAR](./lib-base.stabilitydeposit.initialstar.md) |  | [Decimal](./lib-base.decimal.md) | Amount of STAR in the Stability Deposit at the time of the last direct modification. |
|  [isEmpty](./lib-base.stabilitydeposit.isempty.md) |  | boolean |  |
|  [preonReward](./lib-base.stabilitydeposit.preonreward.md) |  | [Decimal](./lib-base.decimal.md) | Amount of PREON rewarded since the last modification of the Stability Deposit. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [apply(change)](./lib-base.stabilitydeposit.apply.md) |  | Apply a [StabilityDepositChange](./lib-base.stabilitydepositchange.md) to this Stability Deposit. |
|  [equals(that)](./lib-base.stabilitydeposit.equals.md) |  | Compare to another instance of <code>StabilityDeposit</code>. |
|  [whatChanged(thatSTAR)](./lib-base.stabilitydeposit.whatchanged.md) |  | Calculate the difference between the <code>currentSTAR</code> in this Stability Deposit and <code>thatSTAR</code>. |

