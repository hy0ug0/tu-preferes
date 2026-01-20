export type QueueItem = {
  _id: string;
};

export function shuffleQuestions<T extends QueueItem>(items: Array<T>) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function nextIndex(current: number, total: number) {
  if (total === 0) {
    return 0;
  }
  return (current + 1) % total;
}
