// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  BoxProps,
  Text,
  Tr,
  Td,
  Button,
  Flex,
  useDisclosure,
  Divider,
  Wrap,
  WrapItem,
  IconButton,
  Collapse
} from "@chakra-ui/react";
import { Icon, TokenTable, AdjustInput, Toggle } from "../../../components";
import AddCollateralTypeModal from "../AddCollateralTypeModal";
import LeverUpModal from "../LeverUpModal";
import { CoinMode, CoinShow, Collateral, TokenData } from "../../../Types";
import tokenData, { tokenDataMappingA } from "../../../TokenData";
import { format, adjustValue, getNum, formatWithDecimals } from "../../../Utils/number";
import { getAmountChanges } from "../../../Utils/validation";
// import { TroveMappings, Decimal } from "@liquity/lib-base";
import { Decimal } from "@liquity/lib-base";
import { useLiquity } from "../../../hooks/LiquityContext";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import {
  dec,
  getTroveUnderlyingValueWithLever,
  getTroveVaultValueWithLever
} from "../AdjustTrove/AdjustTrove.utils";
import Tooltip from "../../../components/Tooltip";
import { objectKeys } from "@chakra-ui/utils";
import Trove from "../Trove/Trove";

// TODO fix type def
type AdjustCollateralProps = {
  values: { [key: string]: any };
  borrowMode: "normal" | "lever" | "unlever";
  leverSave: "saved" | "unsaved";
  setLeverSave: React.Dispatch<React.SetStateAction<"saved" | "unsaved">>;
  collateral: TokenData[];
  form: any;
  depositFees: any; //TroveMappings;
  mode: CoinMode;
  setMode: React.Dispatch<React.SetStateAction<CoinMode>>;
} & BoxProps;

export interface CollateralAPYs {
  [key: string]: any;
}

const selector = ({
  trove,
  prices,
  tokenBalances,
  safetyRatios,
  decimals,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios,
  total
}: any | LiquityStoreState) => ({
  trove,
  prices,
  tokenBalances,
  safetyRatios,
  decimals,
  underlyingPerReceiptRatios,
  receiptPerUnderlyingRatios,
  total
});

