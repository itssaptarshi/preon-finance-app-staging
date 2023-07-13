import { BigNumber } from "ethers";

const NFT_OBJECT = (_tokenIndex, _locked, _lockValue, _starRewardEarned) => {
  // ! gives 0 value; even if we give some value > 1 - issue: BigNumber #pending
  return {
    id: _tokenIndex,
    lockEnds: _locked.end,
    lockAmount: BigNumber(_locked.amount)
      .div(10 ** 18)
      .toFixed(18),
    lockValue: BigNumber(_lockValue)
      .div(10 ** 18)
      .toFixed(18),
    claimables: {
      starToken: BigNumber(_starRewardEarned)
        .div(10 ** 18)
        .toFixed(18)
    }
  };
};

export { NFT_OBJECT };
