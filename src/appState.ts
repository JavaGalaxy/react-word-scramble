import { getNormalizedWord } from "./util/getNormalizedWord";
import { getRandomElement } from "./util/getRandomElement";
import { getScrambledWord } from "./util/getScarmbledWord";

function getGoalAndScrambledGoal(wordPack: readonly string[]): {
  goal: string;
  scrambledGoal: string;
} {
  const goal = getRandomElement(wordPack);
  const scrambledGoal = getScrambledWord(goal);
  return { goal, scrambledGoal };
}

export type Phase = "pre-game" | "in-game" | "post-game";

export interface BaseState {
  phase: Phase;
}

export interface PreGameState extends BaseState {
  phase: "pre-game";
  wordPack: readonly string[] | null;
}

export interface InGameState extends BaseState {
  phase: "in-game";
  goal: string;
  guess: string;
  wordPack: readonly string[];
  wordsGuessed: number;
  scrambledGoal: string;
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
  wordPack: readonly string[];
  wordsGuessed: number;
  scrambledGoal: string;
}

export type State = PreGameState | InGameState | PostGameState;

export const getInitialState = (): State => {
  return { phase: "pre-game", wordPack: null };
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

export type EndGameAction = {
  type: "end-game";
};

export type Action =
  | LoadDataAction
  | StartGameAction
  | UpdateGuessAction
  | EndGameAction;

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
        guess: "",
        ...getGoalAndScrambledGoal(state.wordPack),
        wordsGuessed: 0,
      };
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      const normalizedGuess = getNormalizedWord(action.newGuess);
      const normalizedGoal = getNormalizedWord(state.goal);

      if (normalizedGuess === normalizedGoal) {
        return {
          ...state,
          guess: "",
          ...getGoalAndScrambledGoal(state.wordPack),
          wordsGuessed: state.wordsGuessed + 1,
        };
      }

      return { ...state, guess: action.newGuess };
    }

    case "end-game": {
      if (state.phase !== "in-game") {
        return state;
      }

      return {
        phase: "post-game",
        goal: state.goal,
        wordPack: state.wordPack,
        wordsGuessed: state.wordsGuessed,
        scrambledGoal: state.scrambledGoal,
      };
    }
  }

  return state;
};
