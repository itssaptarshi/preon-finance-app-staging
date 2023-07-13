// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Box, Button, Divider, Flex, Spacer, Tag, Text } from "@chakra-ui/react";
import { Toggle, AdjustInput, CoinAmount, Icon } from "../../components";
import Tooltip from "../../components/Tooltip";
import ConfirmStakeModal from "./ConfirmStakeModal";
import BoosterCalculatorModal from "./BoosterCalculatorModal";
import { Decimal, Farm, LiquityStoreState, vePREONStake, TroveMappings } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

export type FarmHeadingProps = {
  disconnected?: boolean;
};

const selector = ({
  boostedFarm,
  lpTokenBalance,
  PREONPrice,
  vePREONStaked
}: LiquityStoreState) => ({
  boostedFarm,
  lpTokenBalance,
  PREONPrice,
  vePREONStaked
});

var dataSelector = useLiquitySelector;

const FarmHeading: React.FC<FarmHeadingProps> = ({ disconnected = false }) => {
  return (
    <>
      <Box>
        <Flex>
          <Text
            fontSize="50px"
            letterSpacing="0.1em"
            fontWeight="300"
            color="white"
            textTransform="uppercase"
            mt={10}
          >
            Farm
          </Text>
        </Flex>
        <Text
          textStyle="title3"
          fontWeight="700"
          fontSize="36px"
          fontFamily="Merriweather"
          lineHeight="30px"
          textShadow="0px 0px 11px #AC88CF"
          textAlign={["center", "left"]}
          pb="16px"
          mb="36px"
          mt={20}
          borderBottom={"1px solid rgba(255, 255, 255, 0.2)"}
        >
          LP FARM
        </Text>

        <Flex>
          <Text mb={2} textStyle={"subtitle1"} whiteSpace="pre-wrap" fontSize="md" textColor="white">
            Stake STAR in Stability Pool, earn PREON. In case of liquidation, use a portion of STAR
            to offset debt and receive claimable collateral ~10% greater in value than STAR decrease.
          </Text>
        </Flex>
      </Box>
    </>
  );
};

export default FarmHeading;
