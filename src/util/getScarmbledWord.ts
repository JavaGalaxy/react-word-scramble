export const getScrambledWord = (word: string): string => {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i - 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};
