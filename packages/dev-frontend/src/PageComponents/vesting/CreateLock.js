import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Input,
  Spacer,
  Text
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Tooltip from "../../components/Tooltip";
import { AdjustInput, Toggle, Icon } from "../../components";
import { Form } from "react-final-form";
import BigNumber from "bignumber.js";
import { format } from "../../Utils/number";
import moment from "moment";
import { useTransactionFunction } from "../../components/Transaction";
import { Decimal } from "@liquity/lib-base";
// import useVesting from "./store/useVesting";
import { useLiquity } from "../../hooks/LiquityContext";
import { contractAddresses } from "../../config/constants";

export default function CreateLock({ balances, isloading, nfts }) {
  const vePREON_ADDRESS = contractAddresses.vePREON.address;
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);
  const [isLocked, setIsLocked] = useState(false);
  const { liquity, account } = useLiquity();

  const [selectedDate, setSelectedDate] = useState(moment().add(112, "days").format("YYYY-MM-DD"));

  const [amountError, setAmountError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [calcVePreon, setCalcVePreon] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [sec, setSec] = useState(0);

  const onAmountChanged = event => {
    if (Number.isNaN(event.target.value)) {
      return;
    }
    setAmount(() => event.target.value);
  };

  const onDateChange = event => {
    console.log(event.target.value);
    setSelectedDate(event.target.value);
  };

  const isLock = () => {
    console.log("123456789", nfts);
    if (nfts.length > 0) {
      setIsLocked(true);
    }
  };

  // const checkAllowance = async (token, amount) => {
  //   const result = await liquity.getAllowanceOf(account, token, BOOSTED_FARM_ADDRESS, amount);

  //   return result;
  // };

  useEffect(() => {
    isLock();
    if (!amount) {
      setCalcVePreon(() => 0);

      return;
    }
    const now = moment();
    const expiry = moment(selectedDate);
    const dayToExpire = expiry.diff(now, "days");

    const _calc = BigNumber(amount)
      .times(parseInt(dayToExpire) + 1)
      .div(112)
      .toFixed(3);

    setCalcVePreon(() => _calc);
  }, [selectedDate, amount, nfts]);

  const createLockHandler = () => {
    const now = moment();
    const expiry = moment(selectedDate).add(1, "days");
    const secondsToExpire = expiry.diff(now, "seconds");

    let _amount = BigNumber(amount)
      .times(10 ** 18)
      .toFixed(0);
    console.log("creating lock for", +_amount, secondsToExpire);

    setTokenAmount(() => _amount);
    setSec(() => secondsToExpire);
    setIsLocked(true);
  };

  const [CreateLock] = useTransactionFunction(
    "create-lock",
    liquity.send.createLock.bind(liquity.send, tokenAmount, sec)
  );

  const [approveTransaction] = useTransactionFunction(
    "approve",
    liquity.send.approveToken.bind(
      liquity.send,
      contractAddresses.lpToken.address,
      vePREON_ADDRESS,
      Decimal.from("10000000000000000000")
    )
  );

  const onApprove = () => {
    // console.log("appprove", onApprove);
    approveTransaction();
  };

  useEffect(() => {
    // need better checks
    if (tokenAmount > 0 && sec > 0) {
      CreateLock();
    }
  }, [tokenAmount]);

  // useEffect(() => {
  //   // let tot:Decimal = Decimal.ZERO
  //   // if (!(getFormattedValue(amount) == 0)) {
  //   //   tot = Decimal.from(amount)
  //   // }
  //   const open = isOpen;
  //   let interval = undefined;
  //   if (open) {
  //     interval = setInterval(async () => {
  //       const allowance = await checkAllowance(
  //         contractAddresses.lpToken.address,
  //         Decimal.from(getFormattedValue(amount))
  //       );
  //       if (allowance) {
  //         setStep(2);
  //       } else {
  //         setStep(1);
  //       }
  //     }, 1500);
  //   }

  //   return () => clearInterval(interval);
  // }, [amount, isOpen]);

  return (
    <>
      <Box layerStyle="card" flex={1} margin="2">
        <Flex justifyContent={"space-between"}>
          <Text textStyle="title2" mt={-3} mb={1} color="purple">
            Create New Lock{" "}
            <Tooltip>
              New STAR/MATIC LP Farm will provide boosted yields based on vePREON balances.
            </Tooltip>
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
        <Flex></Flex>

        <Form
          onSubmit={() => {}}
          render={({ values }) => (
            <>
              {setAmount(+values["govtoken"])}
              <AdjustInput
                mt={4}
                max={format(balances.govToken / 1e18)}
                name="govtoken"
                // onChange={onAmountChanged}
                token="LP"
                fillContainer
                noCurrencyConvert={true}
                borderRadius={50}
              />
              <Input
                // inputRef={inputEl}
                ml={1}
                w={"98%"}
                id="someDate"
                type="date"
                placeholder="Expiry Date"
                fullWidth={false}
                mt={"0.5em"}
                borderRadius={0}
                color={"white"}
                style={{
                  outlineColor: "#C157F9",
                  border: "0px"
                }}
                error={amountError}
                helperText={amountError}
                onChange={onDateChange}
                disabled={isloading}
                value={selectedDate}
                max={moment().add(112, "days").format("YYYY-MM-DD")}
                min={moment().add(7, "days").format("YYYY-MM-DD")}
              />

              <Flex>
                <Text textStyle="body1" fontWeight="bold" mb={2} color="white" mt={2}>
                  Note: You can lock for any time period between 1 to 16 weeks.
                </Text>
              </Flex>
              <Collapse in={show}>
                <Box>
                  <Flex align={"center"}>
                    {/* <Text textStyle="body1" paddingTop="5" marginRight="2" mb={5}>
                      Expires:
                    </Text> */}
                    <Toggle
                      style={{
                        width: "100%"
                      }}
                      options={[
                        { value: "16W", key: "112" },
                        { value: "12W", key: "84" },
                        { value: "8W", key: "56" },
                        { value: "4W", key: "28" },
                        { value: "1W", key: "7" }
                      ]}
                      size="md"
                      onChange={value => {
                        setSelectedDate(moment().add(value, "days").format("YYYY-MM-DD"));
                      }}
                    />
                  </Flex>
                  <Flex p={"10px"}>
                    {/* <Text textStyle="body1">Your Voting Power Will Be:</Text> */}
                  </Flex>
                  <Flex mt={4}>
                    <Text textStyle="subtitle1">Boosted:</Text>
                    <Spacer />
                    <Text textStyle="subtitle1" color={"purple"}>
                      {Number.isNaN(calcVePreon) ? "0.00" : calcVePreon} vePREON
                    </Text>

                    {/* <Text textStyle="body1">
                      {+values["govtoken"] > 0 ? BigNumber(values["govtoken"]).toFixed(3) : "0.00"}{" "}
                      locked expires {moment(selectedDate).from(moment())}
                    </Text> */}
                  </Flex>
                  <Flex mt={4}>
                    <Text textStyle="subtitle1">locked Expires:</Text>
                    <Spacer />
                    <Text textStyle="subtitle1" color={"purple"}>
                      {" "}
                      {+values["govtoken"] > 0
                        ? BigNumber(values["govtoken"]).toFixed(3)
                        : "0.00"}{" "}
                      {moment(selectedDate).from(moment())}
                    </Text>
                  </Flex>
                  <Flex mt={4}>
                    {/* <Text textStyle="title3">Boosted</Text> */}

                    <Text textStyle="subtitle1">Locked Until:</Text>
                    <Spacer />
                    <Text textStyle="subtitle1" color={"purple"}>
                      {moment(selectedDate).format("DD MMM YYYY")}
                    </Text>
                  </Flex>

                  <>
                    <Divider mt={3} mb={1} height="0.5px" opacity="0.4" />

                    {isLocked ? (
                      <Flex flexDirection={"column"}>
                        <Flex p={"10px"}>
                          <Text textStyle="body1" color="white">
                            Locked for 16 weeks = 1.00 vePREON
                          </Text>
                        </Flex>
                        <Flex p={"10px"}>
                          <Text textStyle="body1" color="white">
                            Locked for 12 weeks = 0.75 vePREON
                          </Text>
                        </Flex>
                        <Flex p={"10px"}>
                          <Text textStyle="body1" color="white">
                            Locked for 8 weeks = 0.50 vePREON
                          </Text>
                        </Flex>
                        <Flex p={"10px"}>
                          <Text textStyle="body1" color="white">
                            Locked for 4 weeks = 0.25 vePREON
                          </Text>
                        </Flex>
                        <Flex p={"10px"}>
                          <Text textStyle="body1" color="white">
                            Lock for more than 8 weeks to get additional PREON tokens in vePREON
                            Boost
                          </Text>
                        </Flex>{" "}
                      </Flex>
                    ) : (
                      <>
                        <Flex p={"10px"}>
                          <Text textStyle="body1">Please Create A Lock To Earn vePREON</Text>
                        </Flex>
                      </>
                    )}
                  </>
                </Box>
              </Collapse>
              <Flex justifyContent={"center"} pb={1}>
                <Button onClick={createLockHandler} variant="gradient">
                  Lock
                </Button>
              </Flex>
            </>
          )}
        />
      </Box>
    </>
  );
}
