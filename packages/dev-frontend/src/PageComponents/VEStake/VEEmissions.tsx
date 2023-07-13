// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Flex, Spacer, Text, useDisclosure, Button } from "@chakra-ui/react";
import CoinAmount from "../../components/CoinAmount";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { newWeeklyAPR, format } from "../../Utils/number";
import Tooltip from "../../components/Tooltip";
import PoolRewardsModal from "../Pool/PoolRewardsModal";
import { getNewEstimatedWeeklyRewardsAmount } from "./veStakeCard.utils";
import { useLiquity } from "../../hooks/LiquityContext";
import { useTransactionFunction } from "../../components/Transaction";

const selector = ({ vePREONStaked }: LiquityStoreState) => ({
  vePREONStaked
});

const VEEmissions: React.FC = () => {
  const { vePREONStaked } = useLiquitySelector(selector);
  // console.log("vePREONStaked :",vePREONStaked)
  const preonStaked = format(vePREONStaked.preonStake);
  const preonStakedOnFarm = format(vePREONStaked.preonStakeOnFarm); //preonStakedOnFarm is returning 0 #staticvalue
  // console.log("preonStakedOnFarm", vePREONStaked.preonStakeOnFarm)
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

  const [sendTransaction] = useTransactionFunction(
    "claim-pending-PREON",
    liquity.send.getVePreonStakeReward.bind(liquity.send)
  );

  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      <Flex flex={1} ml={[0, null, 3]} mt={[6, null, 0]}>
        <Box layerStyle="card" flex={1} mt={6}>
          <Text textStyle="title3" mb={5} color="purple">
            PREON Emissions <Tooltip>Stakers in vePREON also earn PREON rewards!</Tooltip>
          </Text>
          <Box>
            <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                Weekly PREON Accumulation Rate
              </Text>
              <Spacer />
              <CoinAmount
                token="PREON"
                amount={format(
                  getNewEstimatedWeeklyRewardsAmount(
                    0,
                    // preonStakedOnFarm is returning 0 #staticvalue
                    preonStakedOnFarm,
                    format(reward),
                    true,
                    format(totalPreon)
                  )
                )}
                textStyle="subtitle1"
                color="purple"
              />
            </Flex>
            <Flex mt={4}>
              <Text textStyle="subtitle1" fontWeight="normal" color="white">
                Pending PREON Rewards
              </Text>
              <Spacer />
              <CoinAmount
                token="PREON"
                amount={format(preonEarned)}
                textStyle="subtitle1"
                color="purple"
              />
            </Flex>
          </Box>

          {/* <Flex mt={8} justify="flex-end">
              <Button colorScheme="brand">
                Claim Pending PREON
              </Button>
            </Flex> */}
          <Flex justify="flex-end" mt={4}>
            <Button variant="gradient" bgColor="purple" onClick={() => sendTransaction()}>
              Claim Pending PREON
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default VEEmissions;
