import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Select,
  Text,
  VStack,
  useToast,
  UseToastOptions
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Icon } from "../../components";
import Tooltip from "../../components/Tooltip";
import { format } from "../../Utils/number";
import { useTransactionFunction } from "../../components/Transaction";
import useVesting from "./store/useVesting";
import { useLiquity } from "../../hooks/LiquityContext";

export default function Merge({ nfts, attachment }) {
  const [tokenId, setTokenId] = useState(0);
  const { liquity, account } = useLiquity();

  const [nftId1, setNftId1] = useState(0);
  const [nftId2, setNftId2] = useState(0);
  const [disable, setDisable] = useState(true);

  const [show, setShow] = React.useState(true);
  const handleToggle = () => setShow(!show);

  useEffect(() => {
    setTokenId(nfts.length);
    console.log("tokid", tokenId);
    if (nftId1 == 0 || nftId2 == 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [nfts, nftId1, nftId2]);

  const [merge] = useTransactionFunction(
    "merge",
    liquity.send.merge.bind(liquity.send, nftId1, nftId2)
  );

  const mergeHandler = () => {
    merge();
  };

  const handleChange = () => {
    console.log("option selected");
  };

  const handleAttachment = () => {
    attachment(nftId1);
  };

  return (
    <>
      <Box layerStyle="card" flex={1} margin="2">
        {tokenId >= 2 && (
          <>
            <Flex justifyContent={"space-between"}>
              <Text textStyle="title2" mt={-3} mb={1} color="purple">
                Merge NFTs <Tooltip>Merge Two NFTs.</Tooltip>
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
            <Collapse in={show}>
              <>
                <Text textStyle={"title3"} mt={3} mb={3}>
                  Choose Two NFTs to Merge
                  <Tooltip>Note : The first NFT will be merged into the second nft</Tooltip>
                </Text>

                <Flex mb={3}>
                  <Select
                    mr={6}
                    color="white"
                    placeholder="Please select one"
                    onChange={event => {
                      setNftId1(event.target.value);
                    }}
                  >
                    {nfts.map(nfts => (
                      <option style={{ backgroundColor: "black" }}>{format(nfts.id)}</option>
                    ))}
                  </Select>
                </Flex>
                <Flex mb={5}>
                  <Select
                    mr={6}
                    color="white"
                    placeholder="Please select one"
                    onChange={event => {
                      setNftId2(event.target.value);
                    }}
                  >
                    {nfts.map(nfts => (
                      <option style={{ backgroundColor: "black" }}>{format(nfts.id)}</option>
                    ))}
                  </Select>
                </Flex>
                <Flex justifyContent={"center"}>
                  <Button variant="gradient" disabled={disable} onClick={mergeHandler}>
                    {disable ? "Please Select Two NFTs to Merge" : "Merge Your NFTs"}
                  </Button>
                  {/* <Button onClick={handleAttachment}>Attachment</Button> */}
                </Flex>
                <Flex></Flex>
              </>
            </Collapse>
          </>
        )}
        {tokenId <= 1 && (
          <Flex>
            <Text textStyle="title2" mt={-3} mb={1} color="purple">
              You Don't Have Enough NFTs to Merge
              <Tooltip>You'll need two or more NFTs to use this feature</Tooltip>
            </Text>
          </Flex>
        )}
      </Box>
    </>
  );
}
