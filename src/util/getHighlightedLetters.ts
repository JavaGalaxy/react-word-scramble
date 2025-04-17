export const getHighlightedLetters = (
  scrambledWord: string,
  guess: string,
): { letter: string; color: string }[] => {
  const map = new Map<string, number>();

  for (const letter of scrambledWord.toUpperCase()) {
    map.set(letter, (map.get(letter) ?? 0) + 1);
  }

  return [...guess].map((letter) => {
    const upperLetter = letter.toUpperCase();
    if (map.has(upperLetter) && map.get(upperLetter)! > 0) {
      map.set(upperLetter, map.get(upperLetter)! - 1);
      return { letter, color: "royalblue" };
    } else {
      return { letter, color: "crimson" };
    }
  });
};