const AdjustCollateral: React.FC<AdjustCollateralProps> = ({
  values,
  collateral,
  form,
  borrowMode,
  setLeverSave,
  leverSave,
  depositFees,
  mode,
  setMode,
  ...props
}) => {
  const {
    trove,
    prices,
    tokenBalances,
    safetyRatios,
    decimals,
    underlyingPerReceiptRatios,
    receiptPerUnderlyingRatios,
    total
  } = useLiquitySelector(selector);
  const {
    isOpen: isAddCollateralTypeOpen,
    onOpen: onAddCollateralTypeOpen,
    onClose: onAddCollateralTypeClose
  } = useDisclosure();

  const { isOpen: isLeverUpOpen, onOpen: onLeverUpOpen, onClose: onLeverUpClose } = useDisclosure();

  const [leveredToken, setLeveredToken] = useState<Collateral>({} as Collateral);
  const [currentCollateral, setcurrentCollateral] = useState([]);
  const tempColl = currentCollateral;
  // const collateral = tokenData;

  // Coin Display Config State
  const coinShow: CoinShow = {};
  collateral.forEach(coin => {
    if (coin.troveBalance === 0) {
      coinShow[coin.token] = false;
    } else {
      coinShow[coin.token] = true;
    }
  });
  const [show, setShow] = useState<CoinShow>(coinShow);
  let availableCollateral = collateral.filter(coin => !show[coin.token]);
  console.log("availablecollateral", availableCollateral);
  console.log("abc currentcollateral", currentCollateral);
  console.log("abc collateral", collateral);

  const openLeverUp = (token: Collateral) => {
    setLeveredToken(token);
    onLeverUpOpen();
    setLeverSave("unsaved");
  };

  console.log("123456..", currentCollateral.length);

  const checker = (values: { [key: string]: any }) => {
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

    return values;
  };

  const [APYs, setAPYs] = useState<CollateralAPYs>({} as CollateralAPYs);
  const [shown, setShown] = React.useState(true);
  const handleToggle = () => setShown(!shown);

  useEffect(() => {
    const cc = tokenData.filter(coin => show[coin.token]);
    setcurrentCollateral(collateral.filter(coin => show[coin.token]));

    const fetchData = async () => {
      const tempAPYs: CollateralAPYs = {};
      for (var i = 0; i < Object.keys(cc).length; i++) {
        const token = cc[i].token;
        let url = `https://api.preon.finance/v1/Collaterals/${token}/APY`;
        if (token === "WETH-WAVAX JLP") {
          url = "https://api.preon.finance/v1/Collaterals/WETHWAVAXJLP/APY"; // these urls are  #staticValue
        } else if (token === "AVAX-USDC JLP") {
          url = "https://api.preon.finance/v1/Collaterals/AVAXUSDCJLP/APY";
          setcurrentCollateral(collateral.filter(coin => show[coin.token]));
        }
        try {
          fetch(url, { method: "GET", mode: "cors" })
            .then(function (response) {
              if (response.ok) {
                return response.json();
              }
              const err = new Error("No live API for " + token);
              throw err;
            })
            .then(function (result) {
              if (result !== undefined) {
                tempAPYs[token] = result;
              }
            })
            .catch(e => {
              // console.log(e);
            });
        } catch (error) {
          // console.log("error", error);
        }
      }
      setAPYs(tempAPYs); // the apy value is coming from tempAPYs, which is from the urls. but the urls are not returning any value, that's why the apy in the front end is showing NaN.  #staticValue
    };
    fetchData();
  }, [show]);

  const showLeverModal = (item: Collateral) => {
    return (
      <Td pt={8} pb={2} pl={2}>
        {borrowMode === "normal" ? (
          <Button variant="orange" isDisabled>
            Lever Up
          </Button>
        ) : borrowMode === "lever" &&
          item.walletBalance === 0 &&
          isNaN(values[item.token + "leverage"]) ? (
          <Button variant="orange" onClick={() => openLeverUp(item)} isDisabled>
            Lever Up
          </Button>
        ) : borrowMode === "lever" &&
          item.walletBalance !== 0 &&
          isNaN(values[item.token + "slippage"]) ? (
          <Button variant="orange" onClick={() => openLeverUp(item)}>
            Lever Up
          </Button>
        ) : borrowMode === "unlever" &&
          item.troveBalance !== 0 &&
          isNaN(values[item.token + "slippage"]) ? (
          <Button variant="orange" onClick={() => openLeverUp(item)}>
            Deleverage
          </Button>
        ) : !isNaN(values[item.token + "leverage"]) && values[item.token + "leverage"] != 1 ? (
          <Button variant="orange" onClick={() => openLeverUp(item)}>
            {values[item.token + "leverage"]}x Leverage
          </Button>
        ) : borrowMode === "lever" && !isNaN(values[item.token + "slippage"]) ? (
          <Button variant="orange" onClick={() => openLeverUp(item)}>
            No Leverage
          </Button>
        ) : (
          <Button variant="orange" onClick={() => openLeverUp(item)}>
            Deleveraged
          </Button>
        )}
      </Td>
    );
  };

  useEffect(() => {
    availableCollateral = collateral.filter(coin => !show[coin.token]);
  }, [values, collateral, currentCollateral]);
  // useEffect(() => {
  //   for (var i = 0; i < collateral.length; i++) {
  //     const coin = collateral[i];
  //     if (borrowMode === "unlever") {
  //       coins[coin.token] = "withdraw";
  //     } else if (borrowMode === "lever") {
  //       coins[coin.token] = "deposit";
  //     }
  //   }
  //   setMode(coins);
  // }, [ borrowMode]);

  // console.log("ratioMapping", underlyingPerReceiptRatios)
  // console.log("collateral", collateral)
  const newFormat = (x: Decimal | number) => {
    if (x) {
      return Math.min(parseFloat(x.toString()), 0.01);
    }
    return 0;
  };
  const getMax = (item: TokenData) => {
    return mode[item.token] === "deposit"
      ? tokenBalances[item.isVault ? item.underlying : item.address].toStringWithDecimals(
          item.underlyingDecimals
        )
      : trove.collaterals[item.address] === undefined && mode[item.token] === "withdraw"
      ? (0).toString()
      : format(
          trove.collaterals[item.address]
            .mul(10 ** (18 - item.underlyingDecimals))
            .div(receiptPerUnderlyingRatios[item.address])
        );
  };
  // let result = (APYs[item.token] * 100).toFixed(2)
  // let borrowApy ;
  // if (isNaN(result)){
  //   borrowApy = 0
  // }else{
  //   borrowApy = result
  // }

  const handleClearAll = () => {
    setcurrentCollateral([]);
    // currentCollateral = collateral;
    // console.log("Tempcoll", tempColl);
    // setcurrentCollateral(tempColl);
  };

  return (
    <>
      <AddCollateralTypeModal
        isOpen={isAddCollateralTypeOpen}
        onClose={onAddCollateralTypeClose}
        show={show}
        setShow={setShow}
        availableCollateral={availableCollateral}
        borrowMode={borrowMode}
      />
      <LeverUpModal
        isOpen={isLeverUpOpen}
        onClose={onLeverUpClose}
        collateral={leveredToken}
        type={borrowMode}
        values={values}
        setLeverSave={setLeverSave}
        depositFees={depositFees}
      />
      <Box {...props}>
        <Flex justifyContent={"space-between"}>
          <Text textStyle="title2" color="White" px={6} mt={20} ml={5}>
            {trove.status === "open" ? "Adjust" : "Add"} Collateral
          </Text>
          <Flex mr={"0.75em"} px={6} mt={20}>
            {shown ? (
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

        <Collapse in={shown}>
          <>
            <Flex ml={10} mr={"2em"}>
              <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
            </Flex>

            <Flex justifyContent={"flex-end"} mr={10}>
              <Button
                variant="gradient"
                _active={{ bg: "transparent" }}
                mt={2}
                mx={6}
                leftIcon={<Icon iconName="BlueAddIcon" />}
                onClick={onAddCollateralTypeOpen}
              >
                Add Collateral Type
              </Button>
              <Button
                variant="gradient"
                _active={{ bg: "transparent" }}
                mt={2}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Flex>
            <Flex ml={10} mr={"2em"}>
              <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
            </Flex>

            {currentCollateral.length > 0 ? (
              <>
                {Object.values(show).some(_ => _) ? (
                  <Flex flexDirection={"column"}>
                    {currentCollateral
                      .filter(token => {
                        if (borrowMode === "unlever") {
                          if (token.troveBalance === 0) {
                            return false;
                          } else {
                            return true;
                          }
                        }
                        return true;
                      })
                      .map(item => (
                        <Box
                          border={"2px solid"}
                          borderColor="whiteAlpha.200"
                          borderRadius={"10"}
                          padding={5}
                          flexDirection={"column"}
                          ml={10}
                          mt={3}
                          mb={3}
                          mr={5}
                        >
                          <Flex align={"center"} flex={1} mb={3}>
                            <Icon iconName={item.token} h={5} w={5} />
                            <Text
                              ml={3}
                              mr={3}
                              fontSize="20px"
                              textStyle="title3"
                              textAlign={"center"}
                            >
                              {item.token}
                            </Text>
                          </Flex>

                          <Flex flexDirection={"row"} justifyContent={"space-between"}>
                            <Flex flexDirection={"column"} ml={8}>
                              <Flex justifyContent={"space-between"}>
                                <Text textStyle="body1" mr={10}>
                                  Safety Ratio :
                                </Text>
                                <Text textStyle="subtitle1" color="purple">
                                  {format(safetyRatios[item.address]).toFixed(3)}
                                </Text>
                              </Flex>
                              <Flex justifyContent={"space-between"}>
                                <Text textStyle="body1">Deposit Fee :</Text>
                                <Text textStyle="subtitle1" color="purple">
                                  {(newFormat(depositFees[item.address]) * 100).toFixed(3)}%
                                </Text>
                              </Flex>
                              <Flex justifyContent={"space-between"}>
                                <Text textStyle="body1">APY :</Text>
                                <Text textStyle="subtitle1" color="purple">
                                  {(APYs[item.token] === undefined || APYs[item.token] === null) &&
                                  item.apr !== undefined
                                    ? item.apr.toFixed(2) + "%"
                                    : APYs[item.token] !== 0
                                    ? // #TODO! changed from (APYs[item.token] * 100).toFixed(2)
                                      (APYs[item.token] * 100).toFixed(2).isNaN
                                      ? (APYs[item.token] * 100).toFixed(2) + "%"
                                      : 0 + "%"
                                    : "N/A"}
                                </Text>
                              </Flex>
                            </Flex>
                            <Flex ml={20} align={"center"}>
                              {/* <Text textStyle="subtitle1" color="purple">
                          {JSON.stringify(item.token)}
                          {JSON.stringify(mode)}
                          {JSON.stringify(checker(values))}
                        </Text> */}

                              <AdjustInput
                                height="45px"
                                name={item.token}
                                iconStatus={mode}
                                setIconStatus={setMode}
                                token={item.token}
                                id={item.token}
                                max={getMax(item)}
                                min={0}
                                inputWidth={12}
                                size="sm"
                                showIcons
                                values={checker(values)}
                                borrowMode={borrowMode}
                                isDeprecated={
                                  item.isDeprecated != undefined ? item.isDeprecated : false
                                }
                              />
                            </Flex>
                          </Flex>

                          <Flex justifyContent={"space-between"} ml={8} mt={5}>
                            <Flex>
                              <Text textStyle="body1" mr={3}>
                                Current Balance :{" "}
                              </Text>
                              <Text textStyle="subtitle1" color="purple">
                                {getNum(item.walletBalance)}
                              </Text>
                            </Flex>
                            <Flex>
                              <Text textStyle="body1" mr={3}>
                                Dollar Value After Transaction :{" "}
                              </Text>
                              <Text textStyle="subtitle1" color="purple">
                                $
                                {getNum(
                                  currentCollateral
                                    .map(item => {
                                      console.log(
                                        "@receipt: receiptPerUnderlyingRatios",
                                        +receiptPerUnderlyingRatios[item.address]
                                      );
                                      return (
                                        getTroveVaultValueWithLever(
                                          mode[item.token],
                                          item,
                                          values,
                                          borrowMode,
                                          receiptPerUnderlyingRatios[item.address]
                                        ) * format(prices[item.address])
                                      );
                                    })
                                    .reduce((a, b) => a + b, 0)
                                )}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                    <Flex justifyContent={"flex-end"}>
                      <Flex border="1px solid" borderColor="whiteAlpha.400" borderRadius={5} mr={5}>
                        <Text textStyle="subtitle2" textAlign="right" p={5}>
                          Trove Collateral Dollar Value: $
                          {getNum(
                            currentCollateral
                              .map(item => {
                                console.log(
                                  "@receipt: receiptPerUnderlyingRatios",
                                  +receiptPerUnderlyingRatios[item.address]
                                );
                                return (
                                  getTroveVaultValueWithLever(
                                    mode[item.token],
                                    item,
                                    values,
                                    borrowMode,
                                    receiptPerUnderlyingRatios[item.address]
                                  ) * format(prices[item.address])
                                );
                              })
                              .reduce((a, b) => a + b, 0)
                          )}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ) : (
                  // <TokenTable
                  //   headers={
                  //     borrowMode !== "normal"
                  //       ? [
                  //           "Token",
                  //           "Safety Ratio",
                  //           "Deposit Fee",
                  //           "APY",
                  //           "Actions",
                  //           "Adjusted Trove Amount",
                  //           "Lever Up"
                  //         ]
                  //       : ["Token", "Safety Ratio", "Deposit Fee", "APY", "Actions", "Adjusted Trove Amount"]
                  //   }
                  //   tooltips={
                  //     borrowMode !== "normal"
                  //       ? [
                  //           "Name",
                  //           "Weighting for risk adjusted value",
                  //           "Deposit fees on deposited collaterals value are added to your STAR debt amount.",
                  //           "Estimated Annual Percentage Yield, including auto-compounding fees. Currently updated daily for AAVE tokens. (live update coming in the next 2 days)",
                  //           "Deposit to add collateral to your trove. Withdraw to remove.",
                  //           "Final amount of the collateral after adjustments",
                  //           "Lever Up"
                  //         ]
                  //       : [
                  //           "Name",
                  //           "Weighting for risk adjusted value",
                  //           "Deposit fees on deposited collaterals value are added to your STAR debt amount.",
                  //           "Estimated Annual Percentage Yield, including auto-compounding fees. Currently updated daily for AAVE tokens. (live update coming in the next 2 days)",
                  //           "Deposit to add collateral to your trove. Withdraw to remove.",
                  //           "Final amount of the collateral after adjustments"
                  //         ]
                  //   }
                  //   width={borrowMode !== "normal" ? 7 : 6}
                  //   borrow
                  // >
                  //   <>

                  //       .map(item => (
                  //         <Tr key={item.token}>
                  //           <Td pt={8} pb={2}>
                  //             <Flex align="center" w={28}>

                  //             </Flex>
                  //           </Td>
                  //           <Td pt={8} pb={2} pl={2}>
                  //             {format(safetyRatios[item.address]).toFixed(3)}{" "}
                  //             <Tooltip>
                  //               {"Effective Minimum Collateral Ratio: " +
                  //                 ((1.1 / format(safetyRatios[item.address])) * 100).toFixed(2) +
                  //                 "%"}
                  //             </Tooltip>
                  //           </Td>
                  //           {/* This part is returning 0 for deposit fee #staticvalue */}
                  //           <Td pt={8} pb={2} pl={2}>
                  //             <Text whiteSpace="nowrap">
                  //               {(newFormat(depositFees[item.address]) * 100).toFixed(3)}%{" "}
                  //               {item.feeTooltip !== "" && <Tooltip>{item.feeTooltip}</Tooltip>}
                  //             </Text>
                  //           </Td>
                  //           {/* APYs[item.token] is not returning anything #staticvalue  */}
                  //           <Td pt={8} pb={2} pl={2}>
                  //             <Text whiteSpace="nowrap">
                  //               {(APYs[item.token] === undefined || APYs[item.token] === null) &&
                  //               item.apr !== undefined
                  //                 ? item.apr.toFixed(2) + "%"
                  //                 : APYs[item.token] !== 0
                  //                 ? // #TODO! changed from (APYs[item.token] * 100).toFixed(2)
                  //                   (APYs[item.token] * 100).toFixed(2).isNaN
                  //                   ? (APYs[item.token] * 100).toFixed(2) + "%"
                  //                   : 0 + "%"
                  //                 : "N/A"}
                  //             </Text>
                  //           </Td>
                  //           <Td pt={2} pb={2} pl={2}>
                  //             <Flex direction="column">
                  //               <Text textStyle="body2" fontWeight="bold" mb={1} color="purple">
                  //                 Balance: {getNum(item.walletBalance)}
                  //               </Text>
                  //               <AdjustInput
                  //                 name={item.token}
                  //                 iconStatus={mode}
                  //                 setIconStatus={setMode}
                  //                 token={item.token}
                  //                 id="testId"
                  //                 max={getMax(item)}
                  //                 min={0}
                  //                 inputWidth={12}
                  //                 size="sm"
                  //                 showIcons
                  //                 values={checker(values)}
                  //                 borrowMode={borrowMode}
                  //                 isDeprecated={item.isDeprecated != undefined ? item.isDeprecated : false}
                  //               />
                  //             </Flex>
                  //           </Td>
                  //           <Td pt={8} pb={2} pl={2} color="purple">
                  //             {getNum(
                  //               getTroveUnderlyingValueWithLever(
                  //                 mode[item.token],
                  //                 item,
                  //                 values,
                  //                 borrowMode,
                  //                 underlyingPerReceiptRatios[item.address]
                  //               )
                  //             )}
                  //           </Td>
                  //           {borrowMode !== "normal" ? showLeverModal(item) : <></>}
                  //         </Tr>
                  //       ))}
                  //   </>
                  //   <Tr key="total-usd" color="purple">
                  //     <Td pt={4} pb={0} />
                  //     <Td pt={4} pb={0} />
                  //     <Td pt={4} pb={0} />
                  //     <Td pt={4} pb={0} />
                  //     <Td pt={4} pb={0}>
                  //       <Text textStyle="subtitle2" textAlign="right">
                  //         Trove Collateral Dollar Value:
                  //       </Text>
                  //     </Td>
                  //     <Td pt={4} pb={0} pl={2} color="purple">
                  //       $

                  //     </Td>
                  //   </Tr>
                  // </TokenTable>
                  <Text textStyle="body1" px={6} my={4} ml={"20px"}>
                    Add some collateral to start creating your trove!
                  </Text>
                )}
              </>
            ) : (
              <>
                <Flex>
                  <Text textStyle={"title3"} ml={10}>
                    Please Add A Collateral Token in Order To Borrow
                  </Text>
                </Flex>
              </>
            )}
          </>
        </Collapse>
      </Box>
    </>
  );
};

export default AdjustCollateral;
