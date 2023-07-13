import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { Form } from "react-final-form";
import { AdjustInput } from "../../components";
import moment from "moment";
import BigNumber from "bignumber.js";
import { format } from "../../Utils/number";
import { useTransactionFunction } from "../../components/Transaction";
import { useLiquity } from "../../hooks/LiquityContext";

export default function Increase({ balances, isloading, selectedNft }) {
  const { liquity } = useLiquity();
  const [amountError, setAmountError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [incAmount, setIncAmount] = useState(0);
  const [tokenId, setTokenID] = useState(0);
  const [unlockTime, setUnlockTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

  const onAmountChanged = event => {
    if (Number.isNaN(event.target.value)) {
      return;
    }
    setAmount(() => event.target.value);
  };

  useEffect(() => {
    setSelectedDate(() => moment.unix(selectedNft?.lockEnds).add(112, "days").format("YYYY-MM-DD"));
  }, [selectedNft]);

  const onDateChange = event => {
    console.log(event.target.value);
    setSelectedDate(event.target.value);
  };

  const [increaseVestAmount] = useTransactionFunction(
    "increase-vest-amount",
    liquity.send.increaseVestAmount.bind(liquity.send, incAmount, tokenId)
  );

  const [increaseVestDuration] = useTransactionFunction(
    "increase-vest-duration",
    liquity.send.increaseVestDuration.bind(liquity.send, tokenId, unlockTime)
  );

  const increaseVestAmountHandler = () => {
    console.log("increase amount");
    let _amount = BigNumber(amount)
      .times(10 ** 18)
      .toFixed(0);
    console.log("@amount", +selectedNft?.id);
    // increaseVestAmount(_amount, +selectedNft?.id);
    setIncAmount(() => _amount);
    setTokenID(() => +selectedNft?.id);

    increaseVestAmount();
  };

  const increaseVestDurationHandler = () => {
    const now = moment();
    const expiry = moment(selectedDate).add(1, "days");
    const secondsToExpire = expiry.diff(now, "seconds");

    if (secondsToExpire <= 0) {
      console.error("@second to expire:", secondsToExpire);
      return;
    }

    setTokenID(() => +selectedNft?.id);
    setUnlockTime(() => secondsToExpire);

    console.log("increase Duration", secondsToExpire);
    // increaseVestDuration(+selectedNft?.id, secondsToExpire);

    increaseVestDuration();
  };

  return (
    <>
      <Box layerStyle="card" flex={1} margin="2">
        {!selectedNft && <Text textStyle="title3">Select "Manage" from Vesting Table</Text>}

        {selectedNft && (
          <div>
            <Flex>
              <Text textStyle="title3" color="purple">
                Manage Existing Lock for NFT #{+selectedNft?.id}
              </Text>
            </Flex>
            <Form
              onSubmit={() => {}}
              render={({ values }) => (
                <>
                  <AdjustInput
                    mt={4}
                    placeholder={+selectedNft?.lockAmount / 1e18}
                    disabled
                    fillContainer
                    name={"deposited amount"}
                    noCurrencyConvert={true}
                  />
                  <AdjustInput
                    mt={4}
                    max={format(balances.govToken / 1e18)}
                    name="tokenId"
                    onChange={onAmountChanged}
                    token="NFT"
                    fillContainer
                    noCurrencyConvert={true}
                  />
                  <Flex>
                    <Button
                      variant="gradient"
                      w="100%"
                      mt={3}
                      mb={5}
                      onClick={() => {
                        increaseVestAmountHandler();
                      }}
                    >
                      Increase Lock Amount
                    </Button>
                  </Flex>
                </>
              )}
            />

            <Form
              onSubmit={() => {}}
              render={({ values }) => (
                <>
                  <Input
                    // inputRef={inputEl}
                    id="someDate"
                    type="date"
                    placeholder="current Expiry Date"
                    fullWidth={false}
                    step={7}
                    color={"white"}
                    mt={"0.5em"}
                    style={{
                      outlineColor: "#C157F9",
                      border: "0px"
                    }}
                    onChange={onDateChange}
                    disabled={true}
                    value={moment.unix(selectedNft?.lockEnds).format("YYYY-MM-DD")}
                  />
                  {/* 

                  <AdjustInput
                    mt={4}
                    name="tokenId"
                    onChange={onDateChange}
                    token="NFT"
                    fillContainer
                    noCurrencyConvert={true}
                  /> */}
                  <Input
                    // inputRef={inputEl}
                    id="someDate"
                    type="date"
                    placeholder="Expiry Date"
                    fullWidth={false}
                    step={7}
                    color={"white"}
                    mt={"0.5em"}
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
                    min={moment.unix(selectedNft?.lockEnds).add(7, "days").format("YYYY-MM-DD")}
                  />
                  <Flex>
                    <Button
                      variant="gradient"
                      w="100%"
                      mt={3}
                      onClick={() => {
                        increaseVestDurationHandler();
                      }}
                    >
                      Increase Lock Duration
                    </Button>
                  </Flex>
                </>
              )}
            />
          </div>
        )}
      </Box>
    </>
  );
}
