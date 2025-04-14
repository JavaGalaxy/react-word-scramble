export const getHighlightedIndices = (
  scrambledWord: string,
  guess: string,
): Set<number> => {
  const highlightedIndices = new Set<number>();
  const guessLetterCounts = new Map<string, number>();

  for (const letter of guess) {
    guessLetterCounts.set(letter, (guessLetterCounts.get(letter) ?? 0) + 1);
  }

  for (let i = 0; i < scrambledWord.length; i++) {
    const letter = scrambledWord[i];
    const count = guessLetterCounts.get(letter) ?? 0;

    if (count > 0) {
      highlightedIndices.add(i);
      guessLetterCounts.set(letter, count - 1);
    }
  }

  return highlightedIndices;
};
