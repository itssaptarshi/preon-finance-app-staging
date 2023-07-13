// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  HStack,
  VStack,
  Spacer,
  Text,
  Button,
  Divider,
  useTheme,
  useDisclosure,
  useToast,
  UseToastOptions,
  Checkbox,
  Tag
} from "@chakra-ui/react";
import { cancelCheck } from "../../../components/Transaction";
import CollateralItem from "../CollateralItem";
import CoinAmount from "../../../components/CoinAmount";
import ProgressBar from "../../../components/ProgressBar";
import Icon from "../../../components/Icon";
import { useLiquity } from "../../../hooks/LiquityContext";
import { getAffectedCollateral, calculateAvcValue } from "../AdjustTrove/AdjustTrove.utils";
import {
  LiquityStoreState,
  Decimal,
  TroveWithdrawCollUnleverUpParams,
  TroveCreationParams,
  TroveAdjustmentParams,
  TroveCreationLeverUpParams,
  TroveAddCollLeverupParams,
  Decimalish
} from "@liquity/lib-base";

import { useLiquitySelector } from "@liquity/lib-react";
import {
  sumArrVc,
  sumUnchangedVc,
  getChangedCollateral,
  getUnchangedCollateral,
  sumArrAVc,
  sumUnchangedAVc
} from "./ConfirmChangesModal.utils";
import { calculateTotalSTARFromLever } from "../AdjustTrove/AdjustTrove.utils";
import tokenData, { tokenDataMappingA } from "../../../TokenData";
import { addString, format, getNum } from "../../../Utils/number";
import { useMyTransactionState, useTransactionFunction } from "../../../components/Transaction";
import TransactionModal from "../../../components/TransactionModal";
import Tooltip from "../../../components/Tooltip";
import { VC_explanation } from "../../../Utils/constants";
import { left } from "@popperjs/core";
import { Collateral, TroveMappings, AdjustedTokenData } from "../../../Types";
// import Checkbox from "../../../components/Checkbox";
import { contractAddresses } from "../../../config/constants";

type ConfirmChangesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  values: { [key: string]: any };
  collateral: AdjustedTokenData[];
  borrowMode: "normal" | "lever" | "unlever";
  depositFees: TroveMappings;
  currVcValue: number;
  avcValue: number;
};

// TODO fix type defs
const selector = ({
  borrowingRate,
  trove,
  underlyingPrices,
  prices,
  PREONPrice,
  globalBoostFactor,
  decayedBoost,
  vcValue,
  STARPrice,
  tokenBalances,
  decimals,
  safetyRatios,
  recoveryRatios,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios
}: any | LiquityStoreState) => ({
  borrowingRate,
  trove,
  underlyingPrices,
  prices,
  PREONPrice,
  globalBoostFactor,
  decayedBoost,
  vcValue,
  STARPrice,
  tokenBalances,
  decimals,
  safetyRatios,
  recoveryRatios,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios
});

export interface stringMap {
  [key: string]: string;
}

/**
 * Stateless ConfirmChangesModal that adds fields to a React Final Form context
 * and allows user to trigger onSubmit if checkboxes are filled.
 *
 * Integration - Suggest keeping all token change information inside a React Final Form instance
 * that wraps this component, the same instance that wraps the input fields, and then pulling
 * data from that context rather than through props as is currently shown.
 */
