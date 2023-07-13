// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  useToast,
  SimpleGrid,
  Collapse,
  IconButton,
  background,
  Select
} from "@chakra-ui/react";
import { Toggle, AdjustInput, CoinAmount, Icon } from "../../components";
import Tooltip from "../../components/Tooltip";
import ConfirmStakeModal from "./ConfirmStakeModal";
import BoosterCalculatorModal from "./BoosterCalculatorModal";
import { Decimal, Farm, LiquityStoreState, vePREONStake, TroveMappings } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { adjustValue, newWeeklyAPR, getNum, format, formatWithDecimals } from "../../Utils/number";
import { validateDeposit } from "../../Utils/validation";
import { Form } from "react-final-form";
import { useLiquity } from "../../hooks/LiquityContext";
import vePREON from "../../components/Icon/library/vePREON";
import { FarmPoolRewardsInfo, calculateFarmPoolRewards } from "./FarmUtils";
import PoolRewardsModal from "../../PageComponents/Pool/PoolRewardsModal";

export type BoostFarmCardProps = {
  disconnected?: boolean;
};

const selector = ({
  boostedFarm,
  lpTokenBalance,
  PREONPrice,
  vePREONStaked,
  poolRewardRate
}: LiquityStoreState) => ({
  boostedFarm,
  lpTokenBalance,
  PREONPrice,
  vePREONStaked,
  poolRewardRate
});

var dataSelector = useLiquitySelector;

