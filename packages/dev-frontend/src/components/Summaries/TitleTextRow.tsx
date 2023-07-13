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

export interface TitleTextRowProps extends Omit<ChakraTextProps, "css"> {
  title: string;
  amount: any;
  units?: string;
  tooltip?: string;
  msg?: string;
}

const TitleTextRow: React.FC<TitleTextRowProps> = ({
  title,
  amount,
  units,
  tooltip,
  msg,
  ...textProps
}) => (
  <Flex flexDirection="row" alignItems="center" spacing={1} mx={1} flex={1} gap="4px">
    <Text
      bg="linear-gradient(90deg, #C157F9 7.55%, #DC99FF 95.28%)"
      backgroundClip="text"
      fontWeight="600"
      fontSize="16px"
      lineHeight="22px"
      letterSpacing="0.1em"
      textTransform="uppercase"
      {...textProps}
    >
      {title}
    </Text>
    <Spacer height="2px" />
    <Text
      bg="linear-gradient(90deg, #C157F9 7.55%, #DC99FF 95.28%)"
      position="relative"
      backgroundClip="text"
      fontWeight="600"
      fontSize="16px"
      lineHeight="22px"
      letterSpacing="0.1em"
      textTransform="uppercase"
      {...textProps}
    >
      {units && <>{units}</>}
      {amount}
    </Text>
  </Flex>
);

export default TitleTextRow;
