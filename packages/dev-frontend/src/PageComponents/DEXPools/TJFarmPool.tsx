// @ts-nocheck
import React from "react";
import { Box, Flex, Button, Spacer, Text, Tag, Center } from "@chakra-ui/react";
import { getNum } from "../../Utils/number";
import Icon from "../../components/Icon";
import { useState } from "react";
import { useEffect } from "react";

const TJFarmPool: React.FC = () => {
  const [JOEAPR, setJOEAPR] = useState(0);
  const [PREONAPR, setPREONAPR] = useState(0);
  const [poolAPR, setPoolAPR] = useState(0);
  useEffect(() => {
    const joeURL = "https://api.preon.finance/v1/FarmPool/JOE";
    const preonURL = "https://api.preon.finance/v1/FarmPool/PREON";
    const poolURL = "https://api.preon.finance/v1/FarmPool/pool";
    const fetchData = async () => {
      try {
        const joeResponse = await fetch(joeURL, {
          method: "GET",
          mode: "cors"
        });
        const preonResponse = await fetch(preonURL, {
          method: "GET",
          mode: "cors"
        });
        const poolResponse = await fetch(poolURL, {
          method: "GET",
          mode: "cors"
        });
        setJOEAPR(await joeResponse.json());
        setPREONAPR(await preonResponse.json());
        setPoolAPR(await poolResponse.json());
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Your Balance Card Modals */}
      <Box layerStyle="card" flex={1}>
        <Center alignItems="center" mb={7}>
          <Text textStyle="title3">
            <Icon iconName={"PREON"} h={10} w={10} /> PREON / <Icon iconName={"AVAX"} h={9} w={9} />{" "}
            AVAX Farm
          </Text>
        </Center>
        <Flex mb={7}>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              Pool APR: {getNum(poolAPR * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"PREON"} h={6} w={6} /> PREON APR: {getNum(PREONAPR * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Text textStyle="subtitle1" fontWeight="normal">
              <Icon iconName={"sJOE"} h={6} w={6} /> JOE APR: {getNum(JOEAPR * 100, 2)}%
            </Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={5}>
            <Tag bgColor="secondary.400">
              <Text textStyle="subtitle1">
                Total APR: {getNum(((poolAPR ? poolAPR : 0) + PREONAPR + JOEAPR) * 100, 2)}%
              </Text>
            </Tag>
          </Flex>

          <Spacer />
        </Flex>

        <Flex alignItems="center">
          <Spacer />
          {/* // ! TODO: #pending: Stake on Trader Joe */}
          <Button colorScheme="brand">
            {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://app.uniswap.org/#/tokens/polygon/${"0xcb37c9b27a6d1d02f10fa92c49d07a2e2c99d335"}`}
              style={{ outline: "none", textDecoration: "none" }}
            >
              Stake on Trader Joe
            </a>{" "}
          </Button>
          <Spacer />
        </Flex>
      </Box>
    </>
  );
};

export default TJFarmPool;
