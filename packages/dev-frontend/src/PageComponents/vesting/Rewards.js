import { Box, Button, Flex, Text, Select, Td, Tr, Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TokenTable } from "../../components";
import Tooltip from "../../components/Tooltip";
import { format } from "../../Utils/number";
import { contractAddresses } from "../../config/constants";
import { useTransactionFunction } from "../../components/Transaction";
import { useLiquity } from "../../hooks/LiquityContext";

export default function Rewards({ claimMany, nfts, claimable, selectedNft }) {
  const [tokenId, setTokenId] = useState(-1);
  const { liquity } = useLiquity();
  const [claimables, setClaimables] = useState({ star: "0", lp: "0" });
  const [token, settoken] = useState(0);

  const [claimReward] = useTransactionFunction(
    "claimReward",
    liquity.send.claimReward.bind(liquity.send, tokenId, token)
  );

  const selectNftId = event => {
    if (Number.isNaN(event.target.value)) {
      return;
    }
    setTokenId(() => +event.target.value);
  };

  const claimManyHandler = token => {
    let _nftTokens = nfts.map(_nft => _nft.id);
    if (_nftTokens.length) {
      claimMany(_nftTokens, token);
    }
  };

  const handleClaimReward = () => {
    setTokenId(() => tokenId);
    settoken(() => token);
    console.log("token", token);
    claimReward();
  };

  useEffect(() => {
    if (selectedNft?.id) {
      setTokenId(() => +selectedNft.id);

      async function _getClaimables() {
        const _starEarned = await claimable(+selectedNft.id, contractAddresses.starToken.address);
        const _lpEarned = await claimable(+selectedNft.id, contractAddresses.lpToken.address);

        setClaimables(_state => {
          return {
            ..._state,
            star: +_starEarned,
            lp: +_lpEarned
          };
        });
      }
      claimReward();
      _getClaimables();
    }
  }, selectedNft);

  return (
    <>
      <Box layerStyle="card" flex={1} margin="2">
        {tokenId > 0 && (
          <>
            <Flex>
              <Text textStyle="title3" mt={-3} mb={1} color="purple">
                vePREON Rewards #{tokenId}
                <Tooltip>
                  Rewards displayed are an estimation of the trading fees, voting rewards. For
                  details refer to our docs.
                </Tooltip>
              </Text>
            </Flex>

            <Flex>
              <Text textStyle="body1" mb={5}>
                Rewards displayed are an estimation of the trading fees, voting rewards. For details
                refer to our docs.
              </Text>
            </Flex>

            <Flex
              borderColor="white"
              borderRadius="5"
              flex={1}
              mr={[0, null, 0]}
              mb={5}
              p={3}
              pt={-2}
              backgroundColor="brand.1100"
            >
              <TokenTable headers={["Token", "You Earned", "Actions"]} width={8}>
                <>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap" ml={0}>
                          STAR
                        </Text>
                      </Flex>
                    </Td>
                    {[...new Array(5)].map(_ => (
                      <Td pb={0} pt={4} />
                    ))}

                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {format(claimables.star / 1e18).toFixed(3)}
                        </Text>
                      </Flex>
                    </Td>

                    {/* // * actions */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          <Flex align={"center"} justifyContent={"space-around"} gap={2}>
                            <Button onClick={() => handleClaimReward()} variant="gradient" size="xs">
                              Claim
                            </Button>
                          </Flex>
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap" ml={0}>
                          LP
                        </Text>
                      </Flex>
                    </Td>
                    {[...new Array(5)].map(_ => (
                      <Td pb={0} pt={4} />
                    ))}

                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {format(claimables.lp / 1e18).toFixed(3)}
                        </Text>
                      </Flex>
                    </Td>

                    {/* // * actions */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          <Flex align={"center"} justifyContent={"space-around"} gap={2}>
                            <Button onClick={() => handleClaimReward()} variant="gradient" size="xs">
                              Claim
                            </Button>
                          </Flex>
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                </>
              </TokenTable>
            </Flex>
            <Button
              onClick={() => claimManyHandler(contractAddresses.starToken.address)}
              variant="gradient"
            >
              claim all
            </Button>
          </>
        )}

        {tokenId < 0 && (
          <Flex>
            <Text textStyle="title3" mt={-3} mb={1}>
              Select "Manage" from Vesting Table
            </Text>
          </Flex>
        )}

        {/* <Flex>
          <Text textStyle="subtitle1" backgroundColor="gradient" p={5} m={5} borderRadius="100">
            Choose your NFT
          </Text>
          {nfts.length && (
            <Select
              width={"200px"}
              onChange={selectNftId}
              placeholder={`NFT #${tokenId}`}
              variant="gradient"
            >
              {nfts.map(nft => {
                return (
                  <option bgColor="brand.1100" color="white" value={+nft.id}>
                    NFT #{+nft.id}
                  </option>
                );
              })}
            </Select>
          )}
        </Flex> */}
      </Box>
    </>
  );
}
