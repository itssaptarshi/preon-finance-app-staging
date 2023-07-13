// @ts-nocheck
import React from "react";

import { Flex, Checkbox as ChakraCheckBox, Text, BoxProps, VStack } from "@chakra-ui/react";

export type CheckboxProps = {
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  label: string;
  popup?: boolean;
} & BoxProps;

const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  onChange,
  error,
  label,
  popup = false,
  ...props
}) => {
  return (
    <Flex direction="column" {...props}>
      {popup ? (
        <VStack>
          <Flex>
            <ChakraCheckBox
              colorScheme={"purple"}
              sx={{ "[data-checked]": { borderColor: "purple", backgroundColor: "#C157F9" } }}
              size="lg"
              isChecked={isChecked}
              onChange={onChange}
            />
            <Text ml={5} textStyle="body3" color="purple">
              {label}
            </Text>
          </Flex>
          {error && (
            <Text mt={3} textStyle="body3" color="secondary.500">
              You must check this box to continue.
            </Text>
          )}
        </VStack>
      ) : (
        <>
          <Flex>
            <ChakraCheckBox
              sx={{ "[data-checked]": { borderColor: "purple", backgroundColor: "#C157F9" } }}
              size="lg"
              isChecked={isChecked}
              onChange={onChange}
            />
            <Text ml={5} textStyle="body3" color="purple">
              {label}
            </Text>
          </Flex>
          {error && (
            <Text mt={3} textStyle="body3" color="secondary.500">
              You must check this box to continue.
            </Text>
          )}
        </>
      )}
    </Flex>
  );
};

export default Checkbox;
