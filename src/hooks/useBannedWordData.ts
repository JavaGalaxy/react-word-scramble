import { type Dispatch, useEffect } from "react";
import { Action } from "./useAppState";

export const useBannedWordData = (dispatch: Dispatch<Action>) => {
  useEffect(() => {
    const fetchBannedWords = async () => {
      try {
        const response = await fetch(
          "https://unpkg.com/naughty-words@1.2.0/en.json",
        );
        const bannedWords = await response.json();

        dispatch({ type: "load-banned-words", bannedWords });
      } catch (err) {
        console.error(err);
      }
    };
    fetchBannedWords();
  }, [dispatch]);
};
