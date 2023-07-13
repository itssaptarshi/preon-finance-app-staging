// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Text,
  useDisclosure,
  Button,
  Grid,
  Progress,
  useToast,
  UseToastOptions,
  Tooltip as ChakraTooltip
} from "@chakra-ui/react";
import CoinAmount from "../../components/CoinAmount";
import { Decimal, LiquityStoreState, updateVePreonParams } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { newWeeklyAPR, format, getNum, formatWithDecimals } from "../../Utils/number";
import Tooltip from "../../components/Tooltip";
import PoolRewardsModal from "../Pool/PoolRewardsModal";
import { getNewEstimatedWeeklyRewardsAmount } from "./veStakeCard.utils";
import { useLiquity } from "../../hooks/LiquityContext";
import { useTransactionFunction } from "../../components/Transaction";
import { contractAddresses } from "../../config/constants";

const BOOSTED_FARM = contractAddresses.boostedFarm.address;

const selector = ({ vePREONStaked, boostedFarm }: LiquityStoreState) => ({
  vePREONStaked,
  boostedFarm
});

var BreakException = {};

const VEStakeSummary: React.FC = () => {
  const { vePREONStaked, boostedFarm } = useLiquitySelector(selector);

  console.log("@vePREONStaked accumulationRate", +vePREONStaked.accumulationRate);
  console.log("@vePREONStaked boostAmount", +vePREONStaked.boostAmount);
  console.log("@vePREONStaked boostBasePartition", +vePREONStaked.boostBasePartition);
  console.log("@vePREONStaked boostFactor", +vePREONStaked.boostFactor);
  console.log("@vePREONStaked boostRewardRate", +vePREONStaked.boostRewardRate);
  console.log("@vePREONStaked boostSumOfFactors", +vePREONStaked.boostSumOfFactors);
  // console.log("@vePREONStaked boostTotalSupply", +vePREONStaked.boostTotalSupply);
  console.log("@vePREONStaked preonEarned", +vePREONStaked.preonEarned);
  console.log("@vePREONStaked preonStake", +vePREONStaked.preonStake);
  console.log("@vePREONStaked preonStakeOnFarm", +vePREONStaked.preonStakeOnFarm);
  console.log("@vePREONStaked rewardRate", +vePREONStaked.rewardRate);
  console.log("@vePREONStaked totalPreon", +vePREONStaked.totalPreon);
  console.log("@vePREONStaked totalUserPreon", +vePREONStaked.totalUserPreon);
  console.log("@vePREONStaked vePREONGain", +vePREONStaked.vePREONGain);
  console.log("@vePREONStaked vePREONTotal", +vePREONStaked.vePREONTotal);
  console.log("@vePREONStaked vePreonOnFarm", +vePREONStaked.vePreonOnFarm);

  const preonStaked = format(vePREONStaked.preonStake);
  const totalPreon: Decimal = vePREONStaked.totalPreon;
  const totalStaked: number = format(vePREONStaked.totalUserPreon);
  // console.log("totalStaked :",totalStaked)
  const totalVePreon: number = formatWithDecimals(vePREONStaked.vePREONTotal, 36);
  // console.log("totalvePreon", vePREONStaked.vePREONTotal)
  const preonEarned: Decimal = vePREONStaked.preonEarned;
  const { liquity } = useLiquity();
  const accumulationRate = format(vePREONStaked.accumulationRate);
  const weeklyVePreonReward = accumulationRate * totalStaked * 604800;
  let vePreonOnUnallocated = formatWithDecimals(vePREONStaked.vePREONGain, 36);
  let vePreonOnLp = formatWithDecimals(vePREONStaked.vePreonOnFarm, 36);
  let AppliedVePreon: number;
  if (format(vePREONStaked.preonStakeOnFarm) == 0 || format(boostedFarm.lpTokenBalance) == 0) {
    AppliedVePreon = 0;
  } else {
    AppliedVePreon =
      (Math.pow(format(vePREONStaked.boostFactor), 2) /
        format(boostedFarm.lpTokenBalance) /
        10 ** 18) *
      10 ** 22;
  }
  const progressRatio: number =
    formatWithDecimals(vePREONStaked.vePREONTotal, 36) / format(vePREONStaked.totalUserPreon);
  let vePreonProgressBar =
    progressRatio < 1 && formatWithDecimals(vePREONStaked.vePREONTotal, 36) !== 0
      ? 1
      : progressRatio;

  let PendingVePreon = vePreonOnLp - AppliedVePreon;
  // const totalPendingVePreon = PendingVePreon + vePreonOnUnallocated

  // console.log("progressRatio :",progressRatio);

  const [value, setValue] = useState<Record<string, any>>({});
  const [reward, setReward] = useState<Decimal>(Decimal.from(0));

  // Use Effect for getting the rewardEarned from Preon Emissions.
  useEffect(() => {
    liquity.getEstimatedVePreonRewards(format(totalPreon), 604800).then(num => setReward(num));
  }, [value.stakeInput, totalPreon]);

  let stakeShare: number;
  if (vePREONStaked.totalUserPreon != undefined && vePREONStaked.totalPreon != undefined) {
    stakeShare = format(vePREONStaked.totalUserPreon.div(vePREONStaked.totalPreon)) * 100;
  } else {
    stakeShare = 0;
  }

  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  const transactionId = "vePreonToFarm-transafter";
  // const [sendTransaction] = useTransactionFunction(
  //   transactionId,
  //   liquity.send.updateVEPREON.bind(liquity.send, Decimal.from(0), false, "0xE58859B3e728EdD28B556Ccc0704539c960F9208")
  // );
  const updateParams: updateVePreonParams[] = [
    {
      rewarder: "0x0000000000000000000000000000000000000000",
      amount: vePREONStaked.preonStake.hex,
      isIncrease: false
    },
    { rewarder: BOOSTED_FARM, amount: vePREONStaked.preonStake.hex, isIncrease: true }
  ];

  const [sendupdateVEPREON] = useTransactionFunction(
    transactionId,
    liquity.send.updateVEPREON.bind(liquity.send, updateParams)
  );

  const [sendNotifyAll] = useTransactionFunction(
    "notifyAllRewarders",
    liquity.send.notifyAllRewarders.bind(liquity.send)
  );

  let AmountStakedUnallocated = format(vePREONStaked.preonStake);

  const transferToBoost = () => {
    sendupdateVEPREON();
  };

  const toastProps: UseToastOptions = {
    status: "error",
    duration: 4000,
    isClosable: true,
    position: "top-right"
  };
  const toast = useToast();

  const onSubmit = (): void => {
    if (totalStaked == 0) {
      toast({
        title: "Error",
        description: "Stake PREON to begin accruing vePREON",
        ...toastProps
      });
      throw BreakException;
    }
    //  else if (AmountStakedUnallocated == 0) {
    //   toast({
    //     title: "Error",
    //     description: "No unallocated vePREON available to transfer to LP boost",
    //     ...toastProps
    //   });
    //   throw BreakException;
    // }
    else {
      transferToBoost();
    }
  };

  const onSubmit2 = (): void => {
    if (totalStaked == 0) {
      toast({
        title: "Error",
        description: "Stake PREON to begin accruing vePREON",
        ...toastProps
      });
      throw BreakException;
    } else if (format(boostedFarm.lpTokenBalance) == 0) {
      if (totalStaked == 0 || format(boostedFarm.lpTokenBalance) == 0) {
        toast({
          title: "Error",
          description: "Stake LP tokens on Farm Page to claim pending vePREON",
          ...toastProps
        });
        throw BreakException;
      }
    } else {
      transferToBoost();
    }
  };

  return (
    <>
      <Box layerStyle="card" flex={1} mt={6}>
        <Text textStyle="title3" mb={2}>
          Lock underlying token
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={12}>
          <Box>
            <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white" marginRight="10">
                {"Total Staked"}
              </Text>
              <Spacer />
              <CoinAmount token="PREON" amount={totalStaked} textStyle="subtitle1" color="purple" />
            </Flex>
            <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                {"Current Total vePREON "}
                <Tooltip>Total vePREON including pending vePREON yet to be claimed</Tooltip>
              </Text>
              <Spacer />
              <CoinAmount
                token="vePREON"
                amount={totalVePreon}
                textStyle="subtitle1"
                color="purple"
                noCurrencyConvert={true}
              />
            </Flex>
            {/* <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                vePREON Progress Bar
              </Text>
              <Spacer />
              <Text textStyle="subtitle2" fontWeight="normal" mt={1}>
                {progressRatio < 1 ? `< 1.0` : progressRatio.toFixed(1)}%
              </Text>

              <ChakraTooltip label={`${getNum(progressRatio, 3)} : 1`} >
               
               </ChakraTooltip>

              <Progress
                value={vePreonProgressBar}
                w="40%"
                colorScheme={"green"}
                bg="brand.900"
                borderRadius="infinity"
                mt={2.5}
                ml={3}
                mr={3}
              />

              <Text textStyle="subtitle2" fontWeight="normal" mt={1}>
                100%
              </Text>
            </Flex>
            <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                vePREON Total to PREON staked ratio{" "}
                <Tooltip>
                  Your vePREON to PREON ratio increases over time, to a max of 100 : 1 which will take
                  2 years to reach.
                </Tooltip>
              </Text>
              <Spacer />
              <Text textStyle="subtitle1" mr={1}>
                {getNum(progressRatio, 3)} X
              </Text>
            </Flex> */}
          </Box>
          <Box>
            <Flex mt={4}>
              <Text textStyle="subtitle3" fontWeight="normal" color="white">
                Locking Token
              </Text>
              <Spacer />
              <Text textStyle="subtitle4" ml={1} color="purple">
                PREON
              </Text>
            </Flex>
            {/* <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                Current Total Pending vePREON
              </Text>
              <Spacer />
              <CoinAmount
                token="vePREON"
                amount={PendingVePreon}
                textStyle="subtitle1"
                color="white"
                noCurrencyConvert={true}
              />
            </Flex> */}

            <Flex mt={10} mb={4} justify="flex-end">
              <Button variant="gradient" mr={8} onClick={onSubmit}>
                Rage Quit
                <Flex ml={1}>
                  <Tooltip>Penalized 50%</Tooltip>
                </Flex>
              </Button>
              <Button variant="gradient" onClick={onSubmit2}>
                Claim Pending vePREON
              </Button>
            </Flex>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default VEStakeSummary;
