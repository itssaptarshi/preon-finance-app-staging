// @ts-nocheck
import React from "react";
import { Box, Flex, Button, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import Tooltip from "../../components/Tooltip";
import CoinAmount from "../../components/CoinAmount";
import PoolRewardsModal from "./PoolRewardsModal";
import { LiquityStoreState, Decimal } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, getNum } from "../../Utils/number";

const selector = ({ stabilityDeposit, starInStabilityPool, poolRewardRate }: LiquityStoreState) => ({
  stabilityDeposit,
  starInStabilityPool,
  poolRewardRate
});

const YourBalanceCard: React.FC = () => {
  let { stabilityDeposit, starInStabilityPool, poolRewardRate } = useLiquitySelector(selector); //changed const to let #staticvalue
  console.log("starBalanceCard 1", stabilityDeposit);
  console.log("starBalanceCard 2", starInStabilityPool);
  console.log("starBalanceCard 3", format(poolRewardRate)); // poolRewardRate is returning 0 #staticvalue

  const poolShare: number = format(stabilityDeposit.currentSTAR.mulDiv(100, starInStabilityPool));
  const totalDeposited: number = +stabilityDeposit.currentSTAR;
  const rewardsEarned = +stabilityDeposit.preonReward; // preonReward is returning 0 #staticvalue
  const rewards = stabilityDeposit.collateralGain;
  // console.log("rewards pool", rewards);

  // const liquidationGain = stabilityDeposit.collateralGain

  // Pass it util function for calculating daily rewards.
  // const dailyRewards = poolShare.div(100).mul(0).prettify(0);
  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      {/* Your Balance Card Modals */}
      <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={rewards}
        notStability={false}
      />

      {/* Your Balance Card Modals */}
      <Box layerStyle="card" flex={1}>
        <Text textStyle="title3" mb={5}>
          Your STAR Balance
        </Text>
        <Box>
          {/* Total Deposited */}
          <Flex direction="row" mb={4}>
            <Text textStyle="subtitle1" fontWeight="normal">
              Total Deposited
            </Text>
            <Spacer />
            <Flex alignItems="center">
              <CoinAmount
                token="STAR"
                amount={totalDeposited}
                textStyle="subtitle1"
                color="purple"
              />
            </Flex>
          </Flex>

          {/* Pool Share */}
          <Flex direction="row" mb={4}>
            <Text textStyle="subtitle1" fontWeight="normal">
              Pool Share
            </Text>
            <Spacer />
            <Text textStyle="subtitle1" mr={1} color="purple">
              {poolShare.toFixed(5)}%
            </Text>
          </Flex>

          {/* Daily Rewards Estimate 
          <Flex direction="row" mb={4}>
            <Text textStyle="subtitle1" fontWeight="normal">
              Daily Rewards Estimate
            </Text>
            <Spacer />
            <Text textStyle="subtitle1" mr={1}>
              ${rewardsEarned.toFixed(2)}
            </Text>
          </Flex>
          */}

          {/* <Flex direction="row" mb={4}>
            <Text textStyle="subtitle1" fontWeight="normal" marginRight='5'>
              Estimated Weekly Rewards{" "}
              <Tooltip>
                Estimated amount of rewards you will receive in a week based on your deposit
              </Tooltip>
            </Text>
            <Spacer />
            <CoinAmount
              token="PREON"
              amount={
                !stabilityDeposit.currentSTAR.eq(Decimal.from(0))
                  ? +// poolrewardrate is returning 0, which is causing this value to be 0 #staticvalue
                    (
                      (format(poolRewardRate) * 604800 * format(totalDeposited)) /
                      format(starInStabilityPool)
                    ).toFixed(3)
                  : 0
              }
              textStyle="subtitle1"
              color="purple"
            />
          </Flex> */}

          {/* Rewards Earned */}
          {/* <Flex direction="row" mb={4}>
            <Text textStyle="subtitle1" fontWeight="normal">
              PREON Rewards Earned
            </Text>
            <Spacer />
            <CoinAmount
              token="PREON"
              //  rewardsEarned is returning zero #staticvalue
              amount={format(rewardsEarned)}
              textStyle="subtitle1"
              color="purple"
            />
          </Flex> */}
        </Box>

        {/* Modal Open Buttons */}
        <Flex justify="flex-end">
          <Button variant="gradient" onClick={onPoolRewardsOpen}>
            View Rewards
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default YourBalanceCard;
