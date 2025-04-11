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

  const MAX_ATTEMPTS = 10;
  let retries = 0;

  while (retries < MAX_ATTEMPTS) {
    const scrambledGoal = getScrambledWord(goal);
    if (
      scrambledGoal !== goal &&
      !containsBannedWord(scrambledGoal, bannedWords)
    ) {
      return { goal, scrambledGoal };
    }
    retries++;
  }

  throw new Error("Exhausted attempt to get valid scrambled word");
};
