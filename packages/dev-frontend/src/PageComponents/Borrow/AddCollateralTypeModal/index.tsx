// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import {
  Flex,
  Text,
  Button,
  Input,
  Select,
  background,
  Divider,
  Box,
  Wrap,
  WrapItem,
  Center
} from "@chakra-ui/react";
import { Stack, VStack } from "@chakra-ui/react";

import Icon from "../../../components/Icon";
import { Collateral, CoinShow } from "../../../Types";
import { getNum, format } from "../../../Utils/number";
import { Form } from "react-final-form";
import Tooltip from "../../../components/Tooltip";
import tokenData, { tokenDataMappingT } from "../../../TokenData";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { AdjustInput } from "../../../components";

export type AddCollateralTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  availableCollateral: Collateral[];
  show?: any;
  setShow?: any;
  borrowMode: string;
};

// @ts-expect-error
const selector = ({ prices, total, safetyRatios }: LiquityStoreState) => ({
  prices,
  total,
  safetyRatios
});

const AddCollateralTypeModal: React.FC<AddCollateralTypeModalProps> = ({
  isOpen,
  onClose,
  availableCollateral,
  show,
  setShow,
  borrowMode
}) => {
  const { prices, total, safetyRatios } = useLiquitySelector(selector);
  const [toggle, setToggle] = useState(false);
  const [filteredCollaterals, setFilteredCollaterals] = useState(
    availableCollateral.filter(coin => (borrowMode !== "unlever" ? true : coin.troveBalance !== 0))
  );

  const [filterCollateralName, setFilterCollateralName] = useState("");

  console.log("Filtered Collateral", filteredCollaterals);
  // let filterCollateral = filteredCollaterals.filter(coin =>
  //   borrowMode !== "unlever" ? true : coin.troveBalance !== 0
  // );

  const onSubmit = (values: CoinShow) => {
    setShow({ ...show, ...values });
    onClose();
  };

  const sortTypes = ["Sort By Wallet Balance", "Sort By Safety Ratios", "Sort By System Deposit"];

  let sortList = sortTypes.map((item, index) => {
    return (
      <option style={{ backgroundColor: "black" }} key={index}>
        {item}
      </option>
    );
  });

  function sortCollateral(value) {
    let _local = [...filteredCollaterals];
    switch (value) {
      case "Sort By Wallet Balance":
        setFilteredCollaterals(() => _local.sort((a, b) => b.walletBalance - a.walletBalance));
        break;
      case "Sort By Safety Ratios":
        setFilteredCollaterals(() =>
          _local.sort(
            (a, b) =>
              ((1.1 / safetyRatios[tokenDataMappingT[b["token"]].address]) * 100).toFixed(2) -
              ((1.1 / safetyRatios[tokenDataMappingT[a["token"]].address]) * 100).toFixed(2)
          )
        );
        break;
      case "Sort By System Deposit":
        setFilteredCollaterals(() => _local.sort((a, b) => a.systemDeposit - b.sytemDeposit));
        break;
      default:
        setFilteredCollaterals(() => _local.sort((a, b) => b.walletBalance - a.walletBalance));
        break;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <Form
          onSubmit={onSubmit}
          initialValues={[]}
          render={({ values }) => (
            <>
              <ModalHeader fontSize="2xl" pb={2} textAlign={"center"}>
                Add Collateral Type
              </ModalHeader>
              <ModalBody>
                {/* <Box> */}
                {/* <VStack> */}
                <Flex justifyContent={"space-between"} w={"95%"}>
                  <Input
                    ml={3}
                    mb={2}
                    placeholder="Search"
                    onChange={e => setFilterCollateralName(e.target.value.toUpperCase())}
                  />
                </Flex>
                <Select
                  ml={3}
                  // style={{ backgroundColor: "purple" }}
                  w={"92%"}
                  mr={6}
                  name="sortSelect"
                  onChange={e => {
                    sortCollateral(e.target.value);
                  }}
                >
                  {/* <option value="sortBy" defaultValue={"sortByWalletBalance"}>
                    Sort By
                  </option> */}
                  {sortList}
                </Select>

                <Divider mt={4} mb={4} height="0.5px" opacity="0.4" />

                {filteredCollaterals
                  .filter(tokenName => {
                    if (!filterCollateralName) return true;
                    if (tokenName.token.includes(filterCollateralName)) {
                      return true;
                    }
                  })
                  .map(({ token, walletBalance, address }) => (
                    <VStack key={address}>
                      {/* <Flex p={"1rem"} variant="tokenSelect" backgroundColor={"brand.1100"}>{getNum(format(total.collaterals[address]), 2)}</Flex> */}
                      <Button
                        ml={2}
                        mr={2}
                        mt={2}
                        height="150px"
                        style={{ width: "300px", display: "inline-block" }}
                        backgroundColor={values[token] === true ? "#dc9de340" : "brand.1100"}
                        variant="tokenSelect"
                        bg={values[token] === true ? "brand.1100" : "brand.1100"}
                        borderColor={values[token] === true ? "purple" : "whiteAlpha.200"}
                        // my={-8}
                        onClick={() => {
                          values[token] = values[token] === true ? false : true;
                          setToggle(!toggle);
                        }}
                        key={token + format(safetyRatios[tokenDataMappingT[token].address])}
                      >
                        <Flex direction={"column"} justifyContent={"space-between"}>
                          <Flex direction={"row"} justifyContent={"space-between"} pt={3}>
                            <Flex align={"center"} flex={1}>
                              <Icon
                                bg="rgba(255,255,255,1)"
                                p="2px"
                                borderRadius="1em"
                                iconName={token}
                                h={6}
                                w={6}
                              />
                              <Text ml={3} mr={3} fontSize="20px">
                                {token}
                              </Text>
                              <Text flex={2} textAlign="right">
                                {getNum(walletBalance)}
                              </Text>
                            </Flex>
                          </Flex>
                          <Divider mt={4} mb={4} height="0.5px" opacity="0.4" />
                          <Flex direction={"column"}>
                            <Flex direction={"row"}>
                              <Text textStyle="body1" mr={3} pl={2} pr={2}>
                                System Deposit :
                              </Text>
                              <Text flex={2} textAlign="right">
                                {/* @ts-expect-error */}$
                                {/* #TODO!! pending, Temp fix, changed from {getNum(format(total.collaterals[address].mul(prices[address])), 2)} */}
                                {getNum(format(total.collaterals[address]), 2)}
                              </Text>
                            </Flex>
                            <Flex direction={"row"} pb={3}>
                              <Text textStyle="body1" mr={3} pl={2} pr={2}>
                                Safety Ratio :
                              </Text>
                              <Text flex={2} textAlign="right">
                                {getNum(format(safetyRatios[tokenDataMappingT[token].address]))}{" "}
                                <Tooltip>
                                  {"Effective Minimum Collateral Ratio: " +
                                    (
                                      (1.1 /
                                        format(safetyRatios[tokenDataMappingT[token].address])) *
                                      100
                                    ).toFixed(2) +
                                    "%"}
                                </Tooltip>
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Button>
                    </VStack>
                  ))}
                {/* </VStack> */}
                {/* </Box> */}
              </ModalBody>

              <ModalFooter justifyContent={"flex-start"}>
                <Button variant="gradient" mr={6} onClick={() => onSubmit(values)}>
                  Add
                </Button>

                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        />
      </ModalContent>
    </Modal>
  );
};

export default AddCollateralTypeModal;
