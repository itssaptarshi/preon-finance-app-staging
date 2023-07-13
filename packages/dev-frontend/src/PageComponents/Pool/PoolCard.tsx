// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Toggle, AdjustInput, CoinAmount, Icon } from "../../components";
import ConfirmDepositModal from "./ConfirmDepositModal";
import { LiquityStoreState, Decimal } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { useLiquity } from "../../hooks/LiquityContext";
import { validateDeposit } from "../../Utils/validation";
import {
  adjustValue,
  newWeeklyAPR,
  format,
  addString,
  subtractString,
  getNum
} from "../../Utils/number";
import { capitalizeFirstLetter } from "../../Utils/string";
import { Form } from "react-final-form";
import Tooltip from "../../components/Tooltip";
import PoolRewardsModal from "../../PageComponents/Pool/PoolRewardsModal";

export type PoolCardProps = {
  disconnected?: boolean;
};

const selector = ({
  stabilityDeposit,
  starBalance,
  starInStabilityPool,
  remainingStabilityPoolPREONReward,
  PREONPrice,
  poolRewardRate,
  STARPrice
}: LiquityStoreState) => ({
  stabilityDeposit,
  starBalance,
  starInStabilityPool,
  remainingStabilityPoolPREONReward,
  PREONPrice,
  poolRewardRate,
  STARPrice
});
var dataSelector = useLiquitySelector;

const calculateAPR = (
  starInStabilityPool: Decimal,
  remainingStabilityPoolPREONReward: Decimal,
  PREONPrice: Decimal
): number => {
  const yearlyHalvingSchedule = 0.5;
  const remainingPreonOneYear = remainingStabilityPoolPREONReward.mul(yearlyHalvingSchedule);
  // remainingPreonOneYear * underlyingPrices of Preon
  const remainingPreonOneYearInUSD = remainingPreonOneYear.mul(PREONPrice).div(Decimal.ONE);
  const aprPercentage = remainingPreonOneYearInUSD.div(starInStabilityPool).mul(100);

  return parseFloat(aprPercentage.toString());
};

