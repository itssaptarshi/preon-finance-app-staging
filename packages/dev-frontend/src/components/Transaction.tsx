// @ts-nocheck
import React, { useState, useContext, useEffect, useCallback } from "react";
// import { Flex, Text, Box } from "theme-ui";
import { Flex, Text, Button, Spacer, HStack, useDisclosure, Box } from "@chakra-ui/react";
import { Provider, TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import { hexDataSlice, hexDataLength } from "@ethersproject/bytes";
import { defaultAbiCoder } from "@ethersproject/abi";
import { Web3Provider } from "@ethersproject/providers";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { EthersTransactionOverrides, EthersTransactionCancelledError } from "@liquity/lib-ethers";
import { SentLiquityTransaction, LiquityReceipt } from "@liquity/lib-base";

import { useLiquity } from "../hooks/LiquityContext";
export let cancelCheck = true;

// import { Icon } from "./Icon";
// import { Tooltip, TooltipProps, Hoverable } from "./Tooltip";

const strokeWidth = 10;

const circularProgressbarStyle = {
  strokeLinecap: "butt",
  pathColor: "white",
  trailColor: "rgba(255, 255, 255, 0.33)"
};

const slowProgress = {
  strokeWidth,
  styles: buildStyles({
    ...circularProgressbarStyle,
    pathTransitionDuration: 30
  })
};

const fastProgress = {
  strokeWidth,
  styles: buildStyles({
    ...circularProgressbarStyle,
    pathTransitionDuration: 0.75
  })
};

type TransactionIdle = {
  type: "idle";
};

type TransactionFailed = {
  type: "failed";
  id: string;
  error: Error;
};

type TransactionWaitingForApproval = {
  type: "waitingForApproval";
  id: string;
};

type TransactionCancelled = {
  type: "cancelled";
  id: string;
};

type TransactionWaitingForConfirmations = {
  type: "waitingForConfirmation";
  id: string;
  tx: SentTransaction;
};

type TransactionConfirmed = {
  type: "confirmed";
  id: string;
};

type TransactionConfirmedOneShot = {
  type: "confirmedOneShot";
  id: string;
};

type TransactionState =
  | TransactionIdle
  | TransactionFailed
  | TransactionWaitingForApproval
  | TransactionCancelled
  | TransactionWaitingForConfirmations
  | TransactionConfirmed
  | TransactionConfirmedOneShot;

const TransactionContext = React.createContext<
  [TransactionState, (state: TransactionState) => void] | undefined
>(undefined);

export const TransactionProvider: React.FC = ({ children }) => {
  const transactionState = useState<TransactionState>({ type: "idle" });
  return (
    <TransactionContext.Provider value={transactionState}>{children}</TransactionContext.Provider>
  );
};

const useTransactionState = () => {
  const transactionState = useContext(TransactionContext);

  if (!transactionState) {
    throw new Error("You must provide a TransactionContext via TransactionProvider");
  }

  return transactionState;
};

export const useMyTransactionState = (myId: string | RegExp): TransactionState => {
  const [transactionState] = useTransactionState();

  return transactionState.type !== "idle" &&
    (typeof myId === "string" ? transactionState.id === myId : transactionState.id.match(myId))
    ? transactionState
    : { type: "idle" };
};

const hasMessage = (error: unknown): error is { message: string } =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as { message: unknown }).message === "string";

type ButtonlikeProps = {
  disabled?: boolean;
  variant?: string;
  onClick?: () => void;
};

type SentTransaction = SentLiquityTransaction<
  TransactionResponse,
  LiquityReceipt<TransactionReceipt>
>;

export type TransactionFunction = (
  overrides?: EthersTransactionOverrides
) => Promise<SentTransaction>;

type TransactionProps<C> = {
  id: string;
  /* tooltip?: string;
  tooltipPlacement?: TooltipProps<C>["placement"]; */
  showFailure?: "asTooltip" | "asChildText";
  requires?: readonly (readonly [boolean, string])[];
  send: TransactionFunction;
  children: C;
};

