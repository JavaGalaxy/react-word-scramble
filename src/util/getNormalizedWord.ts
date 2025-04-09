export const getNormalizedWord = (word: string): string => {
  return word.toLocaleLowerCase().trim().replaceAll(/\s+/g, " ");
};
