import { getRandomElement } from "./util/getRandomElement";

const WORDS = ["hello", "world"] as const;

export const getRandomWord = (): string => {
  return getRandomElement(WORDS);
};
