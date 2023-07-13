// @ts-nocheck
import {
  Box,
  Flex,
  Button,
  Spacer,
  Text,
  Divider,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  UseToastOptions
} from "@chakra-ui/react";
import { Form } from "react-final-form";
import { AdjustInput, CoinAmount, Icon, TokenTable, Slippages } from "../../components";
import tokenData from "../../TokenData";
import { useState } from "react";
import { getNum } from "../utils";
import ConfirmCloseTroveAutosellModal from "./ConfirmCloseTroveAutosellModal";
import { LiquityStoreState, Decimal } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { limitDecimals, format, formatWithDecimals } from "../../Utils/number";
import { CoinMode, CoinShow } from "../../Types";
import { TokenData } from "../../Types/index";
import { useEffect } from "react";

type CloseTroveAutosellProps = {
  setBorrowMode: any;
};

// TODO fix type def
const selector = ({
  trove,
  underlyingPrices,
  starBalance,
  tokenBalances,
  decimals,
  STARPrice
}: any | LiquityStoreState) => ({
  trove,
  underlyingPrices,
  starBalance,
  tokenBalances,
  decimals,
  STARPrice
});

var BreakException = {};

const CloseTroveAutosell: React.FC<CloseTroveAutosellProps> = ({ setBorrowMode }) => {
  const [value, setValue] = useState<any>({});
  const collateral = tokenData;
  console.log("collateral", collateral);
  const {
    trove,
    underlyingPrices,
    starBalance,
    STARPrice,
    tokenBalances,
    decimals
  } = useLiquitySelector(selector);
  const totalDebt = +(+trove.debt["debt"].toString()).toFixed(4);
  console.log("totaldebt", totalDebt);
  const starAvailable = +(+starBalance.toString()).toFixed(4);
  console.log("staravailable", starAvailable);

  // Coin Display Config State

  const coins: CoinMode = {};
  //collateral.forEach(coin => {borrowMode !== "unlever" ? coins[coin.token] = "deposit" : coins[coin.token] = "withdraw"});
  collateral.forEach(coin => (coins[coin.token] = "deposit"));
  const coinShow: CoinShow = {};
  collateral.forEach(coin => {
    if (coin.troveBalance === 0) {
      coinShow[coin.token] = false;
    } else {
      coinShow[coin.token] = true;
    }
  });
  const [mode, setMode] = useState<CoinMode>(coins);
  const [show, setShow] = useState<CoinShow>(coinShow);
  const currentCollateral: TokenData[] = collateral.filter(coin => show[coin.token]);
  console.log("currentcollateral", currentCollateral);
  const toast = useToast();
  const toastProps: UseToastOptions = {
    status: "error",
    duration: 4000,
    isClosable: true,
    position: "top-right"
  };

  const onSubmit = (): void => {
    if (starReceived == 0) {
      toast({
        title: "Error",
        description: "STAR received from auto-sell must be greater than 0.",
        ...toastProps
      });
      throw BreakException;
    } else if (format(starAvailable + starReceived + 200 - totalDebt) < 0) {
      toast({
        title: "Error",
        description: `You need ${
          -1 * +(starAvailable + starReceived + 200 - totalDebt).toFixed(4)
        } more STAR to close your trove.`,
        ...toastProps
      });
      throw BreakException;
    } else {
      onCloseTroveAutosellOpen();
    }
  };

  const getFormattedValue = (value: string) => {
    if (/^[0-9.]*$/.test(value)) {
      return value;
    }
    return "";
  };
  const [starReceived, setStarReceived] = useState<number>(0);

  useEffect(() => {
    setStarReceived(
      format(
        currentCollateral
          .map(item =>
            format((format(underlyingPrices[item.address]) * value[item.token]) / format(STARPrice))
          )
          .reduce((a, b) => a + b, 0)
      )
    );
  }, [value]);

  const {
    isOpen: isCloseTroveAutosellOpen,
    onOpen: onCloseTroveAutosellOpen,
    onClose: onCloseTroveAutosellClose
  } = useDisclosure();

  return (
    <Box layerStyle="card" flex={1} px={2}>
      <Form
        onSubmit={() => {}}
        format={getFormattedValue}
        render={({ values, form }) => (
          <>
            {setValue(values)}
            //{console.log("values", values)}
            <Flex justify="space-between" align="center" mb={2} px={6}>
              <Text color="white" textStyle="title2">
                Close Trove Auto-Sell
              </Text>
            </Flex>
            {/* <ConfirmChangesModal
                  isOpen={isConfirmChangesOpen}
                  onClose={onConfirmChangesClose}
                  values={values}
                  collateral={getAffectedCollateral(values)}
                  borrowMode={borrowMode}
                  ratios={ratios}
                /> */}
            <TokenTable
              headers={[
                "Token",
                "Trove Balance",
                "Amount to Sell",
                "Collateral Received Post Auto-Sell",
                "Estimated STAR from Selling",
                "Swap Tolerance"
              ]}
              tooltips={[
                "The token you want to sell.",
                "The amount of a token you have.",
                "The amount of a token you want to sell.",
                "The amount of collateral you will receive after auto-selling and closing trove.",
                "The estimated amount of STAR you will receive from selling.",
                "The maximum amount of collateral you will lose."
              ]}
              width={6}
              // borrow
            >
              <>
                {currentCollateral
                  .filter(token => {
                    if (token.troveBalance === 0) {
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .map(item => (
                    <Tr key={item.token}>
                      <Td pt={8} pb={2}>
                        <Flex align="center" w={28}>
                          <Icon iconName={item.token} h={5} w={5} />
                          <Text ml={3} whiteSpace="pre-wrap">
                            {item.token}{" "}
                            {item.tokenTooltip !== "" && <Tooltip>{item.tokenTooltip}</Tooltip>}
                          </Text>
                        </Flex>
                      </Td>
                      <Td pt={8} pb={2}>
                        <Tooltip>{getNum(item.troveBalance)}</Tooltip>
                      </Td>
                      <Td pt={8} pb={2} pl={2}>
                        <AdjustInput
                          name={item.token}
                          token={item.token}
                          max={item.troveBalance}
                          min={0}
                          inputWidth={12}
                          size="sm"
                        />
                      </Td>
                      <Td pt={8} pb={2} pl={2}>
                        <Text whiteSpace="nowrap" ml={4}>
                          {values[item.token] == undefined
                            ? getNum(0)
                            : getNum(item.troveBalance - values[item.token])}
                        </Text>
                      </Td>
                      <Td pt={8} pb={2} pl={2}>
                        <Text whiteSpace="nowrap" ml={4}>
                          {values[item.token] == undefined
                            ? getNum(0)
                            : (
                                (format(underlyingPrices[item.address]) * values[item.token]) /
                                format(STARPrice)
                              ).toFixed(4)}
                        </Text>
                      </Td>
                      <Td pt={8} pb={2} pl={2}>
                        <Slippages values={values} collateral={item} />
                      </Td>
                    </Tr>
                  ))}
              </>
            </TokenTable>
            <Box my={5} px={6}>
              <Divider />
            </Box>
            <Box>
              <Flex>
                <Text textStyle="subtitle1" fontWeight="normal" color="white" ml={6}>
                  Current STAR Balance:
                </Text>
                <CoinAmount
                  token="STAR"
                  amount={starAvailable}
                  textStyle="subtitle1"
                  color="white"
                  noCurrencyConvert={true}
                  ml={6}
                />
              </Flex>
              <Flex direction="row">
                <Text textStyle="subtitle1" fontWeight="normal" color="white" ml={6}>
                  STAR Received From Auto-Sell:
                </Text>
                <CoinAmount
                  token="STAR"
                  amount={starReceived}
                  textStyle="subtitle1"
                  color="white"
                  noCurrencyConvert={true}
                  ml={6}
                />
              </Flex>
              <Flex>
                <Text textStyle="subtitle1" fontWeight="normal" color="white" ml={6}>
                  Debt to Repay:
                </Text>
                <CoinAmount
                  token="STAR"
                  amount={totalDebt - 200}
                  textStyle="subtitle1"
                  color="white"
                  noCurrencyConvert={true}
                  ml={6}
                />
              </Flex>
              <Box my={5} px={6}>
                <Divider w="20vw" />
              </Box>
              <Flex>
                {format(starAvailable + starReceived + 200 - totalDebt) < 0 ? (
                  <>
                    <Text textStyle="subtitle1" fontWeight="normal" color="white" ml={6}>
                      Additional STAR Required to Close Trove:
                    </Text>
                    <Text textStyle="subtitle1" color="red.500" ml={6}>
                      {-1 * +(starAvailable + starReceived + 200 - totalDebt).toFixed(4)} STAR
                    </Text>
                  </>
                ) : (
                  <>
                    <Text textStyle="subtitle1" fontWeight="normal" color="white" ml={6}>
                      Estimated STAR After Close Trove:
                    </Text>
                    <Text textStyle="subtitle1" color="green.400" ml={6}>
                      {getNum(starAvailable + starReceived + 200 - totalDebt)} STAR
                    </Text>
                  </>
                )}
              </Flex>
            </Box>
            <Flex align="center" mt={4} mx={6}>
              <Spacer />
              <Button variant="secondary" mr={4} onClick={() => setBorrowMode("normal")}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={onSubmit}>
                Confirm
              </Button>
              <ConfirmCloseTroveAutosellModal
                isOpen={isCloseTroveAutosellOpen}
                onClose={onCloseTroveAutosellClose}
                values={values}
                starFinal={starAvailable + starReceived + 200 - totalDebt}
                debtRepay={totalDebt - 200}
                starReceived={starReceived}
                starAvailable={starAvailable}
              />
            </Flex>
          </>
        )}
      />
    </Box>
  );
};

export default CloseTroveAutosell;
