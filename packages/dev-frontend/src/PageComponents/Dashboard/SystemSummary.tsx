import React, { useEffect, useState } from "react";
import { Flex, Box, Text, Spacer, Divider, IconButton, Collapse } from "@chakra-ui/react";
// import StatColumn from "../StatColumn";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, getNum } from "../../Utils/number";

import { TextRow, TitleTextRow, Icon } from "../../components";

const selector = ({
  starInStabilityPool,
  STARPrice,
  prices,
  farm,
  total,
  decimals,
  boostedFarm,
  PREONPrice
}: LiquityStoreState) => ({
  starInStabilityPool,
  STARPrice,
  prices,
  farm,
  total,
  decimals,
  boostedFarm,
  PREONPrice
});

const SystemSummary: React.FC = () => {
  const {
    starInStabilityPool,
    STARPrice,
    prices,
    farm,
    total,
    decimals,
    boostedFarm,
    PREONPrice
  } = useLiquitySelector(selector);

  let totalSystemUSD = 0;
  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);

  Object.keys(total.collaterals).map(address => {
    totalSystemUSD += format(
      total.collaterals[address]
        .mul(prices[address])
        .mul(10 ** (18 - format(decimals[address])))
        .div(1e18)
    );
  });

  // TODO
  const LPPrice = format(STARPrice);
  const TVL =
    totalSystemUSD +
    format(farm.totalLPStaked.add(boostedFarm.totalLPStaked)) * LPPrice +
    format(starInStabilityPool);

  const [CurvePoolData, setCurvePoolData] = useState({
    liquidity: {
      value: 0,
      usd: 0
    }
  });

  const [PLPPoolData, setPLPPoolData] = useState({
    USDC: {
      Deposits: {
        value: 0,
        usd: 0
      }
    },
    STAR: {
      Deposits: {
        value: 0,
        usd: 0
      }
    }
  });
  useEffect(() => {
    // ! TODO: #apy changes #staticValue
    const curvePoolUrl = "https://api.preon.finance/v1/CurvePool"; //this url is not returning any value #staticvalue
    const plpPoolUrl = "https://api.preon.finance/v1/PLPPool"; //this url is not returning any value #staticvalue
    const fetchData = async () => {
      try {
        const curveResponse = await fetch(curvePoolUrl, {
          method: "GET",
          mode: "cors"
        });
        const plpResponse = await fetch(plpPoolUrl, {
          method: "GET",
          mode: "cors"
        });
        setCurvePoolData(await curveResponse.json());
        setPLPPoolData(await plpResponse.json());
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  console.log("plpool1", CurvePoolData);
  console.log("plpool2", PLPPoolData);

  // added a new variable and conditionally assigned static value to show on frontend #staticvalue
  let curveTemp = getNum(CurvePoolData?.liquidity.usd, 4);
  if (curveTemp == "0.0000") {
    curveTemp = "4,582.64";
  } else {
    curveTemp = getNum(CurvePoolData?.liquidity.usd, 4);
  }

  // added a new variable and conditionally assigned static value to show on frontend #staticvalue
  let pplTemp = getNum(PLPPoolData?.USDC?.Deposits.usd + PLPPoolData?.STAR?.Deposits.usd, 4);
  if (pplTemp == "0.0000") {
    pplTemp = "7,121.34";
  } else {
    pplTemp = getNum(PLPPoolData?.USDC?.Deposits.usd + PLPPoolData?.STAR?.Deposits.usd, 4);
  }

  // added a new variable and conditionally assigned static value to show on frontend #staticvalue
  let totalTemp = getNum(
    CurvePoolData?.liquidity.usd + PLPPoolData?.USDC?.Deposits.usd + PLPPoolData?.STAR?.Deposits.usd,
    4
  );

  if (totalTemp == "0.0000") {
    totalTemp = "11,703.98";
  } else {
    totalTemp = getNum(
      CurvePoolData?.liquidity.usd +
        PLPPoolData?.USDC?.Deposits.usd +
        PLPPoolData?.STAR?.Deposits.usd,
      4
    );
  }

  return (
    <Flex flexDirection="column" flex={1} px={2}>
      <Flex justifyContent={"space-between"}>
        <Text textStyle="title3" textAlign={["center", "left"]} pb={6} px={1}>
          Protocol Overview
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
          <Flex align="center">
            <Text fontSize="50px" mb={5} mr={4} color="purple">
              ${STARPrice.toString(3)}
            </Text>
            <Text fontSize="20px" mb={5} color="white">
              STAR Price
            </Text>
          </Flex>

          <Flex align="center">
            <Text fontSize="50px" mb={5} mr={4} color="purple">
              ${PREONPrice.toString(3)}
            </Text>
            <Text fontSize="20px" mb={5} color="white">
              PREON Price
            </Text>
          </Flex>
          <Divider mb={5} height="0.5px" opacity="0.4" />

          <TitleTextRow mb="20px" title="Total Value Locked:" units="$" amount={getNum(TVL, 4)} />
          <Flex flexDirection="column" ml="16px">
            <TextRow title="System Total Collateral:" amount={"$" + getNum(totalSystemUSD, 4)} />
            <TextRow
              title="Stability Pool Deposits:"
              amount={"$" + getNum(format(starInStabilityPool), 4)}
            />
            <TextRow
              title="Curve STAR LP Token Staked:"
              amount={
                "$" + getNum(format(farm.totalLPStaked.add(boostedFarm.totalLPStaked)) * LPPrice, 4)
              }
            />
          </Flex>
          <Divider mt={5} height="0.5px" opacity="0.4" />
        </>
      </Collapse>

      {/* // ? stable coin - all 0s */}
      {/* <TitleTextRow
        my="20px"
        title="Stablecoin Liquidity:"
        units="$"
        amount={getNum(
          CurvePoolData?.liquidity.usd +
            PLPPoolData?.USDC?.Deposits.usd +
            PLPPoolData?.STAR?.Deposits.usd,
          4
        )}
      />
      <Flex flexDirection="column" ml="16px">
        <TextRow title="Curve STAR Pool:" amount={"$" + getNum(CurvePoolData?.liquidity.usd, 4)} />
        <TextRow
          title="Platypus STAR/USDC Pool:"
          amount={"$" + getNum(PLPPoolData?.USDC?.Deposits.usd + PLPPoolData?.STAR?.Deposits.usd, 4)}
        />
      </Flex> */}
    </Flex>
  );
};

export default SystemSummary;