const BoostFarmCard: React.FC<BoostFarmCardProps> = ({
  disconnected = false,
  nfts,
  balances,
  attachment,
  checkToken
}) => {
  let lpStaked: number, totalLPStaked: number, rewardRate: number, userShare: number;
  const { boostedFarm, vePREONStaked, lpTokenBalance, PREONPrice } = dataSelector(selector);
  const [nftId, setNftId] = useState(0);
  const [attachedNft, setAttachedNft] = useState(0);

  const PRECISION = 1e18;

  const PRECISION1 = 1e56;

  const [value, setValue] = useState<Record<string, any>>({});

  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const {
    isOpen: isCalculatorOpen,
    onOpen: onCalculatorOpen,
    onClose: onCalculatorClose
  } = useDisclosure();
  const toast = useToast();

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");

  const handleAttachment = async () => {
    // attachment(6);
    const test = await checkToken();
    setAttachedNft(format(test));
  };

  useEffect(() => {
    if (nfts.length > 0) {
      //   nfts.map(nfts =>
      //     attachment(nfts.id),

      //      );
      //   // handleAttachment();
      handleAttachment();
    }
  }, [nfts]);

  // #staticvalue farmPoolRewardInfo is returning NaN
  let farmPoolRewardInfo: FarmPoolRewardsInfo = {
    userBaseRewardShare: 0,
    baseAPR: 0,
    userAnnualBaseReward: 0,
    userBoostedRewardShare: 0,
    boostedAPR: 0,
    userAnnualBoostedReward: 0
  };

  if (!disconnected) {
    const preonPrice = format(PREONPrice);
    console.log("@boosted: rewardRate", boostedFarm.rewardRate.toString());

    lpStaked = format(boostedFarm.lpTokenBalance);
    totalLPStaked = format(boostedFarm.totalLPStaked);
    rewardRate = boostedFarm.rewardRate;

    userShare = ((+lpStaked * 1e18) / (+totalLPStaked * 1e18)) * PRECISION;

    const adjustAmount =
      value["stakeInput"] !== undefined && mode === "withdraw"
        ? -Number(value["stakeInput"])
        : value["stakeInput"] !== undefined && mode === "deposit"
        ? +value["stakeInput"]
        : undefined;
    farmPoolRewardInfo = calculateFarmPoolRewards(
      vePREONStaked,
      preonPrice,
      boostedFarm,
      adjustAmount
    );
  } else {
    totalLPStaked = 0;
    lpStaked = 0;
  }

  const validate = (valueChange: number) => {
    validateDeposit(toast, mode, format(lpTokenBalance), lpStaked, valueChange, onConfirmOpen);
  };
  const earned: TroveMappings = {
    preontoken: boostedFarm.earnedPREON
  };
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);
  const {
    isOpen: isPoolRewardsOpen,
    onOpen: onPoolRewardsOpen,
    onClose: onPoolRewardsClose
  } = useDisclosure();

  return (
    <>
      <PoolRewardsModal
        isOpen={isPoolRewardsOpen}
        onClose={onPoolRewardsClose}
        rewards={earned}
        notStability={true}
        mode="LP"
        key="prm"
      />

      <Box layerStyle="card" flex={1}>
        <Flex>
          <Text textStyle="title3" mb={2} color="purple">
            STAR/MATIC LP Farm{" "}
          </Text>
          {show ? (
            <IconButton
              // aria-label="Expand Stake LP"
              size={"sm"}
              ml={"120px"}
              onClick={handleToggle}
              variant="gradient"
              isRound={true}
              icon={<Icon style={{ transform: "rotate(180deg)" }} iconName="CollapseIcon" />}
            />
          ) : (
            <IconButton
              // aria-label="Expand Stake LP"
              size={"sm"}
              ml={"120px"}
              onClick={handleToggle}
              variant="gradient"
              isRound={true}
              icon={<Icon iconName="CollapseIcon" />}
            />
          )}
        </Flex>
        <Text fontSize={"16px"} mt={5} color="white">
          STAR/MATIC LP Farm will provide Boosted Yields based on vePREON Balances.
        </Text>
        {/* <Text textStyle="body1" fontWeight="bold" mb={2} color="purple">
          ${getNum(format(boostedFarm.totalLPStaked), 2)} Staked in New LP Farm
        </Text> */}
        <Divider mt={4} mb={5} height="0.5px" opacity="0.4" />
        <Toggle
          size="50px"
          options={[
            { value: "Stake", key: "deposit" },
            { value: "Unstake", key: "withdraw" }
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
                  <ConfirmStakeModal
                    isOpen={isConfirmOpen}
                    onClose={onConfirmClose}
                    mode={mode}
                    amount={values.stakeInput || "0"}
                    total={adjustValue(mode, lpStaked, values.stakeInput)}
                    values={values}
                    tokenId={+nftId > 0 ? nftId + "" : "0"}
                    name="stakeInput"
                  />
                )}
                {!disconnected && (
                  <BoosterCalculatorModal isOpen={isCalculatorOpen} onClose={onCalculatorClose} />
                )}

                <AdjustInput
                  mt={4}
                  max={mode === "deposit" ? format(lpTokenBalance) : lpStaked}
                  name="stakeInput"
                  token="Balancer"
                  showToken
                  fillContainer
                  noCurrencyConvert={true}
                />
                {mode === "deposit" ? (
                  <Text textStyle="body1" fontWeight="bold" mt={1.5} color="purple">
                    Wallet Balance: {getNum(format(lpTokenBalance))} Balancer Pool Tokens
                  </Text>
                ) : (
                  <Text textStyle="body1" fontWeight="bold" mt={1.5} color="purple">
                    Staked Balance: {getNum(lpStaked)} Balancer Pool Tokens
                  </Text>
                )}
                <Flex w={"full"}>
                  {nfts.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      {mode === "deposit" ? (
                        <>
                          {attachedNft === 0 ? (
                            <>
                              <Select
                                mr={6}
                                mt={4}
                                color="white"
                                placeholder="Please select one"
                                onChange={event => {
                                  setNftId(event.target.value);
                                }}
                              >
                                {nfts.map(nfts => (
                                  <option
                                    style={{ backgroundColor: "black" }}
                                    value={format(nfts.id)}
                                  >
                                    NFT id #{format(nfts.id)}
                                  </option>
                                ))}
                              </Select>
                            </>
                          ) : (
                            <>
                              <Text textStyle={"subtitle1"} mt={2}>
                                You Already Have An NFT Attached.
                              </Text>
                            </>
                          )}
                        </>
                      ) : (
                        <Text textStyle="body1" color={"purple"}>
                          Note: Your NFT Will Be Detached Once You Unstake all LP staked balance
                        </Text>
                      )}
                    </>
                  )}
                </Flex>

                {!disconnected && (
                  <Flex mt={5} mb={5} justify="center">
                    <Button variant="gradient" onClick={() => validate(values.stakeInput)}>
                      {mode == "deposit" ? "Confirm Stake" : "Confirm Unstake"}
                    </Button>
                    {/* <Button onClick={handleAttachment}>Hans</Button> */}
                  </Flex>
                )}

                <>
                  <Divider mt={4} height="0.5px" opacity="0.4" />
                  <Box>
                    <Flex mt={4}>
                      <Text textStyle="subtitle1" fontWeight="normal" color="white">
                        {"Your Stake"}
                      </Text>
                      <Spacer />
                      <CoinAmount
                        token="BPT"
                        amount={adjustValue(mode, lpStaked, values.stakeInput)}
                        textStyle="subtitle1"
                        color="purple"
                        noCurrencyConvert={true}
                      />
                    </Flex>
                    {nftId == 0 ? (
                      <></>
                    ) : (
                      <>
                        <Flex mt={4}>
                          <Text textStyle="subtitle1" fontWeight="normal" color="white" mr={3}>
                            {" NFT Token ID "}
                          </Text>
                          <Spacer />
                          <Text textStyle="subtitle1" fontWeight="normal" color="purple" mr={3}>
                            #{nftId}
                          </Text>
                        </Flex>
                      </>
                    )}
                    <Flex mt={4}>
                      <Text textStyle="subtitle1" fontWeight="normal" color="white" mr={3}>
                        {"Est. Weekly Rewards "}
                      </Text>
                      <Spacer />
                      {/* {console.log("eweeee", farmPoolRewardInfo)} */}
                      <CoinAmount
                        token="PREON"
                        amount={
                          // farmPoolRewardInfo !== undefined
                          //   ? farmPoolRewardInfo.userAnnualBaseReward / 52.143 +
                          //     farmPoolRewardInfo.userAnnualBoostedReward / 52.143
                          //   : 100
                          // (((+rewardRate / 10 ** 27) * 604800) * userShare / 100) * values.stakeInput / ((+rewardRate / 10 ** 27) * 604800)
                          (userShare * ((+rewardRate / 10 ** 27) * 86400)) / PRECISION
                        }
                        textStyle="subtitle1"
                        color="purple"
                      />
                    </Flex>
                    <Flex mt={4}>
                      <Text textStyle="subtitle1" fontWeight="normal" color="white">
                        {" PREON Reward APR "}
                        <Tooltip>Your APR with base and boosted PREON rewards</Tooltip>
                      </Text>

                      <Spacer />
                      <Text textStyle="subtitle1" color={"purple"}>
                        {/* farmPoolRewardInfo is returning NaN #staticvalue*/}
                        {/* #TODO ! changed from {getNum(farmPoolRewardInfo.baseAPR + farmPoolRewardInfo.boostedAPR, 3)}*/}
                        {getNum(userShare * farmPoolRewardInfo.baseAPR) / PRECISION1}%
                      </Text>
                    </Flex>
                    <Divider mt={4} height="0.5px" opacity="0.4" />
                  </Box>
                  <Flex justify="Center" mt={10}>
                    <Button
                      mr={8}
                      variant="gradient"
                      onClick={() => {
                        onCalculatorOpen();
                      }}
                    >
                      <Text textStyle="subtitle1" fontWeight="normal">
                        Booster Calculator
                      </Text>
                    </Button>
                    <Button variant="gradient" onClick={onPoolRewardsOpen}>
                      View Rewards
                    </Button>
                  </Flex>
                </>
              </>
            )}
          />
        </Collapse>
      </Box>
    </>
  );
};

export default BoostFarmCard;
