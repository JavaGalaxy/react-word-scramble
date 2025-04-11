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

  for (let i = 0; i < 10; i++) {
    const goal = getRandomElement(wordPack);
    let scrambledGoal = getScrambledWord(goal);

    if (scrambledGoal === goal) {
      continue;
    }

    if (containsBannedWord(scrambledGoal, bannedWords)) {
      continue;
    }
  }

  return { goal, scrambledGoal };
};
