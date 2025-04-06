import React, { useEffect, useReducer } from "react";
import "./App.css";
import { getInitialState, reducer } from "./appState";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

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

    fetchData();
  }, []);

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
          <div> Goal: {state.scrambledGoal}</div>
          <div>
            <label>
              Guess:
              <input
                type="text"
                value={state.guess}
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </label>
          </div>
          <div>
            <button onClick={() => dispatch({ type: "end-game" })}>
              End Game
            </button>
          </div>
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>
            Game Over! Your guessed {state.wordsGuessed}{" "}
            {state.wordsGuessed === 1 ? "word" : "words"} correctly!
          </div>
          <div>Your last word was: {state.goal}</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
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
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