export const useTransactionFunction = (
  id: string,
  send: TransactionFunction
): [sendTransaction: () => Promise<void>, transactionState: TransactionState] => {
  const [transactionState, setTransactionState] = useTransactionState();

  const sendTransaction = useCallback(async () => {
    cancelCheck = false;
    setTransactionState({ type: "waitingForApproval", id });

    try {
      const tx = await send();

      setTransactionState({
        type: "waitingForConfirmation",
        id,
        tx
      });
    } catch (error: any) {
      if (hasMessage(error) && error.message.includes("User denied transaction signature")) {
        cancelCheck = true;
        setTransactionState({ type: "cancelled", id });
      } else {
        console.error(error);

        if (id.includes("mint")) {
          setTransactionState({
            type: "failed",
            id,
            error: new Error("Failed: Token already minted")
          });
          cancelCheck = true;
        } else if (
          error.data &&
          error.data["message"].includes("Did not receive enough tokens to account for slippage")
        ) {
          setTransactionState({
            type: "failed",
            id,
            error: new Error("Failed to send transaction. Please increase slippage %")
          });
          cancelCheck = true;
        } else if (error.data && error.data["message"].includes("Collateral input exceeds cap")) {
          setTransactionState({
            type: "failed",
            id,
            error: new Error("Failed to send transaction. Collateral input exceeds cap")
          });
          cancelCheck = true;
        } else {
          setTransactionState({
            type: "failed",
            id,
            error: new Error("Failed to send transaction (try again)")
          });
          cancelCheck = true;
        }
      }
    }
  }, [send, id, setTransactionState]);

  return [sendTransaction, transactionState];
};

export function Transaction<C extends React.ReactElement<ButtonlikeProps>>({
  id,
  /* tooltip,
  tooltipPlacement, */
  showFailure,
  requires,
  send,
  children
}: TransactionProps<C>) {
  const [sendTransaction, transactionState] = useTransactionFunction(id, send);
  const trigger = React.Children.only<C>(children);

  const failureReasons = (requires || [])
    .filter(([requirement]) => !requirement)
    .map(([, reason]) => reason);

  if (
    transactionState.type === "waitingForApproval" ||
    transactionState.type === "waitingForConfirmation"
  ) {
    failureReasons.push("You must wait for confirmation");
  }

  showFailure = failureReasons.length > 0 ? showFailure ?? "asChildText" : undefined;

  const clonedTrigger =
    showFailure === "asChildText"
      ? React.cloneElement(
          trigger,
          {
            disabled: true,
            variant: "danger"
          },
          failureReasons[0]
        )
      : showFailure === "asTooltip"
      ? React.cloneElement(trigger, { disabled: true })
      : React.cloneElement(trigger, { onClick: sendTransaction });

  if (showFailure === "asTooltip") {
    // tooltip = failureReasons[0];
  }

  return clonedTrigger;
}

// Doesn't work on Kovan:
// https://github.com/MetaMask/metamask-extension/issues/5579

const tryToGetRevertReason = async (provider: Web3Provider, tx: TransactionReceipt) => {
  try {
    const result = await provider.call(tx, tx.blockNumber);
    if (hexDataLength(result) % 32 === 4 && hexDataSlice(result, 0, 4) === "0x08c379a0") {
      return (defaultAbiCoder.decode(["string"], hexDataSlice(result, 4)) as [string])[0];
    }
  } catch {
    return undefined;
  }
};

const Donut = React.memo(
  CircularProgressbarWithChildren,
  ({ value: prev }, { value: next }) => prev === next
);

type TransactionProgressDonutProps = {
  state: TransactionState["type"];
  msg?: string;
};

let txHash = "";

export const TransactionProgressDonut: React.FC<TransactionProgressDonutProps> = ({ state }) => {
  const [value, setValue] = useState(0);
  const maxValue = 1;

  useEffect(() => {
    if (state === "confirmed") {
      cancelCheck = true;
      setTimeout(() => setValue(maxValue), 40);
    } else {
      setTimeout(() => setValue(maxValue * 0.67), 20);
    }
  }, [state]);

  return state === "confirmed" ? (
    <Donut {...{ value, maxValue, ...fastProgress }}>
      {/* <Icon name="check" color="white" size="lg" /> */}
    </Donut>
  ) : state === "failed" || state === "cancelled" ? (
    <Donut value={0} {...{ maxValue, ...fastProgress }}>
      {/* <Icon name="times" color="white" size="lg" /> */}
    </Donut>
  ) : (
    <Donut {...{ value, maxValue, ...slowProgress }}>
      {/*<Icon name="cog" color="white" size="lg" spin />*/}
    </Donut>
  );
};

