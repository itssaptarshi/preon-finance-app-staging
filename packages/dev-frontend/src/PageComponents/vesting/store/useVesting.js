import React, { useEffect, useState } from "react";
import { contractAddresses as CONTRACTS, contractAddresses } from "../../../config/constants";

// abi imports
import {
  vePreonAbi as VEPREON_ABI,
  erc20Abi as ERC20_ABI,
  vePreonEmissionsAbi as VEPREONEMISSIONS_ABI,
  boostedFarmAbi as BOOSTEDFARM_ABI
} from "./abi";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useTransactionFunction } from "../../../components/Transaction";
import { useLiquity } from "../../../hooks/LiquityContext";

import moment from "moment";
import { useToast } from "@chakra-ui/react";

// const handleDescription = () =>{
//   return(
//     <>
//     <p textStyle="subtitle2Link">
//               <a
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 href={`https://polygonscan.com/tx/${txHash}`}
//               >
//                 View on PolygonScan
//               </a>
//             </p>
//     </>
//   )
// }

function useVesting(userAddress, chainId, library) {
  // ********************* CONSTANTS *********************
  const _balances = {
    vePREONBalance: "0.00",
    govToken: "0.00" // deposit token
  };
  const MAX = BigNumber(2).pow(256).minus(1).toFixed(0);
  const toast = useToast();
  const errorToastProps = {
    status: "error",
    duration: 4000,
    isClosable: true,
    position: "bottom-right"
  };
  const successToastProps = {
    status: "success",
    duration: 4000,
    isClosable: true,
    position: "bottom-right"
  };
  const { liquity, account } = useLiquity();

  // *********************** STATE ***********************

  const [provider, setProvider] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [balances, setBalances] = useState(_balances);

  // *********************** CONTRACT STATE ***********************
  const [vePREONContract, setVePREONContract] = useState(null);
  const [vePREONEmissionsContract, setVePREONEmissionsContract] = useState(null);
  const [govTokenContract, setGovTokenContract] = useState(null);
  const [boostedFarmContracts, setBoostedFarmContracts] = useState(null);

  const __validChainIds = [137, 1337, 31337];

  // * updates user nfts & balances
  async function update() {
    setLoading(() => true);
    const _userNFTS = await getUserNfts();
    const _balance = await getBalances();
    setLoading(() => false);
  }

  // * get vePREON allowance from gov token
  async function _getVestAllowance() {
    try {
      if (!provider || !userAddress || !govTokenContract || !contractAddresses.vePREON.address) {
        __errorWithTimer("@Error _getVestAllowance");
        return;
      }

      const _allowance = await govTokenContract.allowance(
        userAddress,
        contractAddresses.vePREON.address
      );

      return _allowance;
    } catch (e) {
      console.error("Error at _getVestAllowance", e);
      __errorWithTimer("Error on getting Allowance");
    }
  }

  // * get has lock ended?
  // async function getLockEnded(tokenId) {
  //   try {
  //     if (!provider || !userAddress || !vePREONContract || !tokenId) {
  //       __errorWithTimer("@Error getLockEnded");
  //       return;
  //     }
  //     const _result = await vePREONContract.lockedEnd(tokenId);
  //     return _result;
  //   } catch (e) {
  //     console.error("Error at getLockEnded", e);
  //     __errorWithTimer("Error on getting Lock Ended");
  //   }
  // }

  // * get balance of gov token & vePREON total nfts
  async function getBalances() {
    if (
      !provider ||
      !userAddress ||
      !govTokenContract ||
      !vePREONContract ||
      !boostedFarmContracts
    ) {
      __errorWithTimer("@Error getBalances");
      return;
    }
    try {
      console.log("@useVesting: getting balances....");
      const [_veNftTotal, _govBalance, _attachedTokenId] = await Promise.all([
        await vePREONContract.balanceOf(userAddress),
        await govTokenContract.balanceOf(userAddress),
        await boostedFarmContracts.tokenIds(userAddress)
      ]);

      console.log("@useVesting: balances ", +_veNftTotal, +_govBalance / 1e18);
      console.log("@BOOSTEDFARM", +_attachedTokenId);
      setBalances(state => {
        return { ...state, vePREONBalance: _veNftTotal, govToken: _govBalance };
      });
    } catch (e) {
      console.error("Error at createLock", e);
      __errorWithTimer("Error on Creating Lock");
    }
  }

  // * approves gov token to vePREON with max value
  async function _approveGovTokenMore() {
    try {
      if (!provider || !userAddress || !govTokenContract || !contractAddresses.vePREON.address) {
        __errorWithTimer("@Error _approveGovTokenMore");
        return;
      }
      const _tx = await govTokenContract.approve(
        contractAddresses.vePREON.address,
        MAX ? MAX : "10000000e18"
      );
      // try {
      //   _tx.wait().then(async receipt => {
      //     console.log(receipt);
      //     if (receipt && receipt.status == 1) {
      //       // transaction success.
      //       console.log(_tx.hash);
      //     }
      //   });
      //   toast({
      //     title: "Success",
      //     description: `Transaction Successful \n ${_tx.hash}`,
      //     ...successToastProps
      //   });
      // } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: `Transaction Failed \n ${error}`,
      //     ...errorToastProps
      //   });
      // }
    } catch (e) {
      console.error("Error at _approveGovTokenMore", e);
      __errorWithTimer("Error on approving more Allowance");
    }
  }

  // * creates lock & approves gov token to vePREON

  // const [CreateLock] = useTransactionFunction(
  //   "create-lock",
  //   liquity.send.createLock.bind(liquity.send, amount, unlockTime)
  // );

  // async function createLock(amount, unlockTime) {
  //   setLoading(() => true);
  //   let result;
  //   try {
  //     if (!provider || !userAddress || !vePREONContract || !amount || amount <= 0 || !unlockTime) {
  //       __errorWithTimer("@Error createLock");
  //       return;
  //     }

  //     const unlockString = moment().add(unlockTime, "seconds").format("YYYY-MM-DD");
  //     console.log("your nft will be unlocked on", unlockString);

  //     const _allowance = await _getVestAllowance();
  //     console.log("allowance:", +_allowance, +amount);
  //     if (+_allowance < amount) {
  //       // if allowance is less;
  //       console.log("making approve");
  //       const _tx = await _approveGovTokenMore();
  //     }
  //     // result = vePREONContract.lock(amount, unlockTime.toString());
  //     // createLock(amount, unlockTime)

  //     update();
  //   } catch (e) {
  //     console.error("Error at createLock", e);
  //     __errorWithTimer("Error on Creating Lock");
  //   }
  //   setLoading(() => false);
  //   // return result;
  // }

  // * withdraw vest
  // async function withdrawLock(tokenId) {
  //   setLoading(() => true);
  //   try {
  //     if (!provider || !userAddress || !vePREONContract || !tokenId) {
  //       __errorWithTimer("@Error withdrawLock");
  //       return;
  //     }

  //     const _tx = await vePREONContract.unlock(tokenId);
  //     try {
  //       _tx.wait().then(async receipt => {
  //         console.log(receipt);
  //         if (receipt && receipt.status == 1) {
  //           // transaction success.
  //           console.log(_tx.hash);
  //         }
  //       });
  //       toast({
  //         title: "Success",
  //         description: `Transaction Successful \n ${_tx.hash}`,
  //         ...successToastProps
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: `Transaction Failed \n ${error}`,
  //         ...errorToastProps
  //       });
  //     }

  //     update();
  //   } catch (e) {
  //     console.error("Error at withdrawLock", e);
  //     __errorWithTimer("Error on Withdrawing Vest");
  //   }
  //   setLoading(() => false);
  // }

  // * rage quit
  // async function rageQuit(tokenId) {
  //   setLoading(() => true);
  //   try {
  //     if (!provider || !userAddress || !vePREONContract || !tokenId) {
  //       __errorWithTimer("@Error rageQuit");
  //       return;
  //     }

  //     let _tx;
  //     _tx = await vePREONContract.rageQuit(tokenId);
  //     try {
  //       _tx.wait().then(async receipt => {
  //         console.log(receipt);
  //         if (receipt && receipt.status == 1) {
  //           // transaction success.
  //           console.log(_tx.hash);
  //         }
  //       });
  //       toast({
  //         title: "Success",
  //         description: `Transaction Successful \n ${_tx.hash}`,
  //         ...successToastProps
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: `Transaction Failed \n ${error}`,
  //         ...errorToastProps
  //       });
  //     }

  //     console.log("@rageQuit hash:", _tx.hash);
  //   } catch (e) {
  //     console.error("Error at rageQuit", e);
  //     __errorWithTimer("Error on rageQuit");
  //   }

  //   update();
  //   setLoading(() => false);
  // }

  // * claim fees
  // async function claimFees() {
  //   setLoading(() => true);
  //   try {
  //     if (!provider || !userAddress || !vePREONContract) {
  //       __errorWithTimer("@Error claimFees");
  //       return;
  //     }
  //     const _tx = await vePREONContract.claimFees();
  //     try {
  //       _tx.wait().then(async receipt => {
  //         console.log(receipt);
  //         if (receipt && receipt.status == 1) {
  //           // transaction success.
  //           console.log(_tx.hash);
  //         }
  //       });
  //       toast({
  //         title: "Success",
  //         description: `Transaction Successful \n ${_tx.hash}`,
  //         ...successToastProps
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: `Transaction Failed \n ${error}`,
  //         ...errorToastProps
  //       });
  //     }
  //   } catch (e) {
  //     console.error("Error at claimFees", e);
  //     __errorWithTimer("Error on claimFees");
  //   }
  //   update();
  //   setLoading(() => false);
  // }

  // * increases vest amount & approves gov token to vePREON
  // async function increaseVestAmount(amount, tokenId) {
  //   setLoading(() => true);
  //   try {
  //     console.log("provider", provider);
  //     console.log("userAddress", userAddress);
  //     console.log("vePREONContract", vePREONContract);
  //     console.log("amount", amount);
  //     console.log("tokenId", tokenId);
  //     console.log("amount", amount);
  //     // #TODO!! pending => all the values are coming perfectly, and it was still throwing error. works fine after commenting out!!
  //     // if (!provider || !userAddress || !vePREONContract || !amount || tokenId || amount <= 0) {
  //     //   __errorWithTimer("@Error increaseVestAmount");
  //     //   return;
  //     // }

  //     const _allowance = await _getVestAllowance();
  //     if (BigNumber(_allowance).lt(amount)) {
  //       // if allowance is less;

  //       const _tx = await _approveGovTokenMore();
  //       try {
  //         _tx.wait().then(async receipt => {
  //           console.log(receipt);
  //           if (receipt && receipt.status == 1) {
  //             // transaction success.
  //             console.log(_tx.hash);
  //           }
  //         });
  //         toast({
  //           title: "Success",
  //           description: `Transaction Successful \n ${_tx.hash}`,
  //           ...successToastProps
  //         });
  //       } catch (error) {
  //         toast({
  //           title: "Error",
  //           description: `Transaction Failed \n ${error}`,
  //           ...errorToastProps
  //         });
  //       }
  //     }

  //     const _tx = await vePREONContract.increaseAmount(tokenId, amount);
  //     try {
  //       _tx.wait().then(async receipt => {
  //         console.log(receipt);
  //         if (receipt && receipt.status == 1) {
  //           // transaction success.
  //           console.log(_tx.hash);
  //         }
  //       });
  //       toast({
  //         title: "Success",
  //         description: `Transaction Successful \n ${_tx.hash}`,
  //         ...successToastProps
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: `Transaction Failed \n ${error}`,
  //         ...errorToastProps
  //       });
  //     }
  //   } catch (e) {
  //     console.error("Error at increaseVestAmount", e);
  //     __errorWithTimer("Error on Increasing Vest Amount");
  //   }
  //   update();
  //   setLoading(() => false);
  // }

  // * increases vest duration & approves gov token to vePREON
  // async function increaseVestDuration(tokenId, unlockTime) {
  //   setLoading(() => true);
  //   try {
  //     if (!provider || !userAddress || !govTokenContract || !tokenId || !unlockTime) {
  //       __errorWithTimer("@Error increaseVestDuration");
  //       return;
  //     }
  //     const _tx = await vePREONContract.increaseUnlockTime(tokenId, unlockTime.toString());
  //     try {
  //       _tx.wait().then(async receipt => {
  //         console.log(receipt);
  //         if (receipt && receipt.status == 1) {
  //           // transaction success.
  //           console.log(_tx.hash);
  //         }
  //       });
  //       toast({
  //         title: "Success",
  //         description: `Transaction Successful \n ${_tx.hash}`,
  //         ...successToastProps
  //       });
  //     } catch (error) {
  //       console.log("eeeeeeeeeeeeeee", error);
  //       toast({
  //         title: "Error",
  //         description: `Transaction Error, \n ${error}`,
  //         ...errorToastProps
  //       });
  //     }
  //   } catch (e) {
  //     console.error("Error at increaseVestAmount", e);
  //     __errorWithTimer("Error on Increasing Vest Amount");
  //   }
  //   update();
  //   setLoading(() => false);
  // }

  // * get all NFTs by user address
  async function getUserNfts() {
    setLoading(() => true);

    if (!provider || !userAddress) {
      __errorWithTimer("@Error getUserNfts");
      return;
    }

    try {
      const _nftsLength = await vePREONContract.balanceOf(userAddress);
      console.log("@useVesting: _nftsLength", _nftsLength);
      const arr = Array.from({ length: parseInt(_nftsLength) }, (v, i) => i);
      const nfts = await Promise.all(
        arr.map(async idx => {
          const tokenIndex = await vePREONContract.tokenOfOwnerByIndex(userAddress, idx);
          const locked = await vePREONContract.locked(tokenIndex);
          const lockValue = await vePREONContract.balanceOfNFT(tokenIndex);
          const starRewardEarned = await vePREONEmissionsContract.claimable(
            tokenIndex,
            contractAddresses.starToken.address
          );
          const lpRewardEarned = await vePREONEmissionsContract.claimable(
            tokenIndex,
            contractAddresses.starToken.address
          );
          console.log("@nft earned: starRewardEarned", +starRewardEarned);
          console.log("@nft earned: lpRewardEarned", +lpRewardEarned);

          return {
            id: tokenIndex,
            lockEnds: locked.end,
            lockAmount: locked.amount,
            lockValue: lockValue,
            claimables: {
              starToken: starRewardEarned,
              lpToken: lpRewardEarned
            }
          };
        })
      );

      setNfts(() => nfts);
    } catch (e) {
      console.error("Error at useVesting", e);
      __errorWithTimer("Error on getting user NFTs");
    }
    setLoading(() => false);
  }

  // * internal set Error
  const __errorWithTimer = (msg, timer = 5) => {
    setError(msg);
    console.error(msg);

    setInterval(() => {
      setError(null);
    }, timer);
  };

  // * get NFT by id
  async function getNftById(_id) {
    setLoading(() => true);
    // if no id; then return;
    if (!_id) {
      console.error("no tokenId found");
      return -1;
    }

    if (!provider || !userAddress || !govTokenContract) {
      __errorWithTimer("@Error");
      return;
    }

    // if nft present
    const _nft = nfts.filter(nft => {
      return nft.id == _id;
    });

    // return if nft found
    if (_nft.length > 0) return _nft[0];

    let __getNFTS = await getUserNfts();

    const _foundNft = nfts.filter(nft => {
      return nft.id == _id;
    });

    if (_foundNft.length > 0) return _foundNft[0];
    setLoading(() => false);

    return;
  }

  // merge two nfts

  // const [close] = useTransactionFunction("close-trove", liquity.send.closeTrove.bind(liquity.send));

  // const merge = async (from, to) => {
  //   setLoading(() => true);
  //   const _tx = await vePREONContract.merge(from, to);
  //   // try {
  //   //   _tx.wait().then(async receipt => {
  //   //     // console.log(receipt);
  //   //     if (receipt && receipt.status == 1) {
  //   //       // transaction success.
  //   //       console.log("WMATIC balance after single swap: ");
  //   //     }
  //   //   });

  //   //   toast({
  //   //     title: "Success",
  //   //     description: `Transaction Successful \n ${_tx.hash}`,
  //   //     ...successToastProps
  //   //   });
  //   // } catch (error) {
  //   //   toast({
  //   //     title: "Error",
  //   //     description: `Transaction Failed \n ${error}`,
  //   //     ...errorToastProps
  //   //   });
  //   // }
  //   update();
  //   setLoading(() => false);
  // };

  // async function attachment(tokenId) {
  //   // console.log("hellooooo")
  //   const _tx = await vePREONContract.attachments(tokenId);
  // }

  // async function checkToken() {
  //   const result = await boostedFarmContracts.tokenIds(userAddress);
  //   return result;
  // }

  // ***************************** CLAIM / vePREONEMISSIONS *****************************

  // * claim single reward token against many tokenIds (nfts)
  async function claimMany(tokenIds, token) {
    setLoading(() => true);
    try {
      if (!Array.isArray(tokenIds)) {
        __errorWithTimer("tokenids is not array");
        return;
      }
      if (!provider || !userAddress || !vePREONEmissionsContract || !tokenIds.length) {
        __errorWithTimer("@Error claimMany");
        return;
      }
      if (!ethers.utils.isAddress(token)) {
        __errorWithTimer("token address error");
        return;
      }
      const _tx = await vePREONEmissionsContract.claimMany(tokenIds, token);
      try {
        _tx.wait().then(async receipt => {
          console.log(receipt);
          if (receipt && receipt.status == 1) {
            // transaction success.
            console.log(_tx.hash);
          }
        });
        toast({
          title: "Success",
          description: `Transaction Successful \n ${_tx.hash}`,
          ...successToastProps
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Transaction Failed \n ${error}`,
          ...errorToastProps
        });
      }
    } catch (e) {
      console.error("Error at claimMany", e);
      __errorWithTimer("Error on claimMany");
    }
    update();
    setLoading(() => false);
  }

  // * claim single reward token against tokenId
  async function claimReward(tokenId, token) {
    setLoading(() => true);
    try {
      if (!provider || !userAddress || !vePREONEmissionsContract) {
        __errorWithTimer("@Error claimReward");
        return;
      }
      if (!ethers.utils.isAddress(token)) {
        __errorWithTimer("tokenId or token not defined");
        return;
      }

      const _tx = await vePREONEmissionsContract.claim(tokenId, token);
      try {
        _tx.wait().then(async receipt => {
          console.log(receipt);
          if (receipt && receipt.status == 1) {
            // transaction success.
            console.log(_tx.hash);
          }
        });
        toast({
          title: "Success",
          description: `Transaction Successful \n ${_tx.hash}`,
          ...successToastProps
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Transaction Failed \n ${error}`,
          ...errorToastProps
        });
      }

      update();
    } catch (e) {
      console.error("Error at claimReward", e);
      __errorWithTimer("Error on claimReward");
    }
    setLoading(() => false);
  }

  // * claim single reward token against tokenId
  async function claimable(tokenId, token) {
    setLoading(() => true);
    try {
      if (!provider || !userAddress || !vePREONEmissionsContract || !tokenId) {
        __errorWithTimer("@Error claimable");
        return;
      }
      if (!ethers.utils.isAddress(token)) {
        __errorWithTimer("tokenId or token not defined");
        return;
      }

      const _result = await vePREONEmissionsContract.claimable(tokenId, token);
      console.log("@claimable reward:", +_result, token);
      return _result;
    } catch (e) {
      console.error("Error at claimable", e);
      __errorWithTimer("Error on claimable");
    }
    setLoading(() => false);
  }

  // * check if chain is valid
  const _validChainId = id => {
    return __validChainIds.filter(_id => _id == id) > 0;
  };

  async function init() {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = await library.getSigner(userAddress);
    setGovTokenContract(new ethers.Contract(CONTRACTS.lpToken.address, ERC20_ABI, _signer));
    setVePREONEmissionsContract(
      new ethers.Contract(CONTRACTS.vePREONEmissions.address, VEPREONEMISSIONS_ABI, _signer)
    );
    setVePREONContract(new ethers.Contract(CONTRACTS.vePREON.address, VEPREON_ABI, _signer));
    setBoostedFarmContracts(
      new ethers.Contract(CONTRACTS.boostedFarm.address, BOOSTEDFARM_ABI, _signer)
    );
    setProvider(() => _provider);
    setLoading(() => false);
  }

  useEffect(() => {
    setLoading(() => true);
    const userAddr = ethers.utils.isAddress(userAddress);
    if (!_validChainId(chainId) || !userAddr) {
      console.error("Error at useVesting");
    }

    init();
  }, [userAddress, chainId]);

  useEffect(() => {
    if (
      vePREONContract?.address &&
      provider &&
      userAddress &&
      govTokenContract?.address &&
      vePREONContract?.address
    ) {
      update();
    }
  }, [provider, userAddress, govTokenContract?.address, vePREONContract?.address]);

  useEffect(() => {
    var _timer = setInterval(() => {
      setTimer(_state => _state + 1);
    }, 10000);
    return () => {
      clearInterval(_timer);
    };
  }, []);

  useEffect(() => {
    update();
  }, [timer]);

  const _NFTS_ACTIONS = {
    nfts, // get current user's nfts
    getUserNfts, // get user nfts
    getNftById // get nft by id
    // createLock, // create new lock
    // increaseVestAmount, // increase Existing Vest Amount
    // increaseVestDuration, // increase Existing Vest Duration
    // withdrawLock, // withdraw nft
    // rageQuit, // rage quit
    // getLockEnded, // check if lock ended for a Vest
    // claimFees, // ! (to be built) claimFees
    // merge, //to merge two nfts
    // attachment,
    // checkToken
  };

  const _CORE_ACTIONS = {
    error, // set error state
    update, // update the getters
    loading // isLoading
  };

  const _USER_INFO_ACTIONS = {
    balances // balance of vePREON (nft total), gov token
  };

  const _CLAIM_ACTIONS = {
    claimMany, // claim single reward token against multiple NFTS (tokenIds)
    claimReward, // claim reward token against single tokenId
    claimable // earned reward on tokenId
  };

  return {
    ..._NFTS_ACTIONS,
    ..._CORE_ACTIONS,
    ..._USER_INFO_ACTIONS,
    ..._CLAIM_ACTIONS
  };
}

export default useVesting;
