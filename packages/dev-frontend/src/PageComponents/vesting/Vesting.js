import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateLock from "./CreateLock";
import Increase from "./Increase";
import Rewards from "./Rewards";
import TestTable from "./Table";
import Unlock from "./Unlock";
import { useWeb3React } from "@web3-react/core";
import { useLiquity } from "../../hooks/LiquityContext";
import useVesting from "./store/useVesting";
import Merge from "./Merge";

export default function Vesting() {
  const { chainId, library } = useWeb3React();
  const { account } = useLiquity();
  const [manageNft, setManageNft] = useState();

  const {
    nfts,
    balances,
    isloading,
    createLock,
    increaseVestAmount,
    rageQuit,
    claimReward,
    withdrawLock,
    getUserNfts,
    increaseVestDuration,
    claimMany,
    getLockEnded,
    claimable,
    merge,
    attachment
  } = useVesting(account, chainId, library);

  return (
    <>
      <TestTable nfts={nfts} rageQuit={rageQuit} setManageNft={setManageNft} />
      <Flex justifyContent={"space-between"}>
        <CreateLock balances={balances} isloading={isloading} createLock={createLock} nfts={nfts} />
        <Merge nfts={nfts} attachment={attachment} />
      </Flex>
      <Rewards
        claimMany={claimMany}
        claimReward={claimReward}
        nfts={nfts}
        selectedNft={manageNft}
        claimable={claimable}
      />
      <Flex justifyContent={"space-between"}>
        <Unlock withdrawLock={withdrawLock} selectedNft={manageNft} endUnixToken={getLockEnded} />

        <Increase
          increaseVestAmount={increaseVestAmount}
          increaseVestDuration={increaseVestDuration}
          selectedNft={manageNft}
          balances={balances}
          isloading={isloading}
        />
      </Flex>
    </>
  );
}
