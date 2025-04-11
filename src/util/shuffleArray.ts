export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const shuffleArrayWithConstraints = <T>(
  array: readonly T[],
  lastUsedItem: T | null,
): T[] => {
  if (array.length <= 1) {
    return [...array];
  }
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (
    lastUsedItem !== null &&
    shuffled[0] === lastUsedItem &&
    shuffled.length > 1
  ) {
    const swapPosition = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
    [shuffled[0], shuffled[swapPosition]] = [
      shuffled[swapPosition],
      shuffled[0],
    ];
  }

  return shuffled;
};
