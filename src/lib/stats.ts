export function getChoicePercentages(countA: number, countB: number) {
  const total = countA + countB;
  if (total === 0) {
    return { percentA: 0, percentB: 0, total };
  }
  const percentA = Math.round((countA / total) * 100);
  const percentB = 100 - percentA;
  return { percentA, percentB, total };
}