const ConfirmChangesModal: React.FC<ConfirmChangesModalProps> = ({
  isOpen,
  onClose,
  values,
  collateral,
  borrowMode,
  depositFees,
  currVcValue,
  avcValue
}) => {
  const toast = useToast();
  const toastProps: UseToastOptions = {
    status: "error",
    duration: 4000,
    isClosable: true,
    position: "top-right"
  };
  const { preon } = useTheme();
  const { liquity, account } = useLiquity();

  const {
    borrowingRate,
    trove,
    underlyingPrices,
    prices,
    globalBoostFactor,
    decayedBoost,
    vcValue,
    STARPrice,
    tokenBalances,
    decimals,
    safetyRatios,
    recoveryRatios,
    underlyingPerReceiptRatios,
    receiptPerUnderlyingRatios
  } = useLiquitySelector(selector);
  //console.log('underlyingPrices', underlyingPrices)
  const starBorrowRate = +borrowingRate;
  // Format Values
  Object.keys(values).map(key => {
    if (!key.includes("mode")) {
      const value = values[key];
      try {
        Decimal.from(values[key]);
        values[key] = value;
      } catch (err) {
        delete values[key];
      }
    }
  });
  const { isOpen: isTxModalOpen, onOpen: onTxModalOpen, onClose: onTxModalClosed } = useDisclosure();

  const [boolList, setBoolList] = useState(Array<Boolean>());

  const changedCollateral = getChangedCollateral(
    collateral,
    values,
    depositFees,
    underlyingPerReceiptRatios
  );

  const depositedCollateral = changedCollateral.filter(collateral => collateral.mode === "deposit");
  //console.log("depositedcollateral", depositedCollateral);
  const withdrawnCollateral = changedCollateral.filter(collateral => collateral.mode === "withdraw");
  //console.log("withdrawncollateral", withdrawnCollateral);
  const totalSTARFromLever = calculateTotalSTARFromLever(
    collateral,
    underlyingPrices,
    values,
    safetyRatios
  );
  //console.log("totalSTARFromLever", (totalSTARFromLever).toString());
  let newBorrowAmount = addString(0, values["STAR"]);
  //console.log('values confirm', values)
  if (newBorrowAmount < 0) {
    newBorrowAmount = 0;
  }
  let newBorrowAmountWithLever = newBorrowAmount;
  // todo: make lever mode work correctly and account for unlever case (pay back star)
  // if (values["leverMode"] === "lever") {
  if (borrowMode === "lever") {
    newBorrowAmountWithLever = newBorrowAmountWithLever + +String(totalSTARFromLever);
  }
  // else if (borrowMode === "unlever") {
  //   newBorrowAmountWithLever = newBorrowAmountWithLever + +String(totalSTARFromLever);
  // }
  const thisTxBorrowAmount: string = newBorrowAmount.toString();
  const originalBorrow = +trove.debt["debt"];
  let totalBorrow = trove && trove.status !== "open" ? 200 : 0; // Start with 200 STAR Gas comp if trove not open currently
  if (values["STARmode"] === "deposit") {
    totalBorrow += originalBorrow + newBorrowAmountWithLever;
  } else {
    if (newBorrowAmountWithLever < 0) {
      totalBorrow = originalBorrow + newBorrowAmountWithLever;
    } else {
      totalBorrow += originalBorrow - newBorrowAmountWithLever;
    }
  }

  useEffect(() => {
    const debt = newBorrowAmountWithLever;
    const open = isOpen;
    let interval: any = undefined;

    // check allowance
    if (open) {
      interval = setInterval(async () => {
        let check_list = false;
        if (depositedCollateral.length !== 0) {
          check_list = true;
        }
        const bool_list2: boolean[] = new Array(depositedCollateral.length).fill(false);
        for (let i = 0; i < depositedCollateral.length; i++) {
          const tokenAddress = depositedCollateral[i].address;

          bool_list2[i] = await checkAllowance(
            tokenDataMappingA[tokenAddress].isVault
              ? tokenDataMappingA[tokenAddress].underlying
              : tokenAddress,
            tokenDataMappingA[tokenAddress].isVault
              ? tokenAddress
              : contractAddresses.borrowerOperations.address,
            Decimal.fromWithPrecision(
              depositedCollateral[i].change,
              tokenDataMappingA[depositedCollateral[i].address].underlyingDecimals
            )
          );
        }
        setBoolList(bool_list2);
        if ((check_list && !bool_list2.includes(false)) || !check_list) {
          setStep(2);
        } else {
          setStep(1);
        }
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [values, withdrawnCollateral, newBorrowAmountWithLever, isOpen]);

  const unchangedCollateral = getUnchangedCollateral(collateral, values);
  //console.log("unchangedCollateral", unchangedCollateral);
  // sum in vc terms
  const addedCollateralVC = sumArrVc(
    depositedCollateral,
    "change",
    prices,
    safetyRatios,
    receiptPerUnderlyingRatios
  );
  const subtractedCollateralVC = sumArrVc(
    withdrawnCollateral,
    "change",
    prices,
    safetyRatios,
    receiptPerUnderlyingRatios
  );
  //console.log(totalChangedCollateralVC)
  let borrowFees = values["STARmode"] === "deposit" ? newBorrowAmountWithLever * starBorrowRate : 0;
  let totalDepositFeesInSTAR = 0;
  let newBoostFactor: number = 0;

  changedCollateral.map(({ fee, address, leverage, underlying }) => {
    const depositFeeInSTAR = fee
      ? fee * format(underlyingPrices[address]) * format(safetyRatios[address])
      : 0;
    totalDepositFeesInSTAR += depositFeeInSTAR;
    newBoostFactor += depositFeeInSTAR * leverage;
  });

  // todo in Decimal?
  //console.log('totalBorrow', totalBorrow)
  //console.log('borrowFees', borrowFees)
  //console.log('totalDepositFeesInSTAR', totalDepositFeesInSTAR)
  //console.log("borrowFees", borrowFees)x
  //console.log("totalDepositFeesInSTAR", totalDepositFeesInSTAR)
  const totalBorrowIncludingFees = totalBorrow + borrowFees + totalDepositFeesInSTAR;
  //console.log("totalBorrowIncludingFees", totalBorrowIncludingFees);
  const tokenDataChanges: AdjustedTokenData[] = JSON.parse(JSON.stringify(tokenData));
  tokenDataChanges.map(token => {
    const change = values[token.token] ? parseFloat(String(values[token.token])) : 0;
    token["mode"] = values[token.token] ? String(values[token.token + "mode"]) : "deposit";
    token["change"] = change;
  });

  //console.log(currVcValue, avc)
  //console.log("currVcValue", currVcValue)
  let newCollateralRatio: number;
  let aicr: number;
  if (totalBorrowIncludingFees < 0) {
    newCollateralRatio = 0;
    aicr = 0;
  } else {
    newCollateralRatio = currVcValue / totalBorrowIncludingFees;
    aicr = avcValue / totalBorrowIncludingFees;
  }
  //console.log(aicr)
  newBoostFactor /= addedCollateralVC;
  let boostedAICR: number;
  if (trove.status === "open") {
    if (addedCollateralVC === 0) {
      boostedAICR = aicr + format(decayedBoost);
    } else {
      boostedAICR =
        aicr +
        (newBoostFactor * format(globalBoostFactor) * addedCollateralVC +
          format(decayedBoost) * format(vcValue)) /
          (format(vcValue) + addedCollateralVC);
    }
  } else if (addedCollateralVC > 0) {
    boostedAICR = aicr + newBoostFactor * format(globalBoostFactor);
  } else {
    boostedAICR = 0;
  }

  if (isNaN(boostedAICR)) {
    boostedAICR = 0;
  }

  const [bottomFiveTroves, setBottomFiveTroves] = useState<number[]>([]);

  useEffect(() => {
    const getBottomFiveTroves = async () => {
      const bottomFive: number[] = [];
      let tail: string = await liquity.getSortedTroveTail();
      let tailAICR: number = format(await liquity.getCurrentAICR(tail));
      const size: number = await liquity.getSortedTroveSize();

      bottomFive.push(tailAICR);

      let i = 1;

      while (i < 5 && i < size) {
        tail = await liquity.getSortedTrovePrev(tail);
        tailAICR = format(await liquity.getCurrentAICR(tail));
        bottomFive.push(tailAICR);
        i++;
      }

      setBottomFiveTroves(bottomFive);
    };
    getBottomFiveTroves();
  }, []);

  //console.log(bottomFiveTroves)

  // Error Handling: State setup
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [understandLiquidation, setUnderstandLiquidation] = useState(false);
  const [understandRedemption, setUnderstandRedemption] = useState(false);
  const [understandLiquidationError, setUnderstandLiquidationError] = useState(false);
  const [understandRedemptionError, setUnderstandRedemptionError] = useState(false);

  // Error Handling: Understand Liquidation
  useEffect(() => {
    if (understandLiquidationError && understandLiquidation) {
      setUnderstandLiquidationError(false);
    }
  }, [understandLiquidationError, understandLiquidation]);

  // Error Handling: Understand Redepmtions
  useEffect(() => {
    if (understandRedemptionError && understandRedemption) {
      setUnderstandRedemptionError(false);
    }
  }, [understandRedemptionError, understandRedemption]);

  const getVC = (amount: number | undefined, safetyRatio: number) => {
    if (amount) {
      return amount * safetyRatio;
    }
    return 0;
  };

  const checkAllowance = async (
    token: string,
    spender: string,
    amount: Decimal
  ): Promise<boolean> => {
    const result = await liquity.getAllowanceOf(account, token, spender, amount);
    return result;
  };

  const maxBorrowingRate = Decimal.from(0.1);

  // Set deposit and withdraw collaterals
  const depositTroveMapping: TroveMappings = {};
  const withdrawTroveMapping: TroveMappings = {};
  const depositCollateralsLeveragesTroveMapping: TroveMappings = {};
  const depositCollateralsMaxSlippagesTroveMapping: TroveMappings = {};
  const withdrawCollateralsMaxSlippagesTroveMapping: TroveMappings = {};

  // Deposited collateral Deposit amount, Leverage and Slippages
  for (let i = 0; i < depositedCollateral.length; i++) {
    const address = depositedCollateral[i].address;
    depositTroveMapping[address] = Decimal.fromWithPrecision(
      isNaN(depositedCollateral[i].change) || values[depositedCollateral[i].token] < 0
        ? 0
        : values[depositedCollateral[i].token],
      tokenDataMappingA[address].underlyingDecimals
    );

    // tokenBalances[address]
    console.log("@open depositTroveMapping", format(depositTroveMapping[address]));
    console.log("@open values", +values[depositedCollateral[i].token]);
    console.log("@open values", +values[depositedCollateral[i].token]);

    if (
      depositTroveMapping[address]
        .add(Decimal.fromWithPrecision(".00009", tokenDataMappingA[address].underlyingDecimals))
        .gte(
          depositedCollateral[i].underlying == ""
            ? tokenBalances[address]
            : tokenBalances[depositedCollateral[i].underlying!]
        )
    ) {
      depositTroveMapping[address] =
        depositedCollateral[i].underlying == ""
          ? tokenBalances[address]
          : tokenBalances[depositedCollateral[i].underlying!];
    }

    depositCollateralsLeveragesTroveMapping[address] = Decimal.from(
      isNaN(values[depositedCollateral[i].token + "leverage"]) ||
        values[depositedCollateral[i].token + "leverage"] < 0
        ? 0
        : values[depositedCollateral[i].token + "leverage"]
    );

    depositCollateralsMaxSlippagesTroveMapping[address] = Decimal.from(
      isNaN(values[depositedCollateral[i].token + "slippage"]) ||
        values[depositedCollateral[i].token + "slippage"] < 0
        ? 0
        : values[depositedCollateral[i].token + "slippage"]
    );
  }

  //console.log(depositTroveMapping)
  for (let i = 0; i < withdrawnCollateral.length; i++) {
    const address = withdrawnCollateral[i].address;
    withdrawTroveMapping[address] = Decimal.fromWithPrecision(
      isNaN(withdrawnCollateral[i].change) || values[withdrawnCollateral[i].token] < 0
        ? 0
        : withdrawnCollateral[i].change * format(receiptPerUnderlyingRatios[address]),
      tokenDataMappingA[address].underlyingDecimals
    );
    if (
      withdrawTroveMapping[address]
        .add(Decimal.from(".00009"))
        .gte(
          withdrawnCollateral[i].underlying == ""
            ? trove.collaterals[address] != undefined
              ? trove.collaterals[address]
              : 0
            : trove.collaterals[address] != undefined
            ? trove.collaterals[address]
            : 0
        )
    ) {
      withdrawTroveMapping[address] =
        withdrawnCollateral[i].underlying == ""
          ? trove.collaterals[address]
          : trove.collaterals[address];
    }

    withdrawCollateralsMaxSlippagesTroveMapping[address] = Decimal.from(
      isNaN(values[withdrawnCollateral[i].token + "slippage"]) ||
        values[withdrawnCollateral[i].token + "slippage"] < 0
        ? 0
        : values[withdrawnCollateral[i].token + "slippage"]
    );
  }

  //console.log("withdrawTroveMapping", withdrawTroveMapping)

  // // Get current leverages and slippages
  // for (let i = 0; i < depositedCollateral.length; i++) {
  //   depositCollateralsLeveragesTroveMapping[depositedCollateral[i].token] =  Decimal.from(values[depositedCollateral[i].token + "leverage"])
  //   depositCollateralsMaxSlippagesTroveMapping[depositedCollateral[i].token] =  Decimal.from(values[depositedCollateral[i].token + "slippage"])
  // }

  let adjustParams: TroveAdjustmentParams<TroveMappings>;
  let openTroveParams: TroveCreationParams<TroveMappings> = {
    decimals: decimals,
    depositCollaterals: depositTroveMapping,
    borrowSTAR: { debt: Decimal.from(thisTxBorrowAmount) }
  };
  let openTroveLeverUpParams: TroveCreationLeverUpParams<TroveMappings> = {
    decimals: decimals,
    depositCollaterals: depositTroveMapping,
    borrowSTAR: { debt: Decimal.from(thisTxBorrowAmount) },
    depositCollateralsLeverages: depositCollateralsLeveragesTroveMapping,
    depositCollateralsMaxSlippages: depositCollateralsMaxSlippagesTroveMapping
  };

  let addCollLeverUpParams: TroveAddCollLeverupParams<TroveMappings>;

  if (thisTxBorrowAmount === String(0)) {
    addCollLeverUpParams = {
      depositCollaterals: depositTroveMapping,
      depositCollateralsLeverages: depositCollateralsLeveragesTroveMapping,
      depositCollateralsMaxSlippages: depositCollateralsMaxSlippagesTroveMapping
    };
  } else {
    addCollLeverUpParams = {
      depositCollaterals: depositTroveMapping,
      depositCollateralsLeverages: depositCollateralsLeveragesTroveMapping,
      depositCollateralsMaxSlippages: depositCollateralsMaxSlippagesTroveMapping,
      borrowSTAR: { debt: Decimal.from(thisTxBorrowAmount) }
    };
  }

  let withdrawCollUnleverUpParams: TroveWithdrawCollUnleverUpParams<TroveMappings>;

  if (thisTxBorrowAmount === String(0)) {
    withdrawCollUnleverUpParams = {
      withdrawCollaterals: withdrawTroveMapping,
      withdrawCollateralsMaxSlippages: withdrawCollateralsMaxSlippagesTroveMapping
    };
  } else {
    withdrawCollUnleverUpParams = {
      withdrawCollaterals: withdrawTroveMapping,
      withdrawCollateralsMaxSlippages: withdrawCollateralsMaxSlippagesTroveMapping,
      repaySTAR: { debt: Decimal.from(thisTxBorrowAmount) }
    };
  }

  // Set borrow/repay
  if (thisTxBorrowAmount === String(0)) {
    adjustParams = {
      depositCollaterals: depositTroveMapping,
      withdrawCollaterals: withdrawTroveMapping
    };
  } else if (values["STARmode"] === "deposit") {
    adjustParams = {
      depositCollaterals: depositTroveMapping,
      withdrawCollaterals: withdrawTroveMapping,
      borrowSTAR: { debt: Decimal.from(thisTxBorrowAmount) }
    };
  } else {
    adjustParams = {
      depositCollaterals: depositTroveMapping,
      withdrawCollaterals: withdrawTroveMapping,
      repaySTAR: { debt: Decimal.from(thisTxBorrowAmount) }
    };
  }

  // Open Trove function with the correct Trove creation params
  ////console.log("Confirmchangesmodal.tsx, adjustParams", adjustParams)
  //console.log("aicr", aicr)
  ////console.log('adjustparams', adjustParams)
  const [adjust] = useTransactionFunction(
    "adjust-trove",
    liquity.send.adjustTrove.bind(liquity.send, adjustParams, boostedAICR, {
      maxBorrowingRate
    })
  );

  // Opens trove
  const [open] = useTransactionFunction(
    "open-trove",
    liquity.send.openTrove.bind(liquity.send, openTroveParams, boostedAICR, {
      maxBorrowingRate
    })
  );
  // Lever up
  const [openLeverUp] = useTransactionFunction(
    "lever-up",
    liquity.send.openTroveLeverUp.bind(
      liquity.send,
      openTroveLeverUpParams,
      Decimal.from(boostedAICR),
      "open",
      maxBorrowingRate
    )
  );
  const [addCollLeverUp] = useTransactionFunction(
    "add-coll-lever-up",
    liquity.send.addCollLeverUp.bind(liquity.send, addCollLeverUpParams, boostedAICR, {
      maxBorrowingRate
    })
  );
  const [withdrawCollUnleverUp] = useTransactionFunction(
    "withdraw-coll-unlever-up",
    liquity.send.withdrawCollUnleverUp.bind(liquity.send, withdrawCollUnleverUpParams, boostedAICR, {
      maxBorrowingRate
    })
  );

  const tokensToApprove: string[] = [];
  const approveTo: string[] = [];
  const amounts: Decimalish[] = [];

  const bool_list2: boolean[] = new Array(depositedCollateral.length).fill(false);
  const finalTokens: string[] = [];
  for (let i = 0; i < boolList.length; i++) {
    if (!bool_list2[i]) {
      finalTokens.push(tokensToApprove[i]);
    }
  }

  for (let i = 0; i < depositedCollateral.length; i++) {
    const tokenAddress = depositedCollateral[i].address;
    if (tokenDataMappingA[tokenAddress].isVault) {
      tokensToApprove.push(tokenDataMappingA[tokenAddress].underlying);
      approveTo.push(tokenAddress);
    } else {
      tokensToApprove.push(tokenAddress);
      approveTo.push(contractAddresses.borrowerOperations.address);
    }
    amounts.push(Decimal.from("1000000000000000000000000000"));
  }
  // Version of multi-approve to fix transaction error
  const [multiTransaction] = useTransactionFunction(
    "multi-approve",
    liquity.send.multipleApproveERC20.bind(liquity.send, tokensToApprove, approveTo, amounts)
  );
  //console.log('depositedCollateral', depositedCollateral)

  // liquity.send,
  // addresses,
  // "0x6387C0E385196FEcb43D5fe37EBe9777B790a882",
  // Decimal.from("10000000000000000000000000")
  const checkLeverage = () => {
    for (var i = 0; i < depositedCollateral.length; i++) {
      const lvg: Decimal = depositCollateralsLeveragesTroveMapping[depositedCollateral[i].address];
      if (lvg.lte(Decimal.from(1))) {
        return false;
      }
    }
    return true;
  };

  const onApprove = async () => {
    // const tokens: string[] = [];
    // const bool_list: boolean[] = new Array(depositedCollateral.length).fill(false)

    // for (let i = 0; i < depositedCollateral.length; i++) {
    //   tokens.push(address);
    // }
    // const finalTokens: string[] = [];
    // for (let i = 0; i < boolList.length; i++) {
    //   if (!boolList[i]) {
    //     finalTokens.push(tokens[i]);
    //   }
    // }
    // const multi = await multiApproveToken(finalTokens);
    // multi();

    // for (let i = 0; i < depositedCollateral.length; i++) {
    //   bool_list[i] = await checkAllowance(address, Decimal.from(depositedCollateral[i].change))
    // }
    if (step === 1) {
      multiTransaction();
    }
  };

  const showSTARGasCompensation = () => {
    if (trove && trove.status !== "open") {
      return (
        <Flex>
          <Text textStyle="body2" color="white">
            {"STAR Gas Compensation: "}{" "}
            {
              <Tooltip>
                {
                  "200 STAR is set aside in the case of liquidations. It will be returned when the trove is closed"
                }
              </Tooltip>
            }
          </Text>
          <Spacer />
          <Text textStyle="body2" color="white" textAlign={["right", "left"]} fontWeight="bold">
            200 STAR
          </Text>
        </Flex>
      );
    }
  };

  // TODO: Add liquity
  const onDeposit = () => {
    console.log("@open: debt", +openTroveParams.borrowSTAR.debt);
    console.log(
      "@open: depositCollaterals",
      +openTroveParams.depositCollaterals["0x4d57C87Bb284Ae447764CD4E8386d23Cdd1DBc2B"]
    );
    // console.log("setting to false")
    if (step === 2) {
      if (!understandLiquidation || !understandRedemption) {
        if (!understandLiquidation) {
          setUnderstandLiquidationError(true);
        }
        if (!understandRedemption) {
          setUnderstandRedemptionError(true);
        }
      } else {
        if (borrowMode === "unlever") {
          withdrawCollUnleverUp();
        } else if (
          trove.status.toString() === "nonExistent" ||
          trove.status.toString() === "closedByOwner" ||
          trove.status.toString() === "closedByLiquidation" ||
          trove.status.toString() === "closedByRedemption"
        ) {
          if (borrowMode === "lever") {
            openLeverUp();
          } else {
            open();
          }
        } else if (
          !(
            trove.status.toString() === "nonExistent" ||
            trove.status.toString() === "closedByOwner" ||
            trove.status.toString() === "closedByLiquidation" ||
            trove.status.toString() === "closedByRedemption"
          )
        ) {
          if (borrowMode === "lever") {
            //console.log("ddd", addCollLeverUpParams);
            addCollLeverUp();
          } else {
            adjust();
          }
        }
        onClose();
        onTxModalOpen();
        collateral.map(item => {
          if (values[item.token]) {
            delete values[item.token];
          }
        });
        if (values["STAR"]) {
          delete values["STAR"];
        }
      }
    }
  };
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);
  //console.log("changed collateral", changedCollateral);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="outside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textStyle="title3" fontSize="2xl" pb={1}>
            Confirm Changes
            <Box onClick={onClose}>
              <ModalCloseButton />
            </Box>
          </ModalHeader>
          <ModalBody>
            <Divider />

            {depositedCollateral.length !== 0 && (
              <>
                <Text as="h4" textStyle="title4" color="white" mt={5} mb={4}>
                  Deposited Collateral
                </Text>
                <Box
                  overflowY={changedCollateral.length > 2 ? "scroll" : undefined}
                  maxHeight="20rem"
                  sx={preon.scrollbar}
                >
                  {depositedCollateral.map(
                    ({
                      address,
                      token,
                      change,
                      fee,
                      feePercentage,
                      starFromLever,
                      changeWithoutLever,
                      leverage
                    }) => (
                      <CollateralItem
                        token={token}
                        amount={change}
                        starFromLever={starFromLever}
                        changeWithoutLever={changeWithoutLever}
                        leverage={leverage}
                        ratio={format(safetyRatios[address])}
                        fee={getVC(fee, format(safetyRatios[address]))} // assumes fee is = percentage fee * dollar value of collateral
                        feePercentage={feePercentage}
                        mb={3}
                        pr={changedCollateral.length > 2 ? 1.5 : 0}
                        key={token}
                      />
                    )
                  )}
                </Box>
                <Divider mt={5} />
              </>
            )}

            {withdrawnCollateral.length !== 0 && (
              <>
                <Text as="h4" textStyle="title4" color="white" mt={5} mb={4}>
                  Withdrawn Collateral
                </Text>
                <Box
                  overflowY={changedCollateral.length > 2 ? "scroll" : undefined}
                  maxHeight="20rem"
                  sx={preon.scrollbar}
                >
                  {withdrawnCollateral.map(({ address, token, change, starFromLever }) => (
                    <CollateralItem
                      token={token}
                      amount={change}
                      ratio={format(safetyRatios[address])}
                      starFromLever={starFromLever}
                      mb={4}
                      pr={changedCollateral.length > 2 ? 1.5 : 0}
                      key={token}
                    />
                  ))}
                </Box>
                <Divider mt={5} />
              </>
            )}

            <Flex my={5}>
              <Text color="white" as="h4" textStyle="title4">
                Collateral Change RAV:
              </Text>
              <Spacer />
              <Text textStyle="title4">
                <Text as="span" color="green.500">
                  +{getNum(addedCollateralVC, 2)}
                </Text>
                {subtractedCollateralVC !== 0 && (
                  <Text as="span" color="red.500" ml={3.5}>
                    -{getNum(subtractedCollateralVC, 2)}
                  </Text>
                )}
              </Text>
            </Flex>

            <Divider />

            <Text as="h4" textStyle="title4" color="white" mt={5} mb={4}>
              Trove Summary After Adjustments
            </Text>
            <Box
              overflowY={
                unchangedCollateral.length + changedCollateral.length > 3 ? "scroll" : undefined
              }
              maxHeight="14rem"
              sx={preon.scrollbar}
              mb={4}
            >
              {unchangedCollateral.map(({ token, total, address }) => (
                <CollateralItem
                  token={token}
                  amount={
                    total *
                    format(underlyingPerReceiptRatios[address]) *
                    10 ** (18 - tokenDataMappingA[address].underlyingDecimals)
                  }
                  ratio={format(safetyRatios[address])}
                  mb={4}
                  pr={unchangedCollateral.length > 3 ? 1.5 : 0}
                  key={token}
                />
              ))}
              {changedCollateral.map(({ token, total, address, mode }) => (
                <CollateralItem
                  token={token}
                  amount={total}
                  ratio={format(safetyRatios[address])}
                  mb={4}
                  pr={unchangedCollateral.length > 3 ? 1.5 : 0}
                  key={token}
                />
              ))}
            </Box>

            <Divider />
            <Flex my={5}>
              <Text color="white" as="h4" textStyle="title4">
                Final Collateral RAV Balance: <Tooltip>{VC_explanation}</Tooltip>
              </Text>
              <Spacer />
              <Text color="white" as="h4" textStyle="title4">
                ${getNum(currVcValue, 2)}
              </Text>
            </Flex>

            <Divider />

            <Text as="h4" textStyle="title4" mt={5} mb={4} color="#f0c3f7">
              {values["STARmode"] === "withdraw" ? "STAR Repay" : "STAR Borrow"}
            </Text>
            <Flex align="center" mb={3}>
              <Icon iconName="STAR" h={5} w={5} />
              <Text as="h5" textStyle="subtitle3" color="#f0c3f7" ml={1.5} pr={1}>
                STAR
              </Text>
              <Text as="h5" textStyle="subtitle3" color="#f0c3f7" ml={1.5}>
                (1 STAR {` ≈ $${getNum(+String(STARPrice), 2)})`}
              </Text>
            </Flex>
            {
              /* todo get correct condition */
              borrowMode !== "normal" ? (
                <Flex mb={3}>
                  <Text textStyle="body2" color="white">
                    {borrowMode === "lever"
                      ? "Total Borrow Amount from Leverage:"
                      : "STAR Gained from Deleverage: "}
                  </Text>
                  <Spacer />
                  <CoinAmount
                    token="STAR"
                    amount={
                      borrowMode === "lever" ? newBorrowAmountWithLever : +String(totalSTARFromLever)
                    }
                    fontWeight="bold"
                    noCurrencyConvert={true}
                  />
                </Flex>
              ) : (
                <></>
              )
            }
            <Flex mb={3}>
              <Text textStyle="body2" color="white">
                {borrowMode !== "normal"
                  ? `${
                      borrowMode === "lever" ? "Additional Borrowed Amount:" : "Total Debt Repaid:"
                    } `
                  : values["STARmode"] === "withdraw"
                  ? "Repaid Amount"
                  : "Borrow Amount"}
              </Text>
              <Spacer />
              <CoinAmount
                token="STAR"
                amount={newBorrowAmount}
                fontWeight="bold"
                noCurrencyConvert={true}
              />
            </Flex>
            <Flex mb={3}>
              <Text textStyle="body2" color="white">
                Borrow Fees:
              </Text>
              <Spacer />
              <CoinAmount
                token="STAR"
                amount={borrowFees}
                fontWeight="bold"
                noCurrencyConvert={true}
              />
            </Flex>
            <Flex mb={3}>
              <Text textStyle="body2" color="white">
                {"Deposit Fees: "}{" "}
                {<Tooltip>{"The constant deposit fee for this collateral."}</Tooltip>}
              </Text>
              <Spacer />
              <CoinAmount
                token="STAR"
                amount={totalDepositFeesInSTAR}
                fontWeight="bold"
                noCurrencyConvert={true}
              />
            </Flex>

            {/* <Flex direction="column">
              <Text textStyle="body2" color="white" mb={2}>
                Set Max Fee (optional)
              </Text>
              <Spacer />
              <AdjustInput
                name="maxfee"
                token="STAR"
                min={0}
                isSTARDebt={true}
                fillContainer
                showToken
              />
            </Flex> */}

            {showSTARGasCompensation()}

            <Flex my={5} align="center">
              <Text color="white" as="h4" textStyle="title4">
                {values["STARmode"] === "deposit" ? "Total Borrowed + Fees" : "New STAR Trove Debt"}
              </Text>
              <Spacer />
              <CoinAmount
                token="STAR"
                amount={totalBorrowIncludingFees}
                fontSize="xl"
                fontWeight="bold"
                noCurrencyConvert={true}
              />
            </Flex>

            <Flex>
              <Text textStyle="title4" as="h4" color="white">
                New Collateralization Ratio <Tooltip>Ratio between Trove RAV and STAR Debt</Tooltip>
              </Text>
              <Spacer />
              <Text textStyle="title4" as="h4" color="white" fontWeight="bold">
                {(newCollateralRatio * 100).toFixed(3)}%
              </Text>
            </Flex>

            <Flex mt={5}>
              <Text textStyle="title4" as="h4" color="white">
                New Adjusted Collateral Ratio{" "}
                <Tooltip>
                  Ratio between Trove Adjusted RAV and STAR Debt. This calculation is similar to the
                  Risk-Adjusted Value calculation except with a different ratio for each collateral.
                  Stablecoin collaterals have an Adjusted Safety Ratio of 1.6 while other assets will
                  have System Ratio = Safety Ratio.
                </Tooltip>
              </Text>
              <Spacer />
              <Text textStyle="title4" as="h4" color="white" fontWeight="bold">
                {(aicr * 100).toFixed(3)}%
              </Text>
            </Flex>

            {bottomFiveTroves.some(e => aicr < e) && (
              <>
                <Text mt={3} color="#fc03c6" fontWeight="bold">
                  {" "}
                  Your trove after current adjustment will be the bottom 5 troves sorted by{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      "https://techdocs.preon.finance/how-does-preon-finance-work/recovery-mode#what-is-the-total-collateral-ratio"
                    }
                    style={{ outline: "none", textDecoration: "underline" }}
                  >
                    AICR
                  </a>
                  . This means that your trove will be one of the first troves to get{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      "https://techdocs.preon.finance/how-does-preon-finance-work/redemptions-and-star-price-stability#what-are-redemptions"
                    }
                    style={{ outline: "none", textDecoration: "underline" }}
                  >
                    redeemed against
                  </a>
                  . We suggest you add more collateral or decrease debt to limit such risk.
                </Text>
                <Text mt={3} color="#fc03c6" fontWeight="bold">
                  The current bottom 5 troves have AIRC of [{" "}
                  {bottomFiveTroves.map(e => (e * 100).toFixed(2) + "%, ")} ]
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter flexDirection="column">
            <VStack spacing={5} mb={5} alignItems="flex-start">
              <Checkbox
                size="lg"
                colorScheme="pink"
                isChecked={understandLiquidation}
                onChange={() => setUnderstandLiquidation(!understandLiquidation)}
                error={understandLiquidationError}
              >
                <Text ml={1} textStyle="body1">
                  I understand that my trove can be liquidated if its collateral ratio drops below
                  110% (normal mode) or 150% (recovery mode)
                </Text>
              </Checkbox>

              <Checkbox
                size="lg"
                colorScheme="pink"
                onChange={() => setUnderstandRedemption(!understandRedemption)}
                isChecked={understandRedemption}
                error={understandRedemptionError}
              >
                <Text ml={1} textStyle="body1">
                  I understand that my trove can be affected by redemptions.
                </Text>
              </Checkbox>
            </VStack>

            <HStack spacing={6}>
              <Button variant={step !== 1 ? "quaternary" : "gradient"} onClick={onApprove}>
                Approve
              </Button>
              <Button variant={step !== 2 ? "quaternary" : "gradient"} onClick={onDeposit}>
                Confirm
              </Button>
            </HStack>

            <ProgressBar step={step === 2 ? 1 : 0} w="30%" mt={2} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmChangesModal;
