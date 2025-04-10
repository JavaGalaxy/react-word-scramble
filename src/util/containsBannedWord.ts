import { getNormalizedWord } from "./getNormalizedWord";

export const containsBannedWord = (str: string, bannedWords: readonly string[] | null): boolean => {
    if (!bannedWords) return false;
    return bannedWords.some((bannedWord) =>
      getNormalizedWord(str).includes(getNormalizedWord(bannedWord))
    );
  };