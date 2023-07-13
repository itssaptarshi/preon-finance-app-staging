// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import CoinAmount from "../../../components/CoinAmount";
import { Decimal, LiquityStoreState, TroveMappings } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { getBalanceInfo } from "./YourBalance.utils";
import { newWeeklyAPR, format } from "../../../Utils/number";
import Tooltip from "../../../components/Tooltip";
import { useLiquity } from "../../../hooks/LiquityContext";
import PoolRewardsModal from "../../Pool/PoolRewardsModal";

const selector = ({ boostedFarm }: LiquityStoreState) => ({
  boostedFarm
});

const calculateAPR = (totalSPREONSupply: Decimal, totalStakedPREON: Decimal): number => {
  return 1.125;
};

const YourFarmBalanceCard: React.FC = () => {
  const { boostedFarm } = useLiquitySelector(selector);
  const { liquity } = useLiquity();
  // ! TODO: #pending check if required & update address - preontokenaddr #address
  const earned: TroveMappings = {
    "0x6397866132887b206EEA19f910730443E71a8CfB": boostedFarm.earnedPREON
  };

  const balanceInfo = getBalanceInfo(
    +String(boostedFarm.lpTokenBalance),
    +String(Decimal.from(100).mul(boostedFarm.lpTokenBalance.div(boostedFarm.totalLPStaked))),
    0,
    !isNaN(+Object.values(earned)[0]) ? format(+Object.values(earned)[0]) : 0
  );
  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      {/* <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={earned}
        notStability={true}
        mode="LP"
        key="prm"
        isOldFarm={true}
      />
      <Box layerStyle="card" flex={1}>
        <Text textStyle="title3" mb={5}>
          Your LP Token Balance
        </Text>
        <Box>
          {balanceInfo.map(({ tooltip, value, percent, title }, idx) => (
            <Flex key={idx} direction="row" mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal">
                {title + " "}
                {tooltip !== undefined && <Tooltip>{tooltip}</Tooltip>}
              </Text>
              <Spacer />
              {percent !== undefined && (
                <Text textStyle="subtitle1" color="purple">
                  {percent < 0.001 ? "< " + 0.001 : percent.toFixed(3)}%
                </Text>
              )}
              {title === "Total Amount Staked" && value !== undefined ? (
                <CoinAmount
                  token="LP Tokens"
                  amount={value}
                  textStyle="subtitle1"
                  color="purple"
                  noCurrencyConvert={true}
                />
              ) : (
                value !== undefined && (
                  <CoinAmount token="PREON" amount={value} textStyle="subtitle1" color="purple" />
                )
              )}
            </Flex>
          ))}
        </Box>
        <Flex justify="flex-end" mt={4}>
          <Button variant="gradient" bgColor="purple" onClick={onPoolRewardsOpen}>
            View Rewards
          </Button>
        </Flex>
      </Box> */}
    </>
  );
};

export default YourFarmBalanceCard;
