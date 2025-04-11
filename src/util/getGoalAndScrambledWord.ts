import { containsBannedWord } from "./containsBannedWord";
import { getScrambledWord } from "./getScarmbledWord";

export const getGoalAndScrambledGoal = (
  goal: string | null,
  bannedWords: readonly string[] | null,
): {
  goal: string | null;
  scrambledGoal: string;
} => {
  if (goal === null) {
    return { goal: null, scrambledGoal: "" };
  }

  let scrambledGoal = getScrambledWord(goal);

  const MAX_ATTEMPTS = 10;
  let retries = 0;

  while (
    (scrambledGoal === goal ||
      containsBannedWord(scrambledGoal, bannedWords)) &&
    retries < MAX_ATTEMPTS
  ) {
    scrambledGoal = getScrambledWord(goal);
    retries++;
  }

  return { goal, scrambledGoal };
};
