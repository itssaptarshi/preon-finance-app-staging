// @ts-nocheck
// @ts-nocheck
import React from "react";
import { Flex, Box, Text, Spacer, Divider, IconButton, Collapse } from "@chakra-ui/react";
import StatColumn from "./StatColumn";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, formatWithDecimals, getNum } from "../../Utils/number";
import { Icon } from "../../components";

const selector = ({ vePREONStaked, PREONPrice }: LiquityStoreState) => ({
  vePREONStaked,
  PREONPrice
});

const StakeSummary: React.FC = () => {
  const { vePREONStaked, PREONPrice } = useLiquitySelector(selector);
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);

  const veBalance = formatWithDecimals(vePREONStaked.vePREONTotal, 36);

  return (
    <Box flex={1}>
      <Flex justifyContent={"space-between"}>
        <Text textStyle="title3" textAlign={["center", "left"]} pb={6} px={1}>
          Stake Summary
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
          <StatColumn
            iconName="PREON"
            amount={getNum(veBalance, 2)}
            units="vePREON"
            description="Accrued"
          />
          {/* <Text textStyle="title3" textAlign="center" pt={10} color="purple">
          PREON Price: ${PREONPrice.toString(3)}
        </Text> */}
        </>
      </Collapse>
    </Box>
  );
};

export default StakeSummary;
