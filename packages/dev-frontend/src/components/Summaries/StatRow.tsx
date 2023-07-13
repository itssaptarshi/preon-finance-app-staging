// @ts-nocheck
import React from "react";
import {
  Flex,
  HStack,
  Center,
  Text,
  CircularProgress,
  CircularProgressLabel,
  TextProps as ChakraTextProps,
  Tooltip as ChakraTooltip
} from "@chakra-ui/react";
import Icon from "../Icon";
import Tooltip from "../Tooltip";

export interface StatRowProps extends Omit<ChakraTextProps, "css"> {
  iconName: string;
  amount: any;
  percentage?: boolean;
  units?: string;
  title: string;
  description: string;
  tooltip?: string;
  msg?: string;
}

const StatRow: React.FC<StatRowProps> = ({
  iconName,
  amount,
  percentage,
  units,
  title,
  description,
  tooltip,
  msg,
  ...textProps
}) => (
  <HStack align="center" spacing={1} mx={1} flex={1} gap="45px">
    <Flex
      flexDirection="column"
      alignItems="center"
      maxWidth="110px"
      minWidth="110px"
      maxHeight="55px"
      position="relative"
    >
      {percentage ? (
        <CircularProgress
          value={150}
          max={300}
          transform="rotate(-90deg)"
          size="110px"
          color="#C157F9"
          trackColor="transparent"
          thickness="6px"
        >
          <CircularProgressLabel
            position="absolute"
            left="8px"
            top="calc(50% - 16px)"
            transform="rotate(90deg)"
            background="linear-gradient(90deg, #C157F9 7.55%, #DC99FF 95.28%);"
            backgroundClip="text"
            textfillcolor="transparent"
          >
            <Text
              textStyle="purpleTitle3"
              fontSize="20px"
              lineHeight="36px"
              textAlign="center"
              background="linear-gradient(90deg, #C157F9 7.55%, #DC99FF 95.28%);"
              backgroundClip="text"
              textfillcolor="transparent"
              {...textProps}
            >
              {amount}
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
      ) : (
        <Flex flexDirection="column" alignItems="center" gap="2px">
          <Text
            textStyle="purpleTitle3"
            lineHeight="41px"
            pt={2}
            background="linear-gradient(90deg, #C157F9 7.55%, #DC99FF 95.28%);"
            backgroundClip="text"
            textfillcolor="transparent"
            {...textProps}
          >
            <sup>{units}</sup>
            {amount}
          </Text>
          <Text textStyle="body1" fontSize="14px" color="whiteAlpha.600" {...textProps}>
            {/* Needs to be changed un USD */}
            In USD
          </Text>
        </Flex>
      )}
    </Flex>
    <Flex align="center" flexDirection="column" alignItems="flex-start" gap="8px">
      <Text textStyle="body1" color="white" fontSize="16px" lineHeight="22px" fontWeight="600">
        {title}
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </Text>
      <Text
        textStyle="body1"
        color="whiteAlpha.600"
        fontSize="14px"
        lineHeight="16px"
        fontWeight="400"
      >
        {description} {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </Text>
    </Flex>
  </HStack>
);

export default StatRow;
