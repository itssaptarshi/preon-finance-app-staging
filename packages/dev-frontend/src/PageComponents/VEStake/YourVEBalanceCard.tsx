// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Flex, Spacer, Text, useDisclosure, Button } from "@chakra-ui/react";
import CoinAmount from "../../components/CoinAmount";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { getBalanceInfo } from "./YourVEBalance.utils";
import { newWeeklyAPR, format, formatWithDecimals } from "../../Utils/number";
import Tooltip from "../../components/Tooltip";
import PoolRewardsModal from "../Pool/PoolRewardsModal";
import { getNewEstimatedWeeklyRewardsAmount } from "./veStakeCard.utils";
import { useLiquity } from "../../hooks/LiquityContext";
import { contractAddresses } from "../../config/constants";

const selector = ({ vePREONStaked }: LiquityStoreState) => ({
  vePREONStaked
});

const YourveBalanceCard: React.FC = () => {
  const { vePREONStaked } = useLiquitySelector(selector);
  const preonStaked = format(vePREONStaked.preonStake);
  const totalPreon: Decimal = vePREONStaked.totalPreon;
  const preonEarned: Decimal = vePREONStaked.preonEarned;
  const { liquity } = useLiquity();

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

  const balanceInfo = getBalanceInfo(
    preonStaked,
    stakeShare,
    format(preonEarned),
    format(vePREONStaked.accumulationRate),
    getNewEstimatedWeeklyRewardsAmount(0, preonStaked, format(reward), true, format(totalPreon)),
    formatWithDecimals(vePREONStaked.vePREONGain, 36)
  );

  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  const preontoken = contractAddresses.preonToken.address;

  return (
    <>
      <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={{ preontoken: preonEarned }} // preontokenaddr
        notStability={true}
        mode="PREON"
        key="prm"
      />
      <Box layerStyle="card" flex={1}>
        <Text textStyle="title3" mb={5}>
          Your vePREON Balance
        </Text>
        <Box>
          {balanceInfo.map(({ tooltip, value, percent, title }) => (
            <Flex direction="row" mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal">
                {title + " "}
                {tooltip !== undefined && <Tooltip>{tooltip}</Tooltip>}
              </Text>
              <Spacer />
              {percent !== undefined && <Text textStyle="subtitle1">{percent.toFixed(3)}%</Text>}
              {value !== undefined && title === "Total Amount Staked" && (
                <CoinAmount token="PREON" amount={value} textStyle="subtitle1" color="white" />
              )}
              {value !== undefined &&
                title != "Total Amount Staked" &&
                tooltip != undefined &&
                tooltip!.includes("vePREON") && (
                  <CoinAmount
                    token="vePREON"
                    amount={value}
                    textStyle="subtitle1"
                    color="white"
                    noCurrencyConvert={true}
                  />
                )}
              {value !== undefined &&
                (title === "Pending PREON Rewards" ||
                  (tooltip != undefined && !tooltip!.includes("vePREON"))) && (
                  <CoinAmount
                    token="PREON"
                    amount={value!}
                    textStyle="subtitle1"
                    color="white"
                    noCurrencyConvert={true}
                  />
                )}
            </Flex>
          ))}
        </Box>
        <Flex justify="flex-end" mt={4}>
          <Button variant="gradient" onClick={onPoolRewardsOpen}>
            View Rewards
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default YourveBalanceCard;
