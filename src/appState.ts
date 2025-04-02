import { getRandomWord } from "./getRandomWord";

export type Phase = "pre-game" | "in-game" | "post-game";

export interface BaseState {
  phase: Phase;
}

export interface PreGameState extends BaseState {
  phase: "pre-game";
}

export interface InGameState extends BaseState {
  phase: "in-game";
  goal: string;
  guess: string;
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
}

export type State = PreGameState | InGameState | PostGameState;

export const getInitialState = (): State => {
  return { phase: "pre-game" };
};

export type StartGameAction = {
  type: "start-game";
};

export type UpdateGuessAction = {
  type: "update-guess";
  newGuess: string;
};

export type Action = StartGameAction | UpdateGuessAction;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "start-game": {
      if (state.phase === "in-game") {
        return state;
      }

      return {
        phase: "in-game",
        goal: getRandomWord(),
        guess: "",
      };
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      if (action.newGuess === state.goal) {
        return { phase: "post-game", goal: state.goal };
      }

      return { ...state, guess: action.newGuess };
    }
  }

  return state;
};
