// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Toggle, AdjustInput, CoinAmount } from "../../components";
import Tooltip from "../../components/Tooltip";
import ConfirmVEStakeModal from "./ConfirmVEStakeModal";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { capitalizeFirstLetter } from "../../Utils/string";
import { adjustValue, newWeeklyAPR, getNum, format, formatWithDecimals } from "../../Utils/number";
import { validateDeposit } from "../../Utils/validation";
import { Form } from "react-final-form";
import { useLiquity } from "../../hooks/LiquityContext";
import { getNewEstimatedWeeklyRewardsAmount } from "./veStakeCard.utils";

export type VEStakeCardProps = {
  disconnected?: boolean;
};

const selector = ({ preonBalance, vePREONStaked, PREONPrice }: LiquityStoreState) => ({
  preonBalance,
  vePREONStaked,
  PREONPrice
});

const calculateAPR = (totalStakedPREON: Decimal, totalSPREONSupply: Decimal): number => {
  return format(totalSPREONSupply) / format(totalStakedPREON);
};

var dataSelector = useLiquitySelector;

const VEStakeCard: React.FC<VEStakeCardProps> = ({ disconnected = false }) => {
  let preonStake, preonBalance, preonStaked: number, preonAPR: number;
  let userPreonBalance: any;
  let maxStake: string = "";
  let maxStakeLPBoost: string = "";
  let preonPrice: number;
  let totalProvided: Decimal = Decimal.ZERO;
  let totalPreon: Decimal = Decimal.ZERO;
  let rewardRate: number = 0;
  let accumulationRate: number = 0;
  let AmountStakedUnallocated: number,
    vePreonOnUnallocated: number,
    WeeklyvePreonGrowthUnallocated: number,
    AmountStakedLP: number,
    vePreonOnLp: number,
    WeeklyvePreonGrowthLP: number;
  const { liquity } = useLiquity();
  if (!disconnected) {
    const { preonBalance, vePREONStaked, PREONPrice } = dataSelector(selector);
    // console.log(vePREONStaked);
    // vePREONStaked.
    totalPreon = vePREONStaked.totalPreon;
    maxStake = String(vePREONStaked.preonStake);
    maxStakeLPBoost = String(vePREONStaked.preonStakeOnFarm);
    userPreonBalance = format(preonBalance);
    preonStaked = format(vePREONStaked.preonStake);
    console.log("preonStaked", preonStaked);
    preonPrice = format(PREONPrice);
    accumulationRate = format(vePREONStaked.accumulationRate);
    preonAPR = 1.125; // calculateAPR(totalStakedPREON, totalSPREONSupply);
    AmountStakedUnallocated = format(vePREONStaked.preonStake);
    vePreonOnUnallocated = formatWithDecimals(vePREONStaked.vePREONGain, 36);
    WeeklyvePreonGrowthUnallocated = AmountStakedUnallocated * 604800 * accumulationRate;
    AmountStakedLP = format(vePREONStaked.preonStakeOnFarm);
    vePreonOnLp = formatWithDecimals(vePREONStaked.vePreonOnFarm, 36);
    WeeklyvePreonGrowthLP = format(AmountStakedLP * 604800 * accumulationRate);
  } else {
    userPreonBalance = 1000;
    preonStaked = 0;
    preonAPR = 1.125;
  }

  console.log("preonprice", preonPrice);

  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const toast = useToast();

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");

  const validate = (valueChange: number) => {
    validateDeposit(
      toast,
      mode,
      userPreonBalance,
      fromUnallocated ? preonStaked : AmountStakedLP,
      valueChange,
      onConfirmOpen
    );
  };

  const [fromUnallocated, setFromUnallocated] = useState(false);

  const [reward, setReward] = useState<Decimal>(Decimal.from(0));
  useEffect(() => {
    liquity.getEstimatedVePreonRewards(format(totalPreon), 604800).then(num => setReward(num));
  }, [totalPreon]);

  // #TODO! added logic to fix NaN value
  let result = (((+String(reward) * 52 * 2) / format(totalPreon)) * 100).toFixed(3);
  let preonReward;
  if (isNaN(result)) {
    preonReward = 0;
  } else {
    preonReward = result;
  }

  return (
    <>
      <Box layerStyle="card" flex={1}>
        <Text textStyle="title3" mb={2}>
          Lock Underlying Token{" "}
          {
            <Tooltip>
              {/* vePREON can now be utilized to boost your Curve LP rewards, with more utilities coming
              soon, including getting access to highly anticipated new strategies, and getting
              reduced fees on Preon Finance. Start accruing to get a head start!{" "} */}
              Lock underlying token to receive vePREON
            </Tooltip>
          }
        </Text>
        <Text textStyle="body1" fontWeight="bold" mb={2} color="purple">
          {getNum(format(totalPreon), 2)} PREON Staked.
        </Text>

        {/* <Toggle
          options={[
            { value: "Stake", key: "deposit" },
            { value: "Unstake Unallocated", key: "withdrawUnallocated" },
            { value: "Unstake LP Boost", key: "withdrawLPBoost" }
          ]}
          size="md"
          onChange={v => {
            const m = v.includes("withdraw") ? "withdraw" : "deposit";
            if (v === "withdrawUnallocated") {
              setFromUnallocated(true);
            } else {
              setFromUnallocated(false);
            }

            setMode(m as "deposit" | "withdraw");
          }}
        /> */}
        <Form
          onSubmit={() => {}}
          render={({ values }) => (
            <>
              {!disconnected && (
                <ConfirmVEStakeModal
                  isOpen={isConfirmOpen}
                  onClose={onConfirmClose}
                  mode={mode}
                  amount={values.vestakeInput || "0"}
                  total={adjustValue(mode, preonStaked, values.vestakeInput)}
                  values={values}
                  name="vestakeInput"
                  fromUnallocated={fromUnallocated}
                />
              )}

              {/* {!disconnected && (
                <Warning
                  isOpen={isConfirmOpen}
                  onClose={onConfirmClose}
                  mode={mode}
                  amount={values.vestakeInput || "0"}
                  total={adjustValue(mode, preonStaked, values.vestakeInput)}
                />
              )} */}
              <AdjustInput
                mt={4}
                max={
                  mode === "deposit"
                    ? userPreonBalance
                    : fromUnallocated
                    ? maxStake
                    : maxStakeLPBoost
                }
                name="vestakeInput"
                token="PREON"
                showToken
                fillContainer
              />
              {mode === "deposit" ? (
                <Text textStyle="body1" fontWeight="bold" mt={1.5} color="purple">
                  Wallet Balance: {getNum(userPreonBalance)} PREON
                </Text>
              ) : (
                <Text textStyle="body1" fontWeight="bold" mt={1.5}>
                  Staked Balance: {fromUnallocated ? getNum(preonStaked) : getNum(AmountStakedLP)}{" "}
                  PREON
                </Text>
              )}
              <Box>
                <Flex mt={4}>
                  <Text textStyle="subtitle1" fontWeight="normal" color="white">
                    {"New Staked Amount"}
                  </Text>
                  <Spacer />
                  <CoinAmount
                    token="PREON"
                    amount={adjustValue(
                      mode,
                      mode === "deposit"
                        ? preonStaked + AmountStakedLP
                        : fromUnallocated
                        ? preonStaked
                        : AmountStakedLP,
                      values.vestakeInput
                    )}
                    textStyle="subtitle1"
                    color="purple"
                  />
                </Flex>
                <Flex mt={4}>
                  <Text textStyle="subtitle1" fontWeight="normal" color="white">
                    {"New Estimated Weekly vePREON "}
                    <Tooltip>
                      Estimated amount of rewards you will receive in a week based on your deposit
                    </Tooltip>
                  </Text>
                  <Spacer />
                  <CoinAmount
                    token="vePREON"
                    amount={
                      adjustValue(
                        mode,
                        mode === "deposit"
                          ? preonStaked + AmountStakedLP
                          : fromUnallocated
                          ? preonStaked
                          : AmountStakedLP,
                        values.vestakeInput
                      ) *
                      accumulationRate *
                      604800
                    }
                    textStyle="subtitle1"
                    color="purple"
                    noCurrencyConvert={true}
                  />
                </Flex>
                <Flex mt={4}>
                  <Text textStyle="subtitle1" fontWeight="normal" color="white">
                    {"New Estimated Weekly PREON "}
                    <Tooltip>
                      Estimated amount of rewards you will receive in a week based on your deposit
                    </Tooltip>
                  </Text>
                  <Spacer />
                  <CoinAmount
                    token="PREON"
                    //getNewEstimatedWeeklyRewardsAmount(valueInput:number|undefined, preonStaked:number, reward:number, isStake:boolean, totalPreon:number): number {
                    amount={getNewEstimatedWeeklyRewardsAmount(
                      +values.vestakeInput,
                      mode === "deposit"
                        ? preonStaked + AmountStakedLP
                        : fromUnallocated
                        ? preonStaked
                        : AmountStakedLP,
                      format(reward),
                      mode == "deposit",
                      format(totalPreon)
                    )}
                    textStyle="subtitle1"
                    color="purple"
                    noCurrencyConvert={true}
                  />
                </Flex>
              </Box>
              <Divider color="purple" mt={4} />

              <Flex mt={4}>
                <Text textStyle="subtitle1" fontWeight="normal" color="white">
                  {"PREON Reward APR "}
                </Text>
                <Spacer />

                <Tag bg="gradient">
                  {/* {console.log("outputs2", +String(reward), preonPrice, totalLPStaked)} */}
                  <Text textStyle="subtitle1">
                    {/* #TODO! changed from {(((+String(reward) * 52 * 2) / format(totalPreon)) * 100).toFixed(3)} */}
                    {/* {isNaN(+values.stakeInput) && 
                      (((+String(reward) * 52) / (lpStaked)) * 100).toFixed(3)} */}
                    {preonReward}%
                  </Text>
                </Tag>
              </Flex>

              {/* <Flex mt={4}>
                <Text textStyle="subtitle1" fontWeight="normal" color="white">
                  {"vePREON Growth Rate "}
                  <Tooltip>Estimated amount of rewards you will receive in a week based on your deposit</Tooltip>
                </Text>
                <Spacer />
                <Tag bgColor="secondary.400">
                  <Text textStyle="subtitle1">{(preonAPR * 100).toFixed(3)}%</Text>
                </Tag>
              </Flex> */}
              {!disconnected && mode === "withdraw" && fromUnallocated && (
                <Flex mt={8} justify="flex-end">
                  <Button
                    variant="gradient"
                    onClick={() => {
                      validate(values.vestakeInput);
                    }}
                  >
                    {"Unstake from Unallocated"}
                  </Button>
                </Flex>
              )}
              {!disconnected && !fromUnallocated && (
                <Flex mt={8} justify="flex-end">
                  <Button
                    variant="gradient"
                    onClick={() => {
                      validate(values.vestakeInput);
                    }}
                  >
                    {mode == "deposit" ? "Stake for LP Boost" : "Unstake from LP Boost"}
                  </Button>
                </Flex>
              )}
            </>
          )}
        />
      </Box>
    </>
  );
};

export default VEStakeCard;
// function useLiquity(): { liquity: any; } {
//   throw new Error("Function not implemented.");
// }
