### Core Contracts & Init Functions

`$PREON`

```constructor(
    address _sPREONAddress,
    address _treasuryAddress,
    address _teamAddress )
```

---

`SortedTroves`

```
    setParams(
        uint256 _size,
        address _troveManagerAddress,
        address _borrowerOperationsAddress,
        address _troveManagerRedemptionsAddress,
        address _preonControllerAddress
    )
```

---

`$vePREON`

```
    setup(
        IERC20 _preon,
        address _preonController,
        uint256 _accumulationRate )
```

---

`$STAR`

```
    constructor(
        address _troveManagerAddress,
        address _troveManagerLiquidationsAddress,
        address _troveManagerRedemptionsAddress,
        address _stabilityPoolAddress,
        address _borrowerOperationsAddress,
        address _controllerAddress )
```

---

`BorrowerOperations`

```
    setAddresses(
        address _troveManagerAddress,
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _gasPoolAddress,
        address _collSurplusPoolAddress,
        address _sortedTrovesAddress,
        address _starTokenAddress,
        address _controllerAddress)
```

---

`TroveManager`

```
    setAddresses(
        address _borrowerOperationsAddress,
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _sortedTrovesAddress,
        address _controllerAddress,
        address _troveManagerRedemptionsAddress,
        address _troveManagerLiquidationsAddress )
```

---

`TroveManagerLiquidations`

```
    setAddresses(
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _stabilityPoolAddress,
        address _gasPoolAddress,
        address _collSurplusPoolAddress,
        address _starTokenAddress,
        address _controllerAddress,
        address _troveManagerAddress )
```

---

`TroveManagerRedemptions`

```
    setAddresses(
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _gasPoolAddress,
        address _collSurplusPoolAddress,
        address _starTokenAddress,
        address _sortedTrovesAddress,
        address _controllerAddress,
        address _troveManagerAddress )
```

`StabilityPool`

```
    setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerAddress,
        address _activePoolAddress,
        address _starTokenAddress,
        address _sortedTrovesAddress,
        address _communityIssuanceAddress,
        address _controllerAddress,
        address _troveManagerLiquidationsAddress )
```

---

`ActivePool`

```
    setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerAddress,
        address _stabilityPoolAddress,
        address _defaultPoolAddress,
        address _controllerAddress,
        address _troveManagerLiquidationsAddress,
        address _troveManagerRedemptionsAddress,
        address _collSurplusPoolAddress )
```

---

`DefaultPool`

```
    setAddresses(
        address _troveManagerAddress,
        address _troveManagerLiquidationsAddress,
        address _activePoolAddress,
        address _controllerAddress )
```

---

`CollSurplusPool`

```
    setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerLiquidationsAddress,
        address _troveManagerRedemptionsAddress,
        address _activePoolAddress,
        address _controllerAddress,
        address _starTokenAddress )
```

---

`CommunityIssuance`

```
    setAddresses(
        address _preonTokenAddress,
        address _stabilityPoolAddress )
```

---

`Curve LP Farm (Old)`

---

`Boosted Curve LP Farm`

---

`vePREON Emissions ​`

```
    initialize(IERC20 _PREON, IvePREON _VEPREON)
```

---

`PreonController ​`

```setAddresses(
    address _activePoolAddress,
    address _defaultPoolAddress,
    address _stabilityPoolAddress,
    address _collSurplusPoolAddress,
    address _borrowerOperationsAddress,
    address _starTokenAddress,
    address _STARFeeRecipientAddress,
    address _preonFinanceTreasury,
    address _sortedTrovesAddress,
    address _vePREONAddress,
    address _troveManagerRedemptionsAddress,
    address _claimAddress,
    address _threeDayTimelock,
    address _twoWeekTimelock )
```

---

## coreContracts

1.  priceFeed,
2.  whitelist,
3.  starToken,
4.  sortedTroves,
5.  troveManager,
6.  troveManagerLiquidations,
7.  troveManagerRedemptions,
8.  activePool,
9.  stabilityPool,
10. gasPool,
11. defaultPool,
12. collSurplusPool,
13. borrowerOperations,
14. hintHelpers,
15. tellorCaller,
16. preonController,

## PREON contracts

1. vePREON
2. vePREONEmissions
3. threeDayTimeLock
4. twoWeekTimelock
5. lockupContractFactory
6. communityIssuance
7. preonToken
8. preonFinanceTreasury === sPREON

### deploy core contracts

<!-- 1. priceFeed -->

1. sortedTroves
2. troveManager
3. activePool
4. stabilityPool
5. gasPool
6. defaultPool
7. collSurplusPool
8. borrowerOperations
9. hintHelpers
10. tellorCaller
11. troveManagerLiquidations
12. troveManagerRedemptions
13. whitelist
14. preonController
15. starToken

### deploy preon contracts

1. vePREON
2. vePREONEmissions
3. threeDayTimeLock
4. twoWeekTimelock
5. communityIssuance

### connect core

### connect preon

### connect preon to core

<!-- ### Deployment order

[-] 1. priceFeed

[-] 2. sortedTroves

[-] 3. troveManager

[-] 4. activePool

[-] 5. stabilityPool

[-] 6. gasPool

[-] 7. defaultPool

[-] 8. collSurplusPool

[-] 9. borrowerOperations

[-] 10. hintHelpers

[-] 11. tellorCaller

[-] 12. troveManagerLiquidations

[-] 13. troveManagerRedemptions

[-] 14. whitelist

[-] 15. starToken

[] 16. PreonFinanceTreasury

[] 17. sPREON

[] 18. lockupContractFactory

[] 19. communityIssuance

[] 20. preonToken -->
