import React, { useState } from "react";
import { Box, Flex, Text, Button, Tr, Td } from "@chakra-ui/react";
import { TokenTable } from "../../components";
import moment from "moment";

import { format } from "../../Utils/number";
import { useTransactionFunction } from "../../components/Transaction";
import useVesting from "./store/useVesting";
import { useLiquity } from "../../hooks/LiquityContext";

export default function TestTable({ nfts, getUserNfts, setManageNft }) {
  const [tokenId, setTokenId] = useState(0);
  const { liquity, account } = useLiquity();

  const [rageQuit] = useTransactionFunction(
    "rageQuit",
    liquity.send.rageQuit.bind(liquity.send, tokenId)
  );

  const rageQuitHandler = async id => {
    if (!id) {
      return;
    }

    setTokenId(() => id);
    rageQuit();
  };

  return (
    <Box layerStyle="card" flex={1} margin="2" mt={6}>
      <Flex>
        <Text textStyle="title2" mb={5}>
          Vesting
        </Text>
      </Flex>
      <Flex
        backgroundColor="brand.1100"
        borderRadius="5"
        flex={1}
        mr={[0, null, 0]}
        mb={5}
        p={3}
        pt={2}
      >
        <TokenTable
          headers={["TokenId", "Vest Amount", "Vest Value", "Vest Expires", "Actions"]}
          width={8}
        >
          {nfts &&
            nfts.map(nft => {
              return (
                <>
                  <Tr key={nft.tokenId}>
                    {/* // * tokenId */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {format(nft?.id)}
                        </Text>
                      </Flex>
                    </Td>
                    {[...new Array(3)].map(_ => (
                      <Td pb={0} pt={4} />
                    ))}
                    {/* // * vest amount */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {format(+nft?.lockAmount / 1e18).toFixed(3)}
                        </Text>
                      </Flex>
                    </Td>
                    {/* // * vest value */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {format(+nft?.lockValue / 1e18).toFixed(3)}
                        </Text>
                      </Flex>
                    </Td>
                    {/* // * expiry date */}
                    <Td>
                      <Flex align="center">
                        <Text ml={3} whiteSpace="pre-wrap">
                          {moment.unix(nft?.lockEnds).format("DD MMM YYYY")}
                        </Text>
                      </Flex>
                    </Td>
                    {/* // * actions */}
                    <Td>
                      <Flex align="center">
                        <Text whiteSpace="pre-wrap">
                          <Flex align={"center"} justifyContent={"space-around"} gap={2}>
                            <Button
                              onClick={() => rageQuitHandler(nft?.id)}
                              variant="gradient"
                              size="xs"
                            >
                              Rage Quit
                            </Button>
                            <Button
                              onClick={() => setManageNft(() => nft)}
                              variant="gradient"
                              size="xs"
                            >
                              Manage
                            </Button>
                          </Flex>
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                </>
              );
            })}

          {/* if not nft found */}
          {!nfts.length && (
            <Text textStyle="title3" marginTop={"1em"}>
              No Nfts Found!
            </Text>
          )}
        </TokenTable>
      </Flex>
    </Box>
  );
}
