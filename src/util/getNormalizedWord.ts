export const getNormalizedWord = (word: string): string => {
  return word.toLowerCase().trim().replaceAll(/\s+/g, " ");
};
