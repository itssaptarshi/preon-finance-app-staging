// @ts-nocheck
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Flex, Box, Text, Tr, Td, Spacer, useTheme } from "@chakra-ui/react";
import StatColumn from "../../PageComponents/Dashboard/StatColumn";
import { Icon, TokenTable } from "..";
import { Decimal, LiquityStoreState, TroveMappings } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import tokenData, { tokenDataMappingA } from "../../TokenData";
import { format, getNum, formatWithDecimals } from "../../Utils/number";
import { VC_explanation } from "../../Utils/constants";
import Tooltip from "../Tooltip";
import { useLiquity } from "../../hooks/LiquityContext";
import { calculateHealthStableTrove } from "../../PageComponents/Borrow/Trove/Trove.utils";
import StatRow from "./StatRow";
import TextRow from "./TextRow";

const selector = ({
  trove,
  prices,
  tokenBalances,
  total,
  safetyRatios,
  recoveryRatios,
  STARPrice,
  icr,
  decimals,
  farm,
  starInStabilityPool,
  underlyingPerReceiptRatios
}: LiquityStoreState) => ({
  trove,
  prices,
  tokenBalances,
  total,
  safetyRatios,
  recoveryRatios,
  STARPrice,
  icr,
  decimals,
  farm,
  starInStabilityPool,
  underlyingPerReceiptRatios
});

