import React, { useEffect, useReducer } from "react";
import "./App.css";
import { getInitialState, reducer } from "./appState";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  let content = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/fruits.txt")
        const text = await response.text();

        const wordPack = text
                  .split("\n")
                  .map(word => word.trim())
                  .filter(Boolean);
        
        setTimeout(() => {
          dispatch({ type: "load-data", wordPack });
        }, 3000);
      } catch (err) {
        console.error(err);
      }
    }
    
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
          <div> Goal: {state.goal}</div>
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
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>Nice game! You guessed {state.goal}</div>
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
