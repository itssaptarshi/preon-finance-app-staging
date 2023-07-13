// @ts-nocheck
import React, { useReducer } from "react";
import { Text, TextProps } from "@chakra-ui/react";
import { tokenDataMappingT } from "../TokenData";
import { useLiquitySelector } from "@liquity/lib-react";
import { LiquityStoreState } from "@liquity/lib-base";
import { format, getNum } from "../Utils/number";
import { connectionReducer } from "./WalletConnector";

type CurrencyConverterProps = {
  token: string;
  value: number;
  currency: string;
} & TextProps;

// TODO: FIX TYPES for LiquityStoreState to include underlyingPrices, PREONPrice, STARPrice, safetyRatios
const selector = ({ underlyingPrices, PREONPrice, STARPrice, safetyRatios }: any) => ({
  underlyingPrices,
  PREONPrice,
  STARPrice,
  safetyRatios
});

var dataSelector = useLiquitySelector;

const CurrencyConverterLabel: React.FC<CurrencyConverterProps> = ({
  token,
  value,
  currency,
  ...props
}) => {
  const [connectionState, dispatch] = useReducer(connectionReducer, { type: "inactive" });
  let converter = 1;
  const { safetyRatios } = dataSelector(selector);
  const collateral = tokenDataMappingT[token];
  const { underlyingPrices, PREONPrice, STARPrice } = dataSelector(selector);
  if (token !== "vePREON") {
    if (token === "STAR") {
      converter = format(STARPrice);
    } else if (token === "PREON") {
      converter = format(PREONPrice);
    } else {
      converter = format(underlyingPrices[collateral.address]);
    }
  }

  if (currency === "USD") {
    return (
      <Text as="span" textStyle="body3" color="purple" whiteSpace="nowrap" {...props}>
        {` ≈ ${value !== 0 && value < 0.001 ? "<" : ""} $${
          value !== 0 && value < 0.001 ? "0.001" : getNum(value * converter, 2)
        }`}
      </Text>
    );
  } else if (currency === "VC") {
    return (
      <Text as="span" textStyle="body3" color="purple" whiteSpace="nowrap" {...props}>
        {` ≈ $ ${getNum(value * converter, 2)}`} RAV
      </Text>
    );
  } else if (currency === "RAV") {
    return (
      <Text as="span" textStyle="body3" color="purple" whiteSpace="nowrap" {...props}>
        {` ≈ $ ${getNum(value * converter * format(safetyRatios[collateral.address]), 2)}`} RAV
      </Text>
    );
  } else if (currency === "STAREarned") {
    return (
      <Text as="span" textStyle="body3" color="purple" whiteSpace="nowrap" {...props}>
        {` ≈ ${getNum((value * converter) / format(STARPrice), 2)}`} STAR
      </Text>
    );
  } else {
    return (
      <Text as="span" textStyle="body3" color="purple" whiteSpace="nowrap" {...props}>
        {` ≈ ${getNum(value * converter, 2)}`} STAR
      </Text>
    );
  }
};

export default CurrencyConverterLabel;
