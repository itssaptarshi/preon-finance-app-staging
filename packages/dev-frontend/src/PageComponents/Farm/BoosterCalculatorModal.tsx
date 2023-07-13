// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Toggle, AdjustInput, CoinAmount, Icon } from "../../components";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, formatWithDecimals, getNum } from "../../Utils/number";
import { FarmPoolRewardsInfo, calculateBoostRewards } from "./FarmUtils";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton
} from "@chakra-ui/modal";
import { Flex, Text } from "@chakra-ui/react";
import { Form } from "react-final-form";

export type BoosterCalculatorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const selector = ({ boostedFarm, vePREONStaked, PREONPrice }: LiquityStoreState) => ({
  boostedFarm,
  vePREONStaked,
  PREONPrice
});

const BoosterCalculatorModal: React.FC<BoosterCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { boostedFarm, vePREONStaked, PREONPrice } = useLiquitySelector(selector);
  const [value, setValue] = useState<Record<string, any>>({});
  let appliedVePreon: number;
  if (format(vePREONStaked.preonStakeOnFarm) === 0 || format(vePREONStaked.boostFactor) === 0) {
    appliedVePreon = 0;
  } else {
    appliedVePreon =
      (Math.pow(format(vePREONStaked.boostFactor), 2) /
        format(boostedFarm.lpTokenBalance) /
        10 ** 18) *
      10 ** 22;
  }

  const calculateTime = () => {
    const vePREONBal = value["vePREONBal"];
    const rate = format(vePREONStaked.accumulationRate);
    const PREONStaked = value["PREONStaked"];

    if (vePREONBal < appliedVePreon) {
      return 0;
    }

    const result = (vePREONBal - appliedVePreon) / rate / PREONStaked / 86400;
    return isNaN(result) || !isFinite(result) ? 0 : result;
  };

  const farmPoolRewardInfo = calculateBoostRewards(
    vePREONStaked,
    format(PREONPrice),
    boostedFarm,
    +value["LPStaked"],
    +value["vePREONBal"]
  );

  console.log("vePREONStake", vePREONStaked);
  // console.log(value)
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" pb={5}>
            Booster Calculator
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody mb={5}>
            <Form
              onSubmit={() => {}}
              render={({ values }) => (
                <>
                  {setValue(values)}
                  <Flex>
                    <Text textStyle="body1" fontWeight="bold" mt={2}>
                      Balancer Pool Token Staked
                    </Text>
                  </Flex>
                  <Flex>
                    <AdjustInput
                      mt={2}
                      max={undefined}
                      name="LPStaked"
                      token="Balancer"
                      showToken
                      fillContainer
                      noCurrencyConvert={true}
                      defaultValue={format(boostedFarm.lpTokenBalance)}
                    />
                  </Flex>

                  <Flex>
                    <Text textStyle="body1" fontWeight="bold" mt={2}>
                      vePREON Accumulated on Balancer Pool Token Boosting
                    </Text>
                  </Flex>
                  <Flex>
                    <AdjustInput
                      mt={2}
                      max={undefined}
                      min={appliedVePreon}
                      name="vePREONBal"
                      token="vePREON"
                      showToken
                      fillContainer
                      noCurrencyConvert={true}
                      defaultValue={appliedVePreon}
                    />
                  </Flex>

                  <Flex>
                    <Text textStyle="body1" fontWeight="bold" mt={2}>
                      PREON Staked
                    </Text>
                  </Flex>
                  <Flex>
                    <AdjustInput
                      mt={2}
                      max={undefined}
                      name="PREONStaked"
                      token="PREON"
                      showToken
                      fillContainer
                      noCurrencyConvert={true}
                      defaultValue={format(vePREONStaked.preonStakeOnFarm)}
                    />
                  </Flex>

                  <Flex>
                    <Text textStyle="body1" fontWeight="bold" mt={2}>
                      Weekly Boost PREON Reward Estimate
                    </Text>
                  </Flex>
                  <Flex mt={2}>
                    <CoinAmount
                      token="PREON"
                      amount={farmPoolRewardInfo.userAnnualBoostedReward / 52.143}
                      textStyle="subtitle1"
                      color="green.400"
                    />
                  </Flex>

                  <Flex>
                    <Text textStyle="body1" fontWeight="bold" mt={2}>
                      Boost PREON Reward APR
                    </Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="subtitle1" color="green.400" mt={2}>
                      {farmPoolRewardInfo.boostedAPR > 0 && farmPoolRewardInfo.boostedAPR < 0.001
                        ? "< 0.001"
                        : getNum(farmPoolRewardInfo.boostedAPR, 3)}
                      %
                    </Text>
                  </Flex>

                  <Flex>
                    <Text textStyle="body1" fontWeight="normal" mt={2}>
                      It will take you {getNum(calculateTime(), 2)} days to accumulate{" "}
                      {getNum(+value["vePREONBal"], 2)} vePREON starting from your current vePREON
                      balance of {getNum(appliedVePreon, 2)} with {getNum(+value["PREONStaked"], 2)}{" "}
                      staked PREON.
                    </Text>
                  </Flex>
                </>
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoosterCalculatorModal;
