export const getHighlightedLetters = (
  scrambledWord: string,
  guess: string,
): { letter: string; color: string }[] => {
  const map = new Map<string, number>();

  const responseObject: { letter: string; color: string }[] = [];

  for (const letter of scrambledWord) {
    map.set(letter, (map.get(letter) ?? 0) + 1);
  }

  for (const letter of guess) {
    if (map.has(letter) && map.get(letter)! > 0) {
      responseObject.push({ letter: letter, color: "green" });
      map.set(letter, map.get(letter)! - 1);
    } else {
      responseObject.push({ letter: letter, color: "red" });
    }
  }

  return responseObject;
};
