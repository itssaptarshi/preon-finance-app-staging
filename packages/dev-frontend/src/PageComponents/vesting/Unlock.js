import { Box, Button, Divider, Flex, Spacer, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import useVesting from "./store/useVesting";
import { useLiquity } from "../../hooks/LiquityContext";
import { useTransactionFunction } from "../../components/Transaction";

export default function Unlock({ selectedNft, endUnixToken }) {
  const [tokenId, setTokenId] = useState(0);
  const { liquity, account } = useLiquity();
  const [nftEndUnix, setNftEndUnix] = useState(false);

  const [unlock] = useTransactionFunction("unlock", liquity.send.unlock.bind(liquity.send, tokenId));

  const handleUnlock = () => {
    setTokenId(() => +selectedNft?.id);
    unlock();
  };

  const [getLockEnded] = useTransactionFunction(
    "getLockEnded",
    liquity.send.getLockEnded.bind(liquity.send, tokenId)
  );

  // useEffect(() => {
  //   // async function _check() {
  //     setTokenId(() => +selectedNft?.id);
  //     getLockEnded();
  //     // const _result = await endUnixToken(+selectedNft?.id);
  //     // console.log("check if ended", +_result);
  //     // setNftEndUnix(() => +_result);
  //   // }

  //   // _check();
  // }, []);

  return (
    <>
      <Box layerStyle="card" flex={1} margin="2">
        {!selectedNft && (
          <Text textStyle="title3" mt={-3}>
            Select "Manage" from Vesting Table
          </Text>
        )}

        {selectedNft && (
          <div>
            <Text textStyle="title2" mt={-3} color="purple">
              Unlock NFT #{+selectedNft?.id}
            </Text>
            <Spacer />

            <Divider mt={3} height="0.5px" opacity="0.4" />

            {moment().unix() <= nftEndUnix && (
              <Text textStyle="title4">
                You can unlock your token after{" "}
                {moment.unix(selectedNft?.lockEnds).format("DD MMM YYYY")}
              </Text>
            )}

            {moment().unix() >= nftEndUnix && (
              <>
                <Flex mt={5}>
                  <Text textStyle="title4">
                    Your lock has expired. Please withdraw your lock before you can re-lock.
                  </Text>
                </Flex>
                <Flex justifyContent={"right"} pb={1} mt={3}>
                  <Button
                    variant="gradient"
                    onClick={() => {
                      handleUnlock();
                    }}
                  >
                    Unlock
                  </Button>
                </Flex>
              </>
            )}
          </div>
        )}
      </Box>
    </>
  );
}
