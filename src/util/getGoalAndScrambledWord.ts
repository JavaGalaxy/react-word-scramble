import { containsBannedWord } from "./containsBannedWord";
import { getRandomElement } from "./getRandomElement";
import { getScrambledWord } from "./getScarmbledWord";

export const getGoalAndScrambledGoal = (
  wordPack: readonly string[],
  bannedWords: readonly string[] | null,
): {
  goal: string;
  scrambledGoal: string;
} => {
  const goal = getRandomElement(wordPack);
  let scrambledGoal = getScrambledWord(goal);

  const MAX_ATTEMPTS = 10;
  let retries = 0;

  while (
    scrambledGoal === goal ||
    (containsBannedWord(scrambledGoal, bannedWords) && retries < MAX_ATTEMPTS)
  ) {
    scrambledGoal = getScrambledWord(goal);
    retries++;
  }

  return { goal, scrambledGoal };
};