const BorrowSummary: React.FC = () => {
  let {
    trove,
    prices,
    tokenBalances,
    total,
    safetyRatios,
    recoveryRatios,
    STARPrice,
    icr,
    decimals,
    farm,
    starInStabilityPool,
    underlyingPerReceiptRatios
  } = useLiquitySelector(selector);
  const { liquity } = useLiquity();
  const { preon } = useTheme();
  let id = 1;

  tokenData.map(token => {
    return (token["troveBalance"] = formatWithDecimals(
      trove.collaterals[token.address],
      decimals[token.address].toNumber()
    ));
  });
  tokenData.map(
    token =>
      (token["walletBalance"] = formatWithDecimals(
        tokenBalances[token.underlying == "" ? token.address : token.underlying],
        token.underlyingDecimals
      ))
  );

  const depositedCollateral = tokenData.filter(
    token => token.walletBalance !== 0 || token.troveBalance !== 0
  );

  const heldCollateral = tokenData.filter(token => token.troveBalance !== 0);

  const collateralizationRatio = format(icr) * 100;
  console.log("collateralizationRatio :", collateralizationRatio);

  const totalBorrowed = format(trove.debt["debt"]);
  console.log("totalBorrowed :", totalBorrowed);

  // console.log("Preon airdrop secret link: https://bit.ly/IqT6zt");

  const ratioMapping: TroveMappings = {};
  const [ratios, setRatios] = useState<TroveMappings>(ratioMapping);

  let vcValue: number = 0;
  let usdValue: number = 0;
  let stableVC: number = 0;
  let stableUSD: number = 0;

  // console.log(usdValue)
  tokenData.map(token => {
    const curBal: Decimal = trove.collaterals[token.address];
    let vc: number;
    let usd: number;
    const safetyRatio = format(safetyRatios[token.address]);
    const dec = decimals[token.address].toNumber();
    if (curBal != undefined) {
      vc = format(prices[token.address]) * safetyRatio * formatWithDecimals(curBal, dec);
      vcValue += vc;
      usd = format(prices[token.address]) * formatWithDecimals(curBal, dec);
      usdValue += usd;
    } else {
      console.log("@prices", prices);
      vc =
        format(prices[token.address]) *
        safetyRatio *
        formatWithDecimals(trove.collaterals[token.address], dec);
      vcValue += vc;

      usd =
        format(prices[token.address]) * formatWithDecimals(trove.collaterals[token.address], dec);
      usdValue += usd;
    }
    //returning zero because isStable is false.
    if (token.isStable) {
      stableVC += vc;
      stableUSD += usd;
    }
  });
  // console.log('vcValue summary', vcValue)

  // const troveHealth =
  //   stableVC * 1.1 > totalBorrowed && stableVC / vcValue > 0.99
  //     ? 200 - (200 - 110) * Math.exp((-1 / 9) * (collateralizationRatio - 110))
  //     : collateralizationRatio;

  const getCollateralRatioDisplay = (collateralRatio: number) => {
    if (collateralRatio < 125) {
      return ["RedThermometer", "red.500"];
    } else if (collateralRatio < 165) {
      return ["YellowThermometer", "yellow.500"];
    } else {
      return ["GreenThermometer", "green.500"];
    }
  };

  const getTroveRiskynessMsg = () => {
    const riskeyness = ((vcValue - stableVC) / (totalBorrowed - stableVC)) * 100;
    const precentStable = (stableVC / vcValue) * 100;
    let safteyLable: string;
    let amountRoom: string;
    if (collateralizationRatio === 0) {
      return "";
    }
    if (stableUSD > totalBorrowed) {
      if ((collateralizationRatio * precentStable) / 100 < 112) {
        safteyLable = "risky";
        amountRoom = "not much";
      } else if ((collateralizationRatio * precentStable) / 100 < 114) {
        safteyLable = "medium risk";
        amountRoom = "some";
      } else {
        safteyLable = "safe";
        amountRoom = "a lot of";
      }
    } else if (riskeyness < 130) {
      safteyLable = "risky";
      amountRoom = "not much";
    } else if (riskeyness < 170) {
      safteyLable = "low-medium risk";
      amountRoom = "some";
    } else {
      safteyLable = "safe";
      amountRoom = "a lot of";
    }
    return `Your trove is comprised of ${precentStable.toFixed(3)}% stables${
      riskeyness > 0 ? `, with an ICR without stable coins of ${riskeyness.toFixed(3)}%.` : "."
    } We deem this as ${safteyLable} since there is ${amountRoom} room for your collateral prices to fall before reaching the liquidation threshold of 110%.`;
  };

  let totalSystemVC = 0;
  let totalSystemUSD = 0;
  let totalStableUSD = 0;

  Object.keys(total.collaterals).map(address => {
    const amountUSD = format(
      total.collaterals[address]
        .mul(10 ** (18 - format(decimals[address])))
        .mul(prices[address])
        .div(1e18)
    );
    totalSystemVC += amountUSD * format(recoveryRatios[address]);
    totalSystemUSD += amountUSD;
    // as tokendata is WMATIC and not stable, the value is not getting populated in totalStableUsd #staticvalue
    if (tokenDataMappingA[address] !== undefined && tokenDataMappingA[address].isStable) {
      totalStableUSD += amountUSD;
    }
  });
  // console.log("totalSystemVC", totalSystemUSD);
  const totalSystemRatio = Number.isNaN(totalSystemVC / format(total.debt["debt"]))
    ? 0
    : totalSystemVC / format(total.debt["debt"]);

  if (stableUSD == 0) {
    stableUSD = usdValue;
  }

  return (
    <Box layerStyle="base" pt={0} flex={1} px={2}>
      <Flex>
        <Text
          fontSize="50px"
          letterSpacing="0.1em"
          fontWeight="300"
          color="white"
          textTransform="uppercase"
          mt={8}
        >
          Borrow
        </Text>
      </Flex>
      <Text
        textStyle="title3"
        fontWeight="700"
        fontSize="24px"
        fontFamily="Merriweather"
        lineHeight="30px"
        textShadow="0px 0px 11px #AC88CF"
        textAlign={["center", "left"]}
        pb="16px"
        mb="36px"
        borderBottom={"1px solid rgba(255, 255, 255, 0.2)"}
        mt={"40px"}
      >
        My Current Loan
      </Text>
      <Flex direction={"column"} mb={5} px={6} gap="42px">
        <StatRow
          units="$"
          amount={`${getNum(totalBorrowed * +String(STARPrice), 2)}`} //STARPrice is returning zero, that is causing this to be zero.
          // Needs to be changed to STAR
          title="Borrowed STAR"
          description="Total value of STAR borrowd"
        />
        <StatRow
          percentage={true}
          units="$"
          amount={`${collateralizationRatio.toFixed(2)}%`}
          title="Collateralization Ratio"
          description="Ratio of risk adjusted value in trove to debt"
          msg={getTroveRiskynessMsg()}
        />
        <StatRow
          units="$"
          amount={`${getNum(usdValue, 2)}`}
          title="Total Collateral"
          description="Total amount of collateral"
        />
      </Flex>

      <Flex flexDirection="column" gap="8px" mt="50px">
        <TextRow
          fontSize="14px"
          lineHeight="24px"
          title="Trove Risk Adjusted Value"
          amount={getNum(vcValue, 2)}
          tooltip={VC_explanation}
        />
        {/* Need to uncomment when a stablecoin is added */}
        <TextRow
          fontSize="14px"
          lineHeight="24px"
          title="Trove Stablecoin Percentage:"
          amount={getNum((stableUSD / usdValue) * 100, 3) + "%"}
        />
        {/* It was Repeating #staticvalue */}
        {/* <TextRow
          fontSize="14px"
          lineHeight="24px"
          title="System Stablecoin Percentage:"
          amount={getNum((totalStableUSD / totalSystemUSD) * 100, 3) + "%" }
        /> */}
        {/* Need to uncomment */}
        {/* <TextRow
          fontSize="14px"
          lineHeight="24px"
          title="System Stablecoin Percentage:"
          amount={getNum((totalStableUSD / totalSystemUSD) * 100, 3) + "%"}
        /> */}
        <TextRow
          fontSize="14px"
          lineHeight="24px"
          title="System Collateral Ratio:"
          amount={(totalSystemRatio * 100).toFixed(3) + "%"}
        />

        {totalSystemRatio < 1.5 ? (
          <TextRow fontSize="14px" lineHeight="24px" title="RECOVERY Mode:" amount={"<150 %"} />
        ) : (
          <TextRow fontSize="14px" lineHeight="24px" title="Normal Mode:" amount={">150 %"} />
        )}
      </Flex>

      <Box
        overflowY={depositedCollateral.length > 10 ? "scroll" : undefined}
        maxHeight="30rem"
        sx={preon.scrollbarDashboard}
      >
        <TokenTable
          style={{
            marginRight: "10px",
            marginTop: "10px"
          }}
          headers={["Token", "Wallet Balance", "Trove Balance"]}
          // tooltips={["placeholder", "placeholder", "placeholder"]}
          width={5}
          display={["none", "block"]}
        >
          <>
            {depositedCollateral.map(token => (
              <Tr key={token.token + token.walletBalance}>
                <Td pb={0} pt={4}>
                  <Flex align="center">
                    <Icon
                      bg="rgba(255,255,255,1)"
                      p="2px"
                      borderRadius="1em"
                      iconName={token.token}
                      h={5}
                      w={5}
                    />
                    <Text ml={3}>{token.token}</Text>
                  </Flex>
                </Td>
                {[...new Array(2)].map((_, id) => (
                  <Td key={id} pb={0} pt={4} />
                ))}
                <Td pb={0} pt={4} color="purple">
                  {getNum(token.walletBalance)}
                </Td>
                <Td pb={0} pt={4} color="purple">
                  {/* // ! TODO: #pending #decimal maybe can add check if underlying/isVault then use this code; else can remove "10**18-token.decimals" */}
                  {/* ! TODO: if not vault and token < 18 */}
                  {+underlyingPerReceiptRatios[token.address] == 1 &&
                    +token.underlyingDecimals < 18 &&
                    getNum(token.troveBalance * format(underlyingPerReceiptRatios[token.address]))}

                  {/* ! TODO: if vault token */}
                  {!(
                    +underlyingPerReceiptRatios[token.address] == 1 && +token.underlyingDecimals < 18
                  ) &&
                    getNum(
                      token.troveBalance *
                        format(underlyingPerReceiptRatios[token.address]) *
                        10 ** (18 - token.underlyingDecimals)
                      // * 10 ** (18 - token.underlyingDecimals) // TODO: #decimal will need to check for its use case!
                    )}
                </Td>
              </Tr>
            ))}
          </>
        </TokenTable>
      </Box>

      {/* Mobile Table */}
      {heldCollateral.length !== 0 && (
        <TokenTable
          headers={["Token", "Trove Balance"]}
          // tooltips={["placeholder", "placeholder"]}
          width={2}
          display={["block", "none"]}
        >
          <>
            {heldCollateral.map(token => (
              <Tr key={token.token + token.walletBalance}>
                <Td pb={0} pt={4}>
                  <Flex align="center">
                    <Icon iconName={token.token} h={5} w={5} />
                    <Text ml={3}>{token.token}</Text>
                  </Flex>
                </Td>
                <Td pb={0} pt={4}>
                  {getNum(token.troveBalance)}
                </Td>
              </Tr>
            ))}
          </>
        </TokenTable>
      )}
    </Box>
  );
};

export default BorrowSummary;
