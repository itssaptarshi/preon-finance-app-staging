import React from "react";
import { Flex, Box, Text, Spacer, Divider, IconButton, Collapse } from "@chakra-ui/react";
import StatColumn from "./StatColumn";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, getNum } from "../../Utils/number";
import { Icon } from "../../components";

const selector = ({ stabilityDeposit, starBalance, STARPrice }: LiquityStoreState) => ({
  stabilityDeposit,
  starBalance,
  STARPrice
});

const PoolSummary: React.FC = () => {
  const { stabilityDeposit, starBalance, STARPrice } = useLiquitySelector(selector);
  const balance = format(starBalance);
  const deposited = format(stabilityDeposit.currentSTAR);
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);

  return (
    <Box flex={1}>
      <Flex justifyContent={"space-between"}>
        <Text textStyle="title3" textAlign={["center", "left"]} pb={6} px={1}>
          Stability Pool Summary
        </Text>
        <Flex mr={"2em"}>
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
      <Divider mb={5} height="0.5px" opacity="0.4" />
      <Collapse in={show}>
        <>
          <Flex>
            <StatColumn
              iconName="STAR"
              amount={getNum(deposited, 2)}
              units="STAR"
              description="Deposited in Stability Pool"
            />
            <Spacer />
            <StatColumn
              iconName="STAR"
              amount={getNum(balance, 2)}
              units="STAR"
              description="STAR Balance in Wallet"
            />
          </Flex>

          {/* <Text textStyle="title3" textAlign="center" pt={10} color="purple">
        STAR Price: ${STARPrice.toString(3)}
      </Text> */}
        </>
      </Collapse>
    </Box>
  );
};

export default PoolSummary;
