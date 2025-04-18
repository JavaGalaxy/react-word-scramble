import { type Dispatch, useEffect } from "react";
import type { Action } from "./useAppState";
import { getNormalizedWord } from "../util/getNormalizedWord";

export const useLoadData = (
  dispatch: Dispatch<Action>,
  fileName: string,
): void => {
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
