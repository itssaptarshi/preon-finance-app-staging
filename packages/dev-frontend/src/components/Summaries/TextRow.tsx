// @ts-nocheck
import React from "react";
import {
  Flex,
  Spacer,
  Text,
  TextProps as ChakraTextProps,
  Tooltip as ChakraTooltip
} from "@chakra-ui/react";
import Icon from "../Icon";
import Tooltip from "../Tooltip";

export interface TextRowProps extends Omit<ChakraTextProps, "css"> {
  title: string;
  amount: any;
  tooltip?: string;
  msg?: string;
}

const TextRow: React.FC<TextRowProps> = ({ title, amount, units, tooltip, msg, ...textProps }) => (
  <Flex flexDirection="row" alignItems="center" spacing={1} mx={1} flex={1} gap="4px">
    <Text color="whiteAlpha.600" {...textProps}>
      {title}
    </Text>
    <Spacer height="2px" my="auto" borderBottom={"1px dashed rgba(255, 255, 255, 0.3);"} />
    <Text color="purple" {...textProps}>
      {units && <sup>{units}</sup>}
      {amount}
    </Text>
  </Flex>
);

export default TextRow;