export const TransactionMonitor: React.FC = () => {
  const { provider } = useLiquity();
  const [transactionState, setTransactionState] = useTransactionState();

  const id = transactionState.type !== "idle" ? transactionState.id : undefined;
  const tx = transactionState.type === "waitingForConfirmation" ? transactionState.tx : undefined;

  useEffect(() => {
    if (id && tx) {
      let cancelled = false;
      let finished = false;

      const txHash = tx.rawSentTransaction.hash;

      const waitForConfirmation = async () => {
        try {
          const receipt = await tx.waitForReceipt();

          if (cancelled) {
            return;
          }

          const { confirmations } = receipt.rawReceipt;
          const blockNumber = receipt.rawReceipt.blockNumber + confirmations - 1;
          finished = true;

          if (receipt.status === "succeeded") {
            setTransactionState({
              type: "confirmedOneShot",
              id
            });
          } else {
            const reason = await tryToGetRevertReason(provider, receipt.rawReceipt);

            if (cancelled) {
              return;
            }

            console.error(`Tx ${txHash} failed`);
            if (reason) {
              console.error(`Revert reason: ${reason}`);
            }

            setTransactionState({
              type: "failed",
              id,
              error: new Error(reason ? `Reverted: ${reason}` : "Failed")
            });
          }
        } catch (rawError) {
          if (cancelled) {
            return;
          }

          finished = true;

          if (rawError instanceof EthersTransactionCancelledError) {
            setTransactionState({ type: "cancelled", id });
          } else {
            console.error(`Failed to get receipt for tx ${txHash}`);
            console.error(rawError);

            setTransactionState({
              type: "failed",
              id,
              error: new Error("Failed")
            });
          }
        }
      };

      waitForConfirmation();

      return () => {
        if (!finished) {
          setTransactionState({ type: "idle" });
          cancelled = true;
        }
      };
    }
  }, [provider, id, tx, setTransactionState]);

  useEffect(() => {
    if (transactionState.type === "confirmedOneShot" && id) {
      // hack: the txn confirmed state lasts 5 seconds which blocks other states, review with Dani
      setTransactionState({ type: "confirmed", id });
    } else if (
      transactionState.type === "confirmed" ||
      transactionState.type === "failed" ||
      transactionState.type === "cancelled"
    ) {
      let cancelled = false;

      setTimeout(() => {
        if (!cancelled) {
          setTransactionState({ type: "idle" });
        }
      }, 5000);

      return () => {
        cancelled = true;
      };
    }
  }, [transactionState.type, setTransactionState, id]);

  if (transactionState.type === "idle" || transactionState.type === "waitingForApproval") {
    return null;
  }
  //console.log("transactionState", transactionState);

  if (transactionState.type === "waitingForConfirmation") {
    if (transactionState.tx != undefined) {
      txHash = transactionState.tx.rawSentTransaction.hash;
    }
  }
  return (
    <Flex
      align="center"
      bg={
        transactionState.type === "confirmed"
          ? "green.500"
          : transactionState.type === "cancelled"
          ? "yellow.500"
          : transactionState.type === "failed"
          ? "red.500"
          : "brand.800"
      }
      py={3}
      px={5}
      position="fixed"
      bottom={4}
      right={4}
      overflow="hidden"
      borderRadius="xl"
      maxW="90%"
    >
      <Box mr={3} w={10} h={10}>
        <TransactionProgressDonut state={transactionState.type} />
      </Box>
      <Box>
        <Flex>
          <Text textStyle="subtitle1">
            {transactionState.type === "waitingForConfirmation"
              ? "Waiting for confirmation"
              : transactionState.type === "cancelled"
              ? "Cancelled"
              : transactionState.type === "failed"
              ? transactionState.error.message
              : "Confirmed"}
          </Text>
        </Flex>
        {transactionState.type !== "cancelled" && txHash !== "" && (
          <Flex mt={2}>
            <Text textStyle="subtitle2Link">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://polygonscan.com/tx/${txHash}`}
              >
                View on PolygonScan
              </a>
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
