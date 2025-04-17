import { type Dispatch, useEffect } from "react";
import type { Action } from "./useAppState";
import { getNormalizedWord } from "../util/getNormalizedWord";

export const useLoadData = (dispatch: Dispatch<Action>, fileName: string): void => {
  useEffect(() => {
    
    if (!fileName) return;

    const fetchData = async () => {
      try {
        const response = await fetch(fileName);
        const text = await response.text();

        const wordPack = text
          .split("\n")
          .map(getNormalizedWord)
          .filter(Boolean);
        console.log(wordPack)
        dispatch({ type: "load-data", wordPack });
      } catch (err) {
        console.error(err);
      }
    };

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
    if (fileName) {
      fetchData();
    }
  }, [dispatch, fileName]);
};
