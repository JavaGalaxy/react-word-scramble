export const getMatchingLetters = (
  scrambledWord: string,
  guess: string,
): string[] => {
  const highlightedLetters: string[] = [];
  const map = new Map<string, number>();

  for (const letter of scrambledWord) {
    map.set(letter, (map.get(letter) ?? 0) + 1);
  }

  for (const letter of guess) {
    if(map.has(letter)) {
        highlightedLetters.push(letter)
        map.set(letter, map.get(letter) ?? - 1);
    }
  }

  return highlightedLetters;
};
