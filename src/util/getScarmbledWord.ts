import { containsBannedWord } from "./containsBannedWord";

export const getScrambledWord = (word: string | null): string => {
  if (word === null) return "";

  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i - 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

export const getScrambledGoalSafely = (
  goal: string,
  bannedWords: readonly string[] | null,
): string => {
  let scrambledGoal = goal;
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

  return scrambledGoal;
};
