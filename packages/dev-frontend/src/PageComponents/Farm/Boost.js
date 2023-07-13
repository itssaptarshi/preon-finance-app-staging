// import { Box, Button, Collapse, Flex, IconButton, Select, Text } from "@chakra-ui/react";
// import React, { useState, useEffect } from "react";
// import { Icon } from "../../components";
// import { Form } from "react-final-form";
// import Tooltip from "../../components/Tooltip";
// import { format } from "../../Utils/number";
// import { useTransactionFunction, useMyTransactionState } from "../../components/Transaction";
// import { useLiquity } from "../../hooks/LiquityContext";

export default function Boost({ balances, nfts }) {
  // const [show, setShow] = React.useState(true);
  // const handleToggle = () => setShow(!show);
  // const [nftId, setNftId] = useState(0);
  // const { liquity, account } = useLiquity();
  // const [disable, setDisable] = useState(true);

  // useEffect(() => {
  //   if (nftId > 0) {
  //     setDisable(false);
  //   }else{
  //       setDisable(true)
  //   }
  //   console.log('i am running')
  // }, [nftId]);

  // const handleDetach = () => {
  //   console.log('handledetach')
  //   console.log(nftId)
  //   setNftId(0);
  //   console.log(nftId)
  // };

  // const [sendNftId] = useTransactionFunction(
  //   "stakeLPTokens"
  //     ? liquity.send.stakeLPTokens.bind(liquity.send, nftId)
  //     : liquity.send.stakeLPTokens.bind(liquity.send, nftId)
  // );

  return (
    // <Box layerStyle={"card"} flex={1}>
    //   <Flex justifyContent={"space-between"}>
    //     <Text textStyle="title2" mt={-3} mb={1} color="purple">
    //       Boost Your NFT
    //       <Tooltip>Boost Your NFT To Get Better Rewards</Tooltip>
    //     </Text>
    //    <Flex mr={"2em"}>
    //       {show ? (
    //         <IconButton
    //           aria-label="Expand Protocol Overview"
    //           size={"sm"}
    //           ml={3}
    //           onClick={handleToggle}
    //           variant="gradient"
    //           isRound={true}
    //           icon={<Icon iconName="CollapseIcon" />}
    //         />
    //       ) : (
    //         <IconButton
    //           aria-label="Expand Protocol Overview"
    //           size={"sm"}
    //           ml={3}
    //           onClick={handleToggle}
    //           variant="gradient"
    //           isRound={true}
    //           icon={<Icon style={{ transform: "rotate(180deg)" }} iconName="CollapseIcon" />}
    //         />
    //       )}
    //     </Flex>
    //   </Flex>
    //  <Collapse in={show}>
    //     <>
    //       <Flex>
    //         <Form
    //           onSubmit={() => {}}
    //           render={({ values }) => (
    //             <>
    //               <Flex w={"full"}>
    //                 <Select
    //                   mr={6}
    //                   mt={4}
    //                   color="white"
    //                   placeholder="Please select one"
    //                   onChange={event => {
    //                     setNftId(event.target.value);
    //                   }}
    //                 >
    //                   {nfts.map(nfts => (
    //                     <option value={format(nfts.id)}>NFT id #{format(nfts.id)}</option>
    //                   ))}
    //                 </Select>
    //                 <Button variant="gradient" mt={4} onClick={handleDetach}>
    //                   Detach the NFT
    //                 </Button>
    //               </Flex>
    //             </>
    //           )}
    //         />
    //       </Flex>
    //       <Flex flex={1} justifyContent={"center"}>
    //         <Button variant="gradient" mt={5} disabled={disable} onClick={sendNftId}>
    //           {disable?"Please Select a NFT From The Selector":"Boost Your NFT"}
    //         </Button>
    //       </Flex>
    //     </>
    //   </Collapse>
    // </Box>
    <></>
  );
}
