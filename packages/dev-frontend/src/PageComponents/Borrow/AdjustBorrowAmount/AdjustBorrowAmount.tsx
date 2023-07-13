// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  BoxProps,
  Center,
  Text,
  Flex,
  Tr,
  Td,
  Spacer,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  SliderMark,
  Divider,
  Input,
  IconButton,
  Collapse
} from "@chakra-ui/react";
import Icon from "../../../components/Icon";
import tokenData from "../../../TokenData";
import { adjustValue, getNum, addString, format } from "../../../Utils/number";
import { CoinMode } from "../../../Types";
import { LiquityStoreState, Decimal } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { Collateral } from "../../../Types";

import {
  getFeesCollateral,
  getAffectedCollateral,
  calculateTotalSTARFromLever
} from "../AdjustTrove/AdjustTrove.utils";
import { useLiquity } from "../../../hooks/LiquityContext";
import Tooltip from "../../../components/Tooltip";
import { VC_explanation } from "../../../Utils/constants";
import { tokenDataMappingA } from "../../../TokenData";
import { AdjustInput, TokenTable } from "../../../components";
// import { hashMessage } from "ethers/lib/utils";
import { cancelCheck } from "../../../components/Transaction";
import ConfirmChangesModal from "../ConfirmChangesModal";

type AdjustBorrowAmountProps = {
  values: { [key: string]: any };
  collateral: Collateral[];
  validateFunc: any;
  showIcons: Boolean;
  borrowFee: string;
  borrowMode: "normal" | "lever" | "unlever";
  leverSave: "saved" | "unsaved";
  depositFees: any; //TroveMappings;
  mode: CoinMode;
  setMode: React.Dispatch<React.SetStateAction<CoinMode>>;
  adjustedCollateral: any[]; // AdjustedTokenData[];
  vcValue: number;
} & BoxProps;

// TODO Fix type def any
const selector = ({
  borrowingRate,
  trove,
  starBalance,
  underlyingPrices,
  showIcons,
  decimals,
  safetyRatios,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios
}: any | LiquityStoreState) => ({
  starBalance,
  trove,
  underlyingPrices,
  borrowingRate,
  decimals,
  showIcons,
  safetyRatios,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios
});

