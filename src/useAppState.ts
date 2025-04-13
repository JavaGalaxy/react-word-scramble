import { Dispatch, useReducer } from "react";
import { getGoalAndScrambledGoal } from "./util/getGoalAndScrambledWord";
import { getNormalizedWord } from "./util/getNormalizedWord";
import { shuffleArrayWithConstraints } from "./util/shuffleArray";

export type Phase = "pre-game" | "in-game" | "post-game";

export interface BaseState {
  phase: Phase;
}

export interface ResultStats {
  word: string;
  guessed: boolean;
  skipped: boolean;
}

export interface PreGameState extends BaseState {
  phase: "pre-game";
  wordPack: readonly string[] | null;
  bannedWords: readonly string[] | null;
}

export interface InGameState extends BaseState {
  phase: "in-game";
  goal: string;
  guess: string;
  wordPack: readonly string[];
  bannedWords: readonly string[] | null;
  wordsGuessed: number;
  wordsSkipped: number;
  scrambledGoal: string;
  result: ResultStats[];
  shuffledWordPack: string[];
  currentWordIndex: number;
  lastUsedWord: string | null;
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
  wordPack: readonly string[];
  bannedWords: readonly string[] | null;
  wordsGuessed: number;
  scrambledGoal: string;
  result: ResultStats[];
  shuffledWordPack: string[];
  currentWordIndex: number;
  lastUsedWord: string | null;
}

export type State = PreGameState | InGameState | PostGameState;

export const getInitialState = (): State => {
  return { phase: "pre-game", wordPack: null, bannedWords: null };
};

export type LoadDataAction = {
  type: "load-data";
  wordPack: readonly string[];
};

export type StartGameAction = {
  type: "start-game";
};

export type UpdateGuessAction = {
  type: "update-guess";
  newGuess: string;
};

export type SkipWordAction = {
  type: "skip-word";
};

export type EndGameAction = {
  type: "end-game";
};

export type LoadBannedWordAction = {
  type: "load-banned-words";
  bannedWords: readonly string[] | null;
};

export type Action =
  | LoadDataAction
  | StartGameAction
  | UpdateGuessAction
  | SkipWordAction
  | EndGameAction
  | LoadBannedWordAction;

const getNextWord = (
  state: InGameState | PostGameState,
): {
  goal: string;
  shuffledWordPack: string[];
  currentWordIndex: number;
  lastUsedWord: string | null;
} => {
  let { shuffledWordPack, currentWordIndex, lastUsedWord } = state;

  if (currentWordIndex >= shuffledWordPack.length) {
    lastUsedWord = shuffledWordPack[shuffledWordPack.length - 1];
    shuffledWordPack = shuffleArrayWithConstraints(
      state.wordPack,
      lastUsedWord,
    );
    currentWordIndex = 0;
  }

  const goal = shuffledWordPack[currentWordIndex];
  currentWordIndex++;

  return { goal, shuffledWordPack, currentWordIndex, lastUsedWord };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "load-data": {
      return {
        ...state,
        wordPack: action.wordPack,
      };
    }
    case "start-game": {
      if (state.phase === "in-game" || !state.wordPack) {
        return state;
      }

      let lastUsedWord = null;
      if (state.phase === "post-game") {
        lastUsedWord = state.lastUsedWord;
      }

      const shuffledWordPack = shuffleArrayWithConstraints(
        state.wordPack,
        lastUsedWord,
      );
      const currentWordIndex = 0;
      const goal = shuffledWordPack[currentWordIndex];
      const { scrambledGoal } = getGoalAndScrambledGoal(
        goal,
        state.bannedWords,
      );

      return {
        phase: "in-game",
        wordPack: state.wordPack,
        bannedWords: state.bannedWords,
        guess: "",
        goal,
        scrambledGoal,
        wordsGuessed: 0,
        wordsSkipped: 0,
        result: [],
        shuffledWordPack,
        currentWordIndex: currentWordIndex + 1,
        lastUsedWord,
      };
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      const normalizedGuess = getNormalizedWord(action.newGuess);
      const normalizedGoal = getNormalizedWord(state.goal);

      if (normalizedGuess === normalizedGoal) {
        const updatedResult = [
          ...state.result,
          { word: state.goal, guessed: true, skipped: false },
        ];

        const { goal, shuffledWordPack, currentWordIndex, lastUsedWord } =
          getNextWord(state);
        const { scrambledGoal } = getGoalAndScrambledGoal(
          goal,
          state.bannedWords,
        );

        return {
          ...state,
          guess: "",
          goal,
          scrambledGoal,
          wordsGuessed: state.wordsGuessed + 1,
          result: updatedResult,
          shuffledWordPack,
          currentWordIndex,
          lastUsedWord,
        };
      }

      return { ...state, guess: action.newGuess };
    }

    case "skip-word": {
      if (state.phase !== "in-game") {
        return state;
      }

      const updatedResult = [
        ...state.result,
        { word: state.goal, guessed: false, skipped: true },
      ];

      const { goal, shuffledWordPack, currentWordIndex, lastUsedWord } =
        getNextWord(state);
      const { scrambledGoal } = getGoalAndScrambledGoal(
        goal,
        state.bannedWords,
      );

      return {
        ...state,
        guess: "",
        goal,
        scrambledGoal,
        wordsSkipped: state.wordsSkipped + 1,
        result: updatedResult,
        shuffledWordPack,
        currentWordIndex,
        lastUsedWord,
      };
    }

    case "end-game": {
      if (state.phase !== "in-game") {
        return state;
      }

      return {
        phase: "post-game",
        goal: state.goal,
        wordPack: state.wordPack,
        bannedWords: state.bannedWords,
        wordsGuessed: state.wordsGuessed,
        scrambledGoal: state.scrambledGoal,
        result: state.result,
        shuffledWordPack: state.shuffledWordPack,
        currentWordIndex: state.currentWordIndex,
        lastUsedWord: state.lastUsedWord,
      };
    }

    case "load-banned-words": {
      return {
        ...state,
        bannedWords: action.bannedWords,
      };
    }
  }

  return state;
};

export default function useAppState(): [State, Dispatch<Action>] {
  return useReducer(reducer, null, getInitialState);
}
