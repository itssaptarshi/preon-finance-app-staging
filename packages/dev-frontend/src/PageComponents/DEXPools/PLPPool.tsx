// @ts-nocheck
import React from "react";
import { Box, Flex, Button, Spacer, Text, Tag, Center } from "@chakra-ui/react";
import { getNum } from "../../Utils/number";
import Icon from "../../components/Icon";
import { useState } from "react";
import { useEffect } from "react";

const PLPPool: React.FC = () => {
  const [APRData, setAPRData] = useState({
    USDC: {
      PREON: { value: 0 },
      PTPBase: { value: 0 },
      TotalBase: { value: 0 }
    },
    STAR: {
      PREON: { value: 0 },
      PTPBase: { value: 0 },
      TotalBase: { value: 0 }
    }
  });

  useEffect(() => {
    const url = "https://api.preon.finance/v1/PLPPool";
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors"
        });
        setAPRData(await response.json());
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Box layerStyle="card" flex={1}>
        <Center alignItems="center" mb={7}>
          <Text textStyle="title3">
            <Icon iconName={"STAR"} h={10} w={10} /> STAR / <Icon iconName={"USDC"} h={9} w={9} />{" "}
            USDC Platypus Pool
          </Text>
        </Center>
        <Flex mb={7}>
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="bold">
              Deposit <Icon iconName={"STAR"} h={6} w={6} /> STAR:
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"PREON"} h={6} w={6} /> PREON APR:{" "}
              {getNum(APRData.STAR.PREON.value * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"PTP"} h={6} w={6} /> PTP Base APR:{" "}
              {getNum(APRData.STAR.PTPBase.value * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Tag bgColor="secondary.400">
              <Text textStyle="subtitle1">
                Total Base APR: {getNum(APRData.STAR.TotalBase.value * 100, 2)}%
              </Text>
            </Tag>
          </Flex>

          <Spacer />
        </Flex>
        <Flex mb={7}>
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="bold">
              Deposit <Icon iconName={"USDC"} h={6} w={6} /> USDC:
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"PREON"} h={6} w={6} /> PREON APR:{" "}
              {getNum(APRData.USDC.PREON.value * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"PTP"} h={6} w={6} /> PTP Base APR:{" "}
              {getNum(APRData.USDC.PTPBase.value * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Tag bgColor="secondary.400">
              <Text textStyle="subtitle1">
                Total Base APR: {getNum(APRData.USDC.TotalBase.value * 100, 2)}%
              </Text>
            </Tag>
          </Flex>

          <Spacer />
        </Flex>

        <Flex alignItems="center">
          <Spacer />
          <Button colorScheme="brand">
            {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={"https://app.platypus.finance/pool?pool_group=alt"}
              style={{ outline: "none", textDecoration: "none" }}
            >
              Stake on Platypus
            </a>{" "}
          </Button>
          <Spacer />
        </Flex>
      </Box>
    </>
  );
};

export default PLPPool;
