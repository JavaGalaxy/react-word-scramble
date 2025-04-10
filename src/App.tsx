import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import { getInitialState, reducer } from "./appState";
import { GameResultsList } from "./components/GameResultsList";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const guessInputRef = useRef<HTMLInputElement>(null);

  let content = null;

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
        const response = await fetch("https://unpkg.com/naughty-words@1.2.0/en.json");
        const bannedWords = await response.json();

        dispatch({ type: "load-banned-words", bannedWords });
      } catch (err) {
        console.error(err);
      }
    };

    fetchBannedWords();
    fetchData();
  }, []);

  useEffect(() => {
    if (state.phase === "in-game") {
      guessInputRef.current?.focus();
    }
  }, [state.phase]);

  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        content = <>Loading data...</>;
        break;
      }
      content = (
        <button onClick={() => dispatch({ type: "start-game" })}>
          Begin new game
        </button>
      );
      break;
    }

    case "in-game": {
      content = (
        <>
          <div>Words Guessed: {state.wordsGuessed}</div>
          <div>Words Skipped: {state.wordsSkipped}</div>
          <div>Goal: {state.scrambledGoal}</div>
          <div>
            <label>
              Guess:
              <input
                ref={guessInputRef}
                type="text"
                style={{ textTransform: "uppercase" }}
                value={state.guess}
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </label>
          </div>
          <div className="button-group">
            <button
              onClick={() => {
                dispatch({ type: "skip-word" });
                guessInputRef.current?.focus();
              }}
            >
              Skip Word
            </button>
            <button onClick={() => dispatch({ type: "end-game" })}>
              End Game
            </button>
          </div>

          <GameResultsList results={state.result} />
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>
            Game Over! You guessed {state.wordsGuessed}{" "}
            {state.wordsGuessed === 1 ? "word" : "words"} correctly!
          </div>
          <div>Your last word was: {state.goal}</div>

          <GameResultsList results={state.result} />

          <button autoFocus onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </>
      );
      break;
    }
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
