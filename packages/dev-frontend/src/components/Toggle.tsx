// @ts-nocheck
import React, { useState } from "react";

import { Tab, TabList, Tabs, Text, TabsProps } from "@chakra-ui/react";

import { Option } from "../Types";

export type ToggleProps = {
  options: any | Option[];
  size: "sm" | "md" | "lg";
  onChange: (key: string) => void;
};

const Toggle: React.FC<ToggleProps> = ({ options, size, onChange }) => {
  const [toggleIndex, setToggleIndex] = useState(0);

  const handleToggleChange = (index: number) => {
    setToggleIndex(index);
    onChange(options[index].key);
  };

  return (
    <Tabs
      padding="1rem"
      variant="unstyled"
      size={size}
      w="100%"
      h="fit-content"
      bg="brand.1100"
      borderRadius="5"
      index={toggleIndex}
      onChange={handleToggleChange}
    >
      <TabList h="100%">
        {/*  @ts-expect-error */}
        {options.map((option, index) => (
          <Tab
            key={option.key + option.value + index}
            borderRadius="5"
            w="90%"
            padding="1rem"
            px={3}
            py={1}
            color="white"
            fontSize={size}
            fontWeight={600}
            _hover={{ color: "white" }}
            _selected={{ color: "white", bg: "gradient" }}
            _focus={{ outline: "none" }}
          >
            <Text>{option.value}</Text>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default Toggle;
