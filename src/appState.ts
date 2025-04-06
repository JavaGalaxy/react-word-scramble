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
  wordsGuessed: number;
}

export interface PostGameState extends BaseState {
  phase: "post-game";
  goal: string;
  wordPack: readonly string[];
  wordsGuessed: number;
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

export type EndGameAction = {
  type: "end-game";
}

export type Action = LoadDataAction | StartGameAction | UpdateGuessAction | EndGameAction;

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
        wordsGuessed: 0,
      };
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      const normalizedGuess = action.newGuess.toLowerCase().trim().replaceAll(/\s+/g, ' ');
      const normalizedGoal = state.goal.toLowerCase().trim().replace(/\s+/g, ' ');

      if (normalizedGuess === normalizedGoal) {
        return {
          ...state,
          goal: getRandomElement(state.wordPack),
          guess: "",
          wordsGuessed: state.wordsGuessed + 1,
        }
      }

      return { ...state, guess: action.newGuess };
    }

    case "end-game": {
      if(state.phase !== "in-game"){
        return state;
      }

      return {
        phase: "post-game",
        goal: state.goal,
        wordPack: state.wordPack,
        wordsGuessed: state.wordsGuessed,
      }
    }
  }

  return state;
};