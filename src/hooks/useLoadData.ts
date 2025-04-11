import { Dispatch, useEffect } from "react";
import { Action } from "../appState";

export const useLoadData = (dispatch: Dispatch<Action>): void => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/fruits.txt");
        const text = await response.text();

        const wordPack = text
          .split("\n")
          .map((word) => word.trim())
          .filter(Boolean);

        setTimeout(() => {
          dispatch({ type: "load-data", wordPack });
        }, 3000);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