const AdjustBorrowAmount: React.FC<AdjustBorrowAmountProps> = ({
  values,
  collateral,
  validateFunc,
  borrowFee,
  showIcons,
  borrowMode,
  leverSave,
  depositFees,
  adjustedCollateral,
  mode,
  setMode,
  vcValue,
  ...props
}) => {
  const {
    starBalance,
    trove,
    underlyingPrices,
    borrowingRate,
    decimals,
    safetyRatios,
    underlyingPerReceiptRatios,
    receiptPerUnderlyingRatios
  } = useLiquitySelector(selector);
  const [changes, setChanges] = useState<boolean>(false);

  const walletBalance = +starBalance;
  console.log("walletbalance", walletBalance);
  let troveBalance = +trove.debt["debt"];
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);
  // console.log("111", troveBalance)
  let borrowMessage = "Final amount of borrowed STAR after adjustments.";
  const [troveBalancePost, setTroveBalancePost] = useState<number>(troveBalance);
  // const calculateMaxDebt = () => {
  //   let tempTroveBalancePost = 0;
  //   if (mode["STAR"] === "deposit" && values["STAR"] > 0) {
  //     let STARBorrowFee = values["STAR"] * parseFloat(borrowingRate.toString());
  //     tempTroveBalancePost = tempTroveBalancePost + STARBorrowFee;
  //   }
  //   let x = getFeesCollateral(getAffectedCollateral(values), underlyingPrices, depositFees, values);
  //   tempTroveBalancePost = tempTroveBalancePost + x;
  //   // If first time borrow add 200 to this value
  //   if (trove && trove.status !== "open") {
  //     borrowMessage = borrowMessage.concat(
  //       " 200 STAR is added here for Gas compensation in the case of liquidations. " +
  //         "It will be returned when the trove is closed."
  //     );
  //     tempTroveBalancePost = addString(tempTroveBalancePost, "200");
  //   }
  //   const tempTotalSTARFromLever = calculateTotalSTARFromLever(
  //     getAffectedCollateral(values),
  //     underlyingPrices,
  //     values
  //   );
  //   if (tempTotalSTARFromLever && borrowMode === "lever") {
  //     let STARBorrowFee = +String(tempTotalSTARFromLever) * parseFloat(borrowingRate.toString());
  //     // console.log('STARBorrowFee', STARBorrowFee)
  //     tempTroveBalancePost = tempTroveBalancePost + STARBorrowFee;
  //   }
  //   setTotalSTARFromLever(tempTotalSTARFromLever);
  //   if (borrowMode === "lever") {
  //     tempTroveBalancePost = addString(tempTroveBalancePost, tempTotalSTARFromLever.toString());
  //   } else if (borrowMode === "unlever") {
  //     tempTroveBalancePost = tempTroveBalancePost;
  //     // console.log("tempTroveBalancePost", tempTroveBalancePost)
  //   }
  //   console.log('1', (((vcValue * 100) / 110)))
  //   console.log('2', tempTroveBalancePost)
  //   console.log('3', adjustValue(mode["STAR"], troveBalance, values["STAR"]))
  //   console.log('parseFloat(borrowingRate.toString()))', (((vcValue) / 1.1 * (1- parseFloat(borrowingRate.toString())))))

  //   tempTroveBalancePost = ((((vcValue) / 1.1)) - adjustValue(mode["STAR"], troveBalance, values["STAR"]) - adjustValue(mode["STAR"], troveBalance, values["STAR"]) * parseFloat(borrowingRate.toString()))/(1+parseFloat(borrowingRate.toString()))

  //   console.log('tempTroveBalancePost', tempTroveBalancePost)
  //   // console.log('troveBalancePost', troveBalancePost)
  // };
  const updateTroveBalance = () => {
    let tempTroveBalancePost = adjustValue(mode["STAR"], troveBalance, values["STAR"]);
    if (mode["STAR"] === "deposit" && values["STAR"] > 0) {
      let STARBorrowFee = values["STAR"] * parseFloat(borrowingRate.toString());
      tempTroveBalancePost = tempTroveBalancePost + STARBorrowFee;
    }
    const feesCollateral = getFeesCollateral(
      getAffectedCollateral(values),
      underlyingPrices,
      depositFees,
      values,
      safetyRatios
    );

    // const feesCollateral = getFeesCollateral(getAffectedCollateral(values), prices, depositFees, values, safetyRatios, underlyingPerReceiptRatios);
    tempTroveBalancePost = tempTroveBalancePost + feesCollateral;
    // If first time borrow add 200 to this value
    if (trove && trove.status !== "open") {
      borrowMessage = borrowMessage.concat(
        " 200 STAR is added here for Gas compensation in the case of liquidations. " +
          "It will be returned when the trove is closed."
      );
      tempTroveBalancePost = addString(tempTroveBalancePost, "200");
    }
    const tempTotalSTARFromLever = calculateTotalSTARFromLever(
      adjustedCollateral,
      underlyingPrices,
      values,
      safetyRatios
    );

    if (tempTotalSTARFromLever && borrowMode === "lever") {
      let STARBorrowFee = +String(tempTotalSTARFromLever) * parseFloat(borrowingRate.toString());
      tempTroveBalancePost = tempTroveBalancePost + STARBorrowFee;
    }
    setTotalSTARFromLever(() => tempTotalSTARFromLever);
    if (borrowMode === "lever") {
      tempTroveBalancePost = addString(tempTroveBalancePost, tempTotalSTARFromLever.toString());
    } else if (borrowMode === "unlever") {
      tempTroveBalancePost = tempTroveBalancePost;
    }
    setTroveBalancePost(tempTroveBalancePost);
    setSliderValue(tempTroveBalancePost - troveBalancePost);
    // console.log('troveBalancePost', troveBalancePost)
  };
  const [disabled, setDisabled] = useState(false);
  const confirmChanges = () => {
    validateFunc(values, ((vcValue * 100) / troveBalancePost).toFixed(3), troveBalancePost);
    // setDisabled(true);
    // console.log("i am running")
  };

  console.log("Values", values.STAR);
  console.log("disable", disabled);

  const checkDisable = () => {
    if (cancelCheck == false) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };
  const [totalSTARFromLever, setTotalSTARFromLever] = useState(
    calculateTotalSTARFromLever(adjustedCollateral, underlyingPrices, values, safetyRatios)
  );
  // update troveBalancePost(fees)
  useEffect(() => {
    updateTroveBalance();
  }, [values, leverSave]);

  // useEffect(() => {
  //   if (borrowMode !== "unlever") {
  //     coins["STAR"] = "deposit";
  //   } else {
  //     coins["STAR"] = "withdraw";
  //   }
  //   setMode(coins);
  // }, [borrowMode]);
  useEffect(() => {
    let changed = false;
    Object.keys(values).map(collateral => {
      if (!collateral.includes("mode") && values[collateral] != 0) {
        setChanges(true);
        changed = true;
      }
    });
    if (!changed) {
      setChanges(false);
    }
  }, [values, leverSave]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkDisable();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getMaxBorrow = () => {
    // * formula:
    // * vcValue / 110.6 * 100 - troveBalance;
    const _maxAmount = (vcValue.toFixed(8) / 113) * 100 - troveBalance.toFixed(8);
    const _fee = _maxAmount * parseFloat(borrowingRate.toString());

    if (_maxAmount < 0 || !_maxAmount || Number.isNaN(_maxAmount)) {
      return 0;
    }

    console.log("@max", _maxAmount, _fee, _maxAmount + _fee, _maxAmount - _fee);
    return _maxAmount + _fee;
  };

  const [sliderValue, setSliderValue] = useState(0);
  // console.log('sliderValue', sliderValue)
  const tableHeaderLeverage =
    borrowMode === "unlever" ? "STAR From Deleverage" : "New Borrow Amount from Leverage";
  const tableTooltipLeverage =
    borrowMode === "unlever"
      ? "Total STAR Received in your wallet by auto-selling collateral from your trove. This can be used automatically to repay your debt in the box to the right"
      : "Total STAR being borrowed from Leverage. For each collateral based on the leverage, a certain amount of STAR is taken out as debt in total";
  return (
    <>
      <Box {...props}>
        <Flex justifyContent={"space-between"}>
          <Text textStyle="title2" px={10} mb={1}>
            Borrow/Repay
          </Text>
          <Flex mr={"2em"}>
            {show ? (
              <IconButton
                aria-label="Expand Protocol Overview"
                size={"sm"}
                ml={3}
                onClick={handleToggle}
                variant="gradient"
                isRound={true}
                icon={<Icon iconName="CollapseIcon" />}
              />
            ) : (
              <IconButton
                aria-label="Expand Protocol Overview"
                size={"sm"}
                ml={3}
                onClick={handleToggle}
                variant="gradient"
                isRound={true}
                icon={<Icon style={{ transform: "rotate(180deg)" }} iconName="CollapseIcon" />}
              />
            )}
          </Flex>
        </Flex>
        <Flex ml={10} mr={"2em"}>
          <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
        </Flex>
        <Collapse in={show}>
          <>
            <Flex flexDirection={"column"}>
              <Text textStyle="title4" color="purple" ml={10} mb={5}>
                AMOUNT
              </Text>
              <Flex justifyContent={"space-between"} flexDirection={"row"} ml={10}>
                <AdjustInput
                  name="STAR"
                  iconStatus={mode}
                  setIconStatus={setMode}
                  token="STAR"
                  max={
                    mode["STAR"] === "deposit"
                      ? getMaxBorrow().toFixed(18)
                      : (troveBalance - 2000).toFixed(18)
                  }
                  min={0}
                  precision={18}
                  inputWidth={12}
                  size="sm"
                  showIcons
                  isSTARDebt={true}
                  borrowMode={borrowMode}
                />
                <Button
                  isLoading={disabled}
                  loadingText={mode.STAR == "deposit" ? "Borrowing" : "Repaying"}
                  disabled={disabled}
                  variant="gradient"
                  mr={"2em"}
                  onClick={confirmChanges}
                >
                  {mode.STAR == "deposit" ? "Borrow" : "Repay"}
                </Button>
              </Flex>
              <Flex justifyContent={"space-between"} mt={5} ml={10}>
                <Flex align={"center"}>
                  <Text textStyle={"body1"} mr={3}>
                    Current Balance :
                  </Text>
                  <Text textStyle={"title4"} color="purple">
                    {getNum(walletBalance)}
                  </Text>
                </Flex>
                <Flex mr={"2em"} align={"center"}>
                  <Text textStyle={"body1"} mr={3}>
                    New Borrow Amount :
                  </Text>
                  <Text textStyle={"title4"} color="purple">
                    ${getNum(troveBalancePost)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex py={2.5} px={5} mx={6} w="20rem" ml={0}></Flex>
            <Flex ml={10} mr={"2em"}>
              <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
            </Flex>

            <Flex>
              <Spacer />
              <Flex
                border="1px solid"
                borderColor="whiteAlpha.400"
                align="center"
                justify="center"
                borderRadius={5}
                py={2.5}
                px={5}
                mx={6}
                w="20rem"
                ml={0}
              >
                <Text textStyle="subtitle3" textAlign="center" color="purple">
                  {changes && "New"} Risk Adjusted Value:
                </Text>
                <Spacer />
                <Text textStyle="subtitle3" textAlign="center">
                  ${isNaN(vcValue) ? 0 : getNum(vcValue)} <Tooltip>{VC_explanation}</Tooltip>
                </Text>
              </Flex>
              <Flex
                // bg="purple"
                border="1px solid"
                borderColor="whiteAlpha.400"
                align="center"
                justify="center"
                borderRadius={5}
                py={2.5}
                px={5}
                mx={6}
                w="20rem"
                mr={"2em"}
              >
                <Text textStyle="subtitle3" color="purple">
                  {changes && "New"} Collateral Ratio:
                </Text>
                <Spacer />
                <Text textStyle="subtitle3">
                  {/* // * uncomment to know ratio */}
                  {/* {vcValue}
              <br />
              {troveBalancePost}
              <br /> */}
                  {isNaN((vcValue * 100) / troveBalancePost)
                    ? 0
                    : ((vcValue * 100) / troveBalancePost).toFixed(3)}
                  % <Tooltip>Ratio between Trove RAV and STAR Debt</Tooltip>
                </Text>
              </Flex>
            </Flex>
            <Flex ml={10} mr={"2em"}>
              <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
            </Flex>
          </>
        </Collapse>

        {/* <Text textStyle="title2" px={10} mb={1} mt={10}>
          Repay
        </Text>
        <Flex ml={10} mr={'2em'}>
          <Divider mt={5} mb={5}/>
        </Flex>

        <Flex flexDirection={"column"}>
          <Text textStyle="title4" color="purple" ml={10} mb={5}>
            AMOUNT
          </Text>
          <Flex justifyContent={"space-between"} flexDirection={"row"} ml={10}>
            <AdjustInput
              color="white"
              name="STAR"
              iconStatus={mode}
              setIconStatus={setMode}
              token="STAR"
              max={
                mode["STAR"] === "deposit"
                  ? getMaxBorrow().toFixed(18)
                  : (troveBalance - 2000).toFixed(18)
              }
              min={0}
              precision={18}
              inputWidth={12}
              size="sm"
              showIcons
              isSTARDebt={true}
              borrowMode={borrowMode}
            />
            <Button disabled={disabled} variant="gradient" mr={"2em"} onClick={confirmChanges}>
              Repay
            </Button>
          </Flex>
          <Flex justifyContent={"space-between"} mt={5} ml={10}>
            <Flex align={"center"}>
              <Text textStyle={"body1"} mr={3} fontSize="15px">
                Current Balance :
              </Text>
              <Text textStyle={"title4"} color="purple">
                {getNum(walletBalance)}
              </Text>
            </Flex>
            <Flex mr={"2em"} align={"center"}>
              <Text textStyle={"body1"} mr={3}>
                New Borrow Amount :
              </Text>
              <Text textStyle={"title4"} color="purple">
                ${getNum(troveBalancePost)}
              </Text>
            </Flex>
          </Flex>
        </Flex> */}

        {/* <TokenTable
          headers={
            borrowMode !== "normal"
              ? [
                  "Token",
                  "Wallet Balance",
                  "Borrow Amount",
                  tableHeaderLeverage,
                  "Actions",
                  "New Total Borrow Amount"
                ]
              : ["Token", "Wallet Balance", "Borrow Amount", "Actions", "New Borrow Amount"]
          }
          tooltips={
            borrowMode !== "normal"
              ? [
                  "Name",
                  "Amount of STAR in wallet",
                  "Amount of STAR being borrowed",
                  tableTooltipLeverage,
                  "Borrow increases your trove debt. Repay reduces it",
                  borrowMessage
                ]
              : [
                  "Name",
                  "Amount of STAR in wallet",
                  "Amount of STAR being borrowed",
                  "Borrow increases your trove debt. Repay reduces it",
                  borrowMessage
                ]
          }
          width={borrowMode !== "normal" ? 6 : 5}
        >
          <Tr>
            <Td pt={3} whiteSpace="nowrap">
              <Flex align="center" w={28}>
                <Icon iconName="STAR" h={6} w={6} />
                <Text ml={3} whiteSpace="nowrap">
                  STAR
                </Text>
              </Flex>
            </Td>
            <Td pt={3}>
              <Center bg="purple" borderRadius="infinity" px={2.5} py={1}>
                <Text color="white" textStyle="inherit">
                  {getNum(walletBalance)}
                </Text>
              </Center>
            </Td>
            <Td pt={3}>{getNum(troveBalance)}</Td>
            {borrowMode !== "normal" ? (
              <Td pt={3}>{getNum(Number(totalSTARFromLever.toString()))}</Td>
            ) : (
              <></>
            )}
            <Td pt={3}>
              <Flex direction="column">
                {borrowMode === "unlever" && (
                  <Text textStyle="body2" fontWeight="bold" mb={1} color="purple">
                    Balance: {getNum(walletBalance + Number(totalSTARFromLever.toString()))} 
                  </Text>
                )}
                // 

                
              </Flex>
            </Td>
            <Td pt={3} color="purple">
              ${getNum(troveBalancePost)}
            </Td>
          </Tr>
        </TokenTable> */}
      </Box>
      {/* <Flex align="center" mt={4} mx={6}>
        <Text textStyle="body2" color="purple">
          STAR Borrow Fee: {borrowFee}%
        </Text>
        <Spacer />
        <Button disabled={disabled} variant="gradient" onClick={confirmChanges}>
          Confirm Changes
        </Button>
      </Flex> */}
    </>
  );
};

export default AdjustBorrowAmount;
