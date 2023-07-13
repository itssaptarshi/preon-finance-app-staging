// @ts-nocheck
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import { VStack, Button, Flex, Text, Stack, Center, Divider, Link } from "@chakra-ui/react";
import Checkbox from "./Checkbox";
import { useLiquity } from "../hooks/LiquityContext";
import logo from "../components/Navbar/assets/logo.svg";

export type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  infographSrc?: string;
  mode?: string;
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, header, infographSrc = "", mode = "" }) => {
  const [showInfograph, setShowInfograph] = useState(false);
  const [understandDisclaimer, setUnderstandDisclaimer] = useState(false);
  const [understandDisclaimerError, setUnderstandDisclaimerError] = useState(false);
  const { account } = useLiquity();
  const onSubmit = (): void => {
    if (mode == "") {
      if (!understandDisclaimer) {
        setUnderstandDisclaimerError(true);
      } else {
        localStorage.setItem(account + "agreedToPreonFinanceDisclaimerMainnet", "agreed");
        onClose();
      }
    } else if (mode == "borrow") {
      localStorage.setItem(account + "agreedToPreonBorrowInfograph", "agreed");
      onClose();
    } else if (mode == "vePREON") {
      localStorage.setItem(account + "agreedToPreonvePREONInfograph", "agreed");
      onClose();
    } else if (mode == "farm") {
      localStorage.setItem(account + "agreedToPreonFarmInfograph", "agreed");
      onClose();
    }
  };

  const onSubmit2 = (): void => {
    if (!understandDisclaimer) {
      setUnderstandDisclaimerError(true);
    } else {
      localStorage.setItem(account + "agreedToPreonFinanceDisclaimerMainnet", "agreed");
      setShowInfograph(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalHeader fontSize="2xl" pb={2}>
          {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") == undefined
            ? "Disclaimer: Risks of Using Protocol"
            : header}
        </ModalHeader>
        <ModalBody>
          <Stack spacing={3}>
            {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
              undefined && (
              <>
                <Text fontWeight="bold">Use at Your Own Risk:</Text>
                <Text>
                  Preon Finance is a novel, decentralized borrowing protocol that allows users to
                  deposit assets and borrow the protocol’s native stablecoin, STAR, against them. The
                  Preon Finance protocol is made up of both proprietary and free, public, and
                  open-source software.
                </Text>
                <Text>
                  Your use of Preon Finance involves various risks, including, but not limited, to
                  losses while digital assets are deposited into Preon Finance via smart contract or
                  economic exploits, and losses due to liquidations and redemptions.
                </Text>
                <Text>
                  Before borrowing, staking, or liquidity providing you should fully review our{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://techdocs.preon.finance/"}
                    style={{ outline: "none", textDecoration: "underline" }}
                  >
                    technical documentation
                  </a>{" "}
                  to understand how the Preon Finance protocol works.
                </Text>
                <Text>
                  While the Preon Finance Decentralized Finance Protocol has been thoroughly audited
                  by multiple independent software security firms and undergone third-party economic
                  analysis, there remains a risk that assets deposited into the protocol as well as
                  the STAR and PREON tokens may suffer complete and permanent economic loss should
                  the protocol’s technical or economic mechanisms suffer catastrophic failure.
                </Text>
                <Text>
                  THE PREON FINANCE PROTOCOL IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT
                  WARRANTIES OF ANY KIND. No developer or entity involved in creating the PREON
                  FINANCE PROTOCOL will be liable for any claims or damages whatsoever associated
                  with your use, inability to use, or your interaction with other users of the Preon
                  Finance protocol, including any direct, indirect, incidental, special, exemplary,
                  punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or
                  anything else of value.
                </Text>
              </>
            )}
            {mode == "borrow" &&
            localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") != undefined ? (
              <Text>
                Deposit Collateral like wMATIC, stMATIC, wETH and wBTC into your trove. Get out our
                stablecoin STAR, all while earning yield on your collateral!
              </Text>
            ) : mode == "vePREON" &&
              localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") !=
                undefined ? (
              <Text>
                vePREON will be used to boost{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    "https://techdocs.preon.finance/earning-with-preon-finance/avax-star-lp-farming"
                  }
                  style={{ outline: "none", textDecoration: "underline" }}
                >
                  liquidity provider
                </a>{" "}
                rewards, boost{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    "https://techdocs.preon.finance/how-does-preon-finance-work/stability-pool-and-liquidations"
                  }
                  style={{ outline: "none", textDecoration: "underline" }}
                >
                  stability pool
                </a>{" "}
                rewards, or reduce fees.
              </Text>
            ) : mode == "farm" &&
              localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") !=
                undefined ? (
              <Text>
                Stake STAR in the Stability Pool to get PREON rewards, as well as a portion of
                liquidation rewards!
              </Text>
            ) : (
              <></>
            )}
          </Stack>
          <Center mt={5}>
            {mode != "" &&
              localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") !=
                undefined && <img src={logo} alt="Preon Finance" style={{ textAlign: "center" }} />}
          </Center>
          {mode == "farm" &&
            localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") != undefined && (
              <>
                <Divider mb={8} height="0.5px" opacity="0.4" />
                <Stack spacing={3}>
                  <Text mb={5}>
                    Pair STAR with MATIC on Uniswap, and deposit your LP tokens to earn PREON!{" "}
                  </Text>
                </Stack>
                {/* <img src={logo} alt="Preon Finance" style={{ textAlign: "center" }} /> */}
              </>
            )}
        </ModalBody>
        <ModalFooter justifyContent={"center"}>
          <VStack>
            {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
              undefined && (
              <Flex mb={1} mt={2}>
                <Checkbox
                  isChecked={understandDisclaimer}
                  onChange={() => setUnderstandDisclaimer(!understandDisclaimer)}
                  error={understandDisclaimerError}
                  label="I understand the risks and would like to proceed."
                  popup={true}
                />
              </Flex>
            )}
            {mode != "" &&
            localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") == undefined ? (
              <Button variant="gradient" mr={3} onClick={onSubmit2}>
                Proceed
              </Button>
            ) : (
              <Button variant="gradient" mr={3} onClick={onSubmit}>
                Proceed
              </Button>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Popup;