const PoolCard: React.FC<PoolCardProps> = ({ disconnected = false }) => {
  let preonAPR: number,
    userBalance: any,
    poolDeposit: number,
    preonPrice: number,
    totalSTARDeposits: number,
    rewardRate: number;
  const { liquity } = useLiquity();
  const { stabilityDeposit, STARPrice, starInStabilityPool, poolRewardRate } = dataSelector(
    selector
  );
  const [userSTARBalance, setUserSTARBalance] = useState<Number>(0);
  const { starBalance } = dataSelector(selector);
  if (disconnected) {
    userBalance = 1000;
    poolDeposit = 0;
    preonAPR = 0;
    totalSTARDeposits = 0;
  } else {
    const { starInStabilityPool, remainingStabilityPoolPREONReward, PREONPrice } = dataSelector(
      selector
    );
    userBalance = userSTARBalance;
    poolDeposit = format(stabilityDeposit.currentSTAR);
    preonPrice = format(PREONPrice);
    totalSTARDeposits = format(starInStabilityPool);
    preonAPR = calculateAPR(starInStabilityPool, remainingStabilityPoolPREONReward, PREONPrice);
    rewardRate = format(poolRewardRate);
  }
  const rewards = stabilityDeposit.collateralGain;
  const poolShare: number = format(stabilityDeposit.currentSTAR.mulDiv(100, starInStabilityPool));

  const [value, setValue] = useState<any>({});
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const toast = useToast();

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");

  const validate = (valueChange: number) => {
    validateDeposit(toast, mode, userBalance, poolDeposit, valueChange, onConfirmOpen);
  };

  const notNegative = (mode: "deposit" | "withdraw", initialValue: number, valueChange: string) => {
    if (mode === "deposit") {
      return addString(initialValue, valueChange);
    }
    const ans = subtractString(initialValue, valueChange);
    if (ans > 0) {
      return ans;
    }
    return 0;
  };
  const getFormattedValue = (value: string) => {
    if (/^[0-9.]*$/.test(value)) {
      return value;
    }
    return "";
  };

  // console.log(value);
  const [reward, setReward] = useState<Decimal>(Decimal.from(0));
  const [weeklyReward, setWeeklyReward] = useState<Decimal>(Decimal.from(0));
  const [weeklyRewardWithdraw, setWeeklyRewardWithdraw] = useState<Decimal>(Decimal.from(0));
  useEffect(() => {
    liquity.getEstimatedPREONPoolRewards(totalSTARDeposits, 604800).then(num => setReward(num));
    if (starBalance) {
      setUserSTARBalance(format(starBalance));
    }
  }, [value.input, starBalance]);

  // #TODO! added logic to convert NaN to Zero
  let result = (((+String(reward) * 52 * preonPrice) / totalSTARDeposits) * 100).toFixed(3);
  let preonReward;
  if (isNaN(result)) {
    preonReward = 0;
  } else {
    preonReward = result;
  }
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);
  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  // useEffect(() => {
  //   if (!isNaN(value.input)) {
  //     liquity
  //     .getEstimatedPREONPoolRewards(value.input + poolDeposit, 604800)
  //     .then(num => setWeeklyReward(num));
  //   } else if (!isNaN(value.input) && +value.input <= poolDeposit && mode == "withdraw") {
  //     liquity
  //       .getEstimatedFarmRewards(poolDeposit - +value.stakeInput, 604800)
  //       .then(num => setWeeklyRewardWithdraw(num));
  //   }
  //   if (starBalance) {
  //     setUserSTARBalance(format(starBalance));
  //   }
  // }, [value.input, starBalance, mode]);
  return (
    <>
      <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={rewards}
        notStability={false}
      />
      <Box layerStyle="card" flex={1} w="md">
        <Flex justifyContent={"space-between"}>
          <Text textStyle="title3" mb={2} color="#C157F9">
            Stability Pool {}
          </Text>
          <Flex mr={"1em"}>
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

        <Text fontSize={"16px"} mt={5} color="white">
          Stake STAR in Stability Pool, earn PREON. In case of liquidation, use a portion of STAR
        </Text>
        {/* <Text textStyle="body1" fontWeight="bold" mb={2} color="purple">
          ${getNum(totalSTARDeposits * format(STARPrice), 2)} Deposited in Stability Pool
        </Text> */}
        <Divider mt={4} mb={5} height="0.5px" opacity="0.4" />
        <Toggle
          options={[
            { value: "Deposit", key: "deposit" },
            { value: "Withdraw", key: "withdraw" }
          ]}
          size="md"
          onChange={v => setMode(v as "deposit" | "withdraw")}
        />
        <Collapse in={show}>
          <Form
            onSubmit={() => {}}
            render={({ values }) => (
              <>
                {setValue(values)}
                {!disconnected && (
                  <ConfirmDepositModal
                    isOpen={isConfirmOpen}
                    onClose={onConfirmClose}
                    mode={mode}
                    amount={values.input || 0}
                    total={adjustValue(mode, poolDeposit, values.input)}
                    values={values}
                    name="input"
                  />
                )}
                <AdjustInput
                  mt={4}
                  max={mode === "deposit" ? userBalance : poolDeposit}
                  name="input"
                  token="STAR"
                  showToken
                  fillContainer
                />
                {mode === "deposit" ? (
                  <Text textStyle="body1" fontWeight="bold" mt={1.5} color="purple">
                    Wallet Balance: {getNum(userBalance)} STAR
                  </Text>
                ) : (
                  <Text textStyle="body1" fontWeight="bold" mt={1.5} color="purple">
                    Pool Balance: {getNum(poolDeposit)} STAR
                  </Text>
                )}

                {!disconnected && (
                  <Flex mt={4} justify="Center">
                    <Button variant="gradient" onClick={() => validate(values.input)}>
                      {mode == "deposit" ? "Deposit" : "Withdraw"}
                    </Button>
                  </Flex>
                )}

                <>
                  <Divider mt={6} mb={5} height="0.5px" opacity="0.4" />
                  <Box>
                    <Flex mt={4}>
                      <Text textStyle="subtitle1" fontWeight="normal" color="white">
                        New Total Deposit
                      </Text>
                      <Spacer />
                      <CoinAmount
                        token="STAR"
                        amount={adjustValue(mode, poolDeposit, values.input)}
                        textStyle="subtitle1"
                        color="purple"
                      />
                    </Flex>
                    <Flex direction="row" mt={5} mb={5}>
                      <Text textStyle="subtitle1" fontWeight="normal">
                        Pool Share
                      </Text>
                      <Spacer />
                      <Text textStyle="subtitle1" mr={1} color="purple">
                        {poolShare.toFixed(2)}%
                      </Text>
                    </Flex>
                    <Divider mt={5} mb={5} height="0.5px" opacity="0.4" />
                    <Flex justify="center">
                      <Button mt={10} variant="gradient" onClick={onPoolRewardsOpen}>
                        View Rewards
                      </Button>
                    </Flex>
                    {/* <Flex mt={4}>
                <Text textStyle="subtitle1" fontWeight="normal" color="white">
                  New Estimated Weekly Rewards
                </Text>
                <Spacer />
                <CoinAmount
                  token="PREON"
                  amount={
                    !+values.input || +value.input > poolDeposit
                      ? 0
                      : mode == "withdraw"
                      ? (rewardRate * 604800 * (poolDeposit - +value.input)) /
                        (totalSTARDeposits - +value.input)
                      : (rewardRate * 604800 * (poolDeposit + +value.input)) /
                        (totalSTARDeposits + +value.input)
                  }
                  textStyle="subtitle1"
                  color="purple"
                />
              </Flex> */}
                  </Box>
                </>

                {/* <Divider color="purple" mt={4} /> */}

                {/* Preon Reward APR */}
                {/* uncomment whole */}
                {/* <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                PREON Reward APR
              </Text>
              <Spacer />
              <Tag bgColor="purple">
                <Text textStyle="subtitle1" mr={[5, 0]}>
                  {preonReward}%
                </Text>
              </Tag>
            </Flex> */}

                {/* Deposit or Withdraw Button */}
                {/* {!disconnected && (
              <Flex mt={4} justify="flex-end">
                <Button variant="gradient" onClick={() => validate(values.input)}>
                  {mode == "deposit" ? "Deposit" : "Withdraw"}
                </Button>
              </Flex>
            )} */}
              </>
            )}
          />
        </Collapse>
      </Box>
    </>
  );
};

export default PoolCard;
