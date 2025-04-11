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
  lastElement?: T,
): T[] => {
  let shuffledArray = shuffleArray(array);

  if (lastElement === shuffledArray[0]) {
    const swapIndex =
      1 + Math.floor(Math.random() * (shuffledArray.length - 1));
    [shuffledArray[0], shuffledArray[swapIndex]] = [
      shuffledArray[swapIndex],
      shuffledArray[0],
    ];
  }

  return shuffledArray;
};
