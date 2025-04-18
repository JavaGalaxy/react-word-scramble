import { type Dispatch, useEffect, useMemo } from "react";
import type { Action } from "./useAppState";
import { getNormalizedWord } from "../util/getNormalizedWord";

export const useLoadData = (
  dispatch: Dispatch<Action>,
  fileName: string,
): void => {
  useMemo(() => {
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

        dispatch({ type: "load-data", wordPack });
      } catch (err) {
        console.error(err);
      }
    };

    if (fileName) {
      fetchData();
    }
  }, [dispatch, fileName]);
};
