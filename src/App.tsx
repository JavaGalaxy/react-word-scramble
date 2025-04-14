import { useRef } from "react";
import "./App.css";
import useAppState from "./hooks/useAppState";
import { GameResultsList } from "./components/GameResultsList";
import { useLoadData } from "./hooks/useLoadData";
import { getHighlightedIndices } from "./util/getMatchingLetters";
import { getHighlightedLetters } from "./util/getHighlightedLetters";

function App() {
  const [state, dispatch] = useAppState();
  const guessInputRef = useRef<HTMLInputElement>(null);

  let content = null;

  useLoadData(dispatch);

  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        content = <>Loading data...</>;
        break;
      }
      content = (
        <button
          className="btn-begin"
          onClick={() => dispatch({ type: "start-game" })}
        >
          Begin new game
        </button>
      );
      break;
    }

    case "in-game": {
      const highlightedIndices = getHighlightedIndices(
        state.scrambledGoal,
        state.guess,
      );

      const scrambledWordDisplay = (
        <div className="scrambled-word">
          {state.scrambledGoal.split("").map((letter, index) => {
            const isHighlighted = highlightedIndices.has(index);
            return (
              <span
                key={index}
                className={isHighlighted ? "letter-highlighted" : "letter"}
              >
                {letter}
              </span>
            );
          })}
        </div>
      );

      content = (
        <>
          <div className="game-stats">
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Words Guessed:</span>
                <span className="stat-value">{state.wordsGuessed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Words Skipped:</span>
                <span className="stat-value">{state.wordsSkipped}</span>
              </div>
            </div>
            <div className="goal-container">
              <span className="goal-label">Goal:</span>
              <span className="goal-value">{scrambledWordDisplay}</span>
            </div>
          </div>
          <div className="guess-input-container">
            <label htmlFor="guess-input" className="guess-label">
              Guess:
              <input
                id="guess-input"
                ref={guessInputRef}
                type="text"
                className="guess-input"
                value={state.guess}
                autoFocus
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </label>
          </div>
          <div>
            <div>
              {getHighlightedLetters(state.scrambledGoal, state.guess).map(
                (item, index) => (
                  <>
                    <span key={index}>
                      {item.letter} {" -> "} {item.color} {"\n"}
                    </span>
                    <br />
                  </>
                ),
              )}
            </div>
          </div>
          <div className="button-group">
            <button
              className="btn-skip"
              onClick={() => {
                dispatch({ type: "skip-word" });
                guessInputRef.current?.focus();
              }}
            >
              Skip Word
            </button>
            <button
              className="btn-end"
              onClick={() => dispatch({ type: "end-game" })}
            >
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
        <div className="game-over-container">
          <h2 className="game-over-title">Game Over!</h2>

          <div className="game-over-stats">
            <div className="score-display">
              You guessed{" "}
              <span className="highlight">{state.wordsGuessed}</span>{" "}
              {state.wordsGuessed === 1 ? "word" : "words"} correctly!
            </div>

            <div className="last-word-display">
              Your last word was:{" "}
              <span className="highlight">{state.goal}</span>
            </div>
          </div>

          <GameResultsList results={state.result} />

          <div className="new-game-container">
            <button
              className="btn-new-game"
              autoFocus
              onClick={() => dispatch({ type: "start-game" })}
            >
              Begin New Game
            </button>
          </div>
        </div>
      );
      break;
    }
  }

  return <div className="App">{content}</div>;
}

export default App;
