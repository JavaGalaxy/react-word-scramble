import { getGoalAndScrambledGoal } from "./util/getGoalAndScrambledWord";
import { getNormalizedWord } from "./util/getNormalizedWord";

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
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
  wordPack: readonly string[];
  bannedWords: readonly string[] | null;
  wordsGuessed: number;
  scrambledGoal: string;
  result: ResultStats[];
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

      return {
        phase: "in-game",
        wordPack: state.wordPack,
        bannedWords: state.bannedWords,
        guess: "",
        ...getGoalAndScrambledGoal(state.wordPack, state.bannedWords),
        wordsGuessed: 0,
        wordsSkipped: 0,
        result: [],
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
        return {
          ...state,
          guess: "",
          ...getGoalAndScrambledGoal(state.wordPack, state.bannedWords),
          wordsGuessed: state.wordsGuessed + 1,
          result: updatedResult,
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

      return {
        ...state,
        guess: "",
        ...getGoalAndScrambledGoal(state.wordPack, state.bannedWords),
        wordsSkipped: state.wordsSkipped + 1,
        result: updatedResult,
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
