// @ts-nocheck
import React, { useState, useEffect } from "react";

import ProgressBar from "../../components/ProgressBar";
import CoinAmount from "../../components/CoinAmount";
import { useTransactionFunction, useMyTransactionState } from "../../components/Transaction";
import { capitalizeFirstLetter } from "../../Utils/string";
import { Decimal } from "@liquity/lib-base";
import { LiquityStoreState, updateVePreonParams } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { format, formatWithDecimals, getNum } from "../../Utils/number";

import { useLiquity } from "../../hooks/LiquityContext";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton
} from "@chakra-ui/modal";
import { Flex, Text, Button, Spacer, HStack, useDisclosure, Tag } from "@chakra-ui/react";
import { SiEventstore } from "react-icons/si";
import Tooltip from "../../components/Tooltip";
import TransactionModal from "../../components/TransactionModal";
import { contractAddresses } from "../../config/constants";

export type ConfirmVEStakeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "deposit" | "withdraw";
  amount: string;
  total: number;
  values: Record<string, any>;
  name: string;
  fromUnallocated: boolean;
};
const selector = ({ preonBalance, vePREONStaked }: LiquityStoreState) => ({
  preonBalance,
  vePREONStaked
});

const BOOSTED_FARM = contractAddresses.boostedFarm.address;

const ConfirmVEStakeModal: React.FC<ConfirmVEStakeModalProps> = ({
  isOpen,
  onClose,
  mode,
  amount,
  total,
  values,
  name,
  fromUnallocated
}) => {
  const { preonBalance, vePREONStaked } = useLiquitySelector(selector);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const action = capitalizeFirstLetter(mode) == "Deposit" ? "Stake" : "Unstake";

  const { liquity, account } = useLiquity();
  var { userAddress } = liquity.connection;
  // console.log("111", userAddress);
  if (userAddress === undefined) {
    userAddress = "";
  }
  const { isOpen: isTxModalOpen, onOpen: onTxModalOpen, onClose: onTxModalClosed } = useDisclosure();

  const getFormattedValue = (value: string): number => {
    try {
      Decimal.from(value);
      return +value;
    } catch (err) {
      return 0;
    }
  };
  useEffect(() => {
    // let tot:Decimal = Decimal.ZERO
    // if (!(getFormattedValue(amount) == 0)) {
    //   tot = Decimal.from(amount)
    // }
    const open = isOpen;
    let interval: any = undefined;
    if (open) {
      interval = setInterval(async () => {
        const allowance = await checkAllowance(
          contractAddresses.preonToken.address,
          Decimal.from(getFormattedValue(amount))
        );
        if (allowance) {
          setStep(2);
        } else {
          setStep(1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [amount, isOpen]);

  let newAmount;
  // console.log("amount", amount)
  const formatedAmount = getFormattedValue(amount);
  if (mode === "deposit" && formatedAmount === format(preonBalance)) {
    newAmount = preonBalance;
  } else {
    // console.log('formatedAmount', formatedAmount)
    // console.log('format(preonStake.stakedPREON))', format(vePREONStaked.preonStake))
    if (formatedAmount === format(vePREONStaked.preonStake)) {
      // console.log("yo")
      newAmount = vePREONStaked.preonStake;
    } else if (!isNaN(formatedAmount)) {
      newAmount = Decimal.from(formatedAmount);
    } else {
      newAmount = Decimal.from(0);
    }
  }
  const updateParams: updateVePreonParams = {
    rewarder: fromUnallocated ? "0x0000000000000000000000000000000000000000" : BOOSTED_FARM,
    amount: newAmount.hex,
    isIncrease: mode === "deposit" ? true : false
  };

  const [sendTransaction] = useTransactionFunction(
    "ve-Preon",
    mode === "deposit"
      ? liquity.send.updateVEPREON.bind(liquity.send, [updateParams])
      : liquity.send.updateVEPREON.bind(liquity.send, [updateParams])
  );

  const transactionId = "stakePREON";
  const myTransactionState = useMyTransactionState(transactionId);

  const checkAllowance = async (token: string, amount: Decimal): Promise<boolean> => {
    const result = await liquity.getAllowanceOf(
      account,
      token,
      contractAddresses.vePREON.address,
      amount
    );

    return result;
  };

  /*
  Fixme:
  amount should be a number like depositSTARInStabilityPool
  **/
  const [approveTransaction] = useTransactionFunction(
    "approve",
    liquity.send.approveToken.bind(
      liquity.send,
      contractAddresses.preonToken.address,
      contractAddresses.vePREON.address,
      Decimal.from("10000000000000000000000000")
    )
  );

  const onApprove = () => {
    approveTransaction();
    setStep(1);
  };

  const totalVePreon = formatWithDecimals(vePREONStaked.vePREONTotal, 36);

  const onDeposit = () => {
    if (step === 2 || mode == "withdraw") {
      // console.log(mode);
      sendTransaction();
      onClose();
      delete values[name];
    }
  };

  let confirmStakeButtons = (
    <ModalFooter flexDirection="column">
      <HStack spacing={6}>
        <Button variant={step !== 1 ? "quaternary" : "gradient"} onClick={onApprove}>
          Approve
        </Button>

        <Button variant={step !== 2 ? "quaternary" : "gradient"} onClick={onDeposit}>
          {action}
        </Button>
      </HStack>
      <ProgressBar step={step === 2 ? 1 : 0} w="30%" mt={2} />
    </ModalFooter>
  );

  if (action == "Unstake") {
    confirmStakeButtons = (
      <ModalFooter flexDirection="column">
        <HStack spacing={6}>
          <Button colorScheme="red" variant="solid" onClick={onDeposit}>
            {action}
          </Button>
        </HStack>
      </ModalFooter>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" pb={1}>
            Confirm {action}
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <Flex>
              <Text fontSize="lg">{action} Amount:</Text>
              <Spacer />
              <CoinAmount
                amount={formatedAmount}
                token="PREON"
                fontWeight="bold"
                color="white"
                fontSize="md"
              />
            </Flex>
            <Flex mt={3}>
              <Text color="brand.200">New Total Staked PREON</Text>
              <Spacer />
              <CoinAmount amount={total} token="PREON" fontWeight="bold" />
            </Flex>
            {action === "Unstake" && (
              <Text textAlign="center" fontSize="lg" fontWeight="bold" mt={3} color="secondary.500">
                By unstaking any amount of PREON, you will lose ALL {getNum(totalVePreon, 3)}{" "}
                vePREON, accumulated over{" "}
                {getNum(
                  totalVePreon /
                    format(vePREONStaked.accumulationRate) /
                    format(vePREONStaked.totalUserPreon) /
                    86400,
                  0
                )}{" "}
                days
              </Text>
            )}
          </ModalBody>
          {confirmStakeButtons}
        </ModalContent>
      </Modal>
      <TransactionModal
        status={myTransactionState.type}
        isOpen={isTxModalOpen}
        onClose={onTxModalClosed}
      />
    </>
  );
};

export default ConfirmVEStakeModal;
