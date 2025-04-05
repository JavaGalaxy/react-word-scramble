import { getRandomElement } from "./util/getRandomElement";

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
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
  wordPack: readonly string[];
}

export type State = PreGameState | InGameState | PostGameState;

export const getInitialState = (): State => {
  return { phase: "pre-game", wordPack: null };
};

export type LoadDataAction = {
  type: "load-data";
  wordPack: readonly string[];
}

export type StartGameAction = {
  type: "start-game";
};

export type UpdateGuessAction = {
  type: "update-guess";
  newGuess: string;
};

export type Action = LoadDataAction | StartGameAction | UpdateGuessAction;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "load-data":{
      return {
        ...state,
        wordPack: action.wordPack,
      }
    }
    case "start-game": {
      if (state.phase === "in-game" || !state.wordPack) {
        return state;
      }

      return {
        phase: "in-game",
        wordPack: state.wordPack,
        goal: getRandomElement(state.wordPack),
        guess: "",
      };
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      if (action.newGuess === state.goal) {
        return { phase: "post-game", goal: state.goal, wordPack: state.wordPack };
      }

      return { ...state, guess: action.newGuess };
    }
  }

  return state;
};