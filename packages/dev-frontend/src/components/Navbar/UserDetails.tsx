// @ts-nocheck
import React, { useState } from "react";
import { Text, Flex, Button, useDisclosure, background } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";
import Icon from "../Icon";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector, walletConnectConnector } from "../../connectors/injectedConnector";
import Toggle from "../Toggle";
import { useLiquity } from "../../hooks/LiquityContext";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { formatWalletAddress } from "../../Utils/string";
import { getNum, format } from "../../Utils/number";

// TODO: Fix LiquityStoreState type to include starBalance, preonBalance, PREONPrice
// @ts-expect-error
const selector = ({ starBalance, preonBalance, PREONPrice }: LiquityStoreState) => ({
  starBalance,
  preonBalance,
  PREONPrice
});

type UserDetailsProps = {
  onChange: any;
};

const UserDetails: React.FC<UserDetailsProps> = ({ onChange }) => {
  const { deactivate, active, error, connector } = useWeb3React<unknown>();
  const { account } = useLiquity();
  const { starBalance, preonBalance, PREONPrice } = useLiquitySelector(selector);
  const userStarBalance = format(starBalance);
  const userPreonBalance = format(preonBalance);
  const {
    liquity: {
      connection: { addresses }
    }
  } = useLiquity();

  const [log, setLog] = useState<string[]>([]);
  const addToken = (params: any) => {
    // @ts-ignore
    const func = window.ethereum.request;

    func({ method: "wallet_watchAsset", params }) //@ts-ignore
      .then(() => setLog([...log, "Success, Token added!"]))
      .catch((error: Error) => setLog([...log, `Error: ${error.message}`]));
  };

  const addStarToken = () => {
    addToken({
      type: "ERC20",
      options: {
        address: addresses["starToken"],
        symbol: "STAR",
        decimals: 18,
        image: "https://i.ibb.co/DCL8fhg/star-Token.png"
      }
    });
  };

  const addPreonToken = () => {
    addToken({
      type: "ERC20",
      options: {
        address: addresses["preonToken"],
        symbol: "PREON",
        decimals: 18,
        image: "https://i.ibb.co/fvT5sMy/PREON-LOGO.png"
      }
    });
  };
  async function deactivateWallet() {
    try {
      if (
        (await walletConnectConnector.getProvider()) != undefined &&
        (await walletConnectConnector.getProvider()).connected == true
      ) {
        walletConnectConnector.close();
      } else {
        deactivate();
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  return (
    <>
      <Flex align="center" direction={["column", null, "row"]} ml={"10px"} mr={"10px"}>
        <Flex align="center">
          <ChakraTooltip label={"Add PREON to Metamask"} placement="top">
            <Button variant="link" onClick={addPreonToken}>
              <Icon iconName="PREON" h={6} w={6} mr={2} />
              <Text textStyle="subtitle3" mr={3}>
                {getNum(userPreonBalance)} PREON
              </Text>
            </Button>
          </ChakraTooltip>
          <ChakraTooltip label={"Add STAR to Metamask"} placement="top">
            <Button variant="link" onClick={addStarToken}>
              <Icon iconName="STAR" h={6} w={6} mr={2} />
              <Text textStyle="subtitle3" mr={[0, null, 3]}>
                {getNum(userStarBalance)} STAR
              </Text>
            </Button>
          </ChakraTooltip>
          {/* <Text textStyle="walletAddress">{formatWalletAddress(account, 6, 4, 13)}</Text> */}
          <ChakraTooltip label={"Disconnect Wallet"} placement="top">
            {connector != undefined ? (
              <Button variant="link" onClick={deactivateWallet}>
                <Text textStyle="walletAddress">{formatWalletAddress(account, 6, 4, 13)}</Text>
              </Button>
            ) : (
              <Text textStyle="walletAddress">{formatWalletAddress(account, 6, 4, 13)}</Text>
            )}
          </ChakraTooltip>
          <Button colorScheme="brand" ml={4} variant="gradient">
            {/* // ! TODO: #pending: to change to buy preon url */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://app.uniswap.org/#/tokens/polygon/${"0xcb37c9b27a6d1d02f10fa92c49d07a2e2c99d335"}`}
              style={{ outline: "none", textDecoration: "none" }}
            >
              Buy PREON
            </a>
          </Button>
        </Flex>
        <Flex align="center" mt={[6, null, 0]}></Flex>
      </Flex>
    </>
  );
};

export default UserDetails;
