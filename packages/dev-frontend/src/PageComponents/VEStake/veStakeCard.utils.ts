// Function that calculates
export function getNewEstimatedWeeklyRewardsAmount(
  valueInput: number | undefined,
  preonStaked: number,
  reward: number,
  isStake: boolean,
  totalPreon: number
): number {
  if ((valueInput == undefined || isNaN(valueInput)) && !isNaN(preonStaked)) {
    return (reward * 2 * preonStaked) / totalPreon;
  } else if (valueInput == undefined || isNaN(valueInput)) {
    return 0;
  } else if (isStake) {
    return (reward * 2 * (preonStaked + valueInput)) / (totalPreon + valueInput);
  } else {
    return (reward * 2 * (preonStaked - valueInput)) / (totalPreon - valueInput);
  }
}
