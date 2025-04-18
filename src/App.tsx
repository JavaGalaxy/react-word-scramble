import { useRef, useState } from "react";
import "./App.css";
import useAppState from "./hooks/useAppState";
import { GameResultsList } from "./components/GameResultsList";
import { useLoadData } from "./hooks/useLoadData";
import { getHighlightedIndices } from "./util/getMatchingLetters";
import { getHighlightedLetters } from "./util/getHighlightedLetters";
import { useBannedWordData } from "./hooks/useBannedWordData";

function App() {
  const [state, dispatch] = useAppState();
  const guessInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  let content = null;

  useBannedWordData(dispatch);
  useLoadData(dispatch, selectedFileName);

  const availableWordLists = [
    { id: "fruits", fileName: "fruits.txt" },
    { id: "states", fileName: "us_states.txt" },
    { id: "countries", fileName: "countries.txt" },
  ];

  switch (state.phase) {
    case "pre-game": {
      content = (
        <>
          <div className="game-setup">
            <h2>Word Scramble Game</h2>
            <div className="word-list-selector">
              <h3>Select what you want to unscramble:</h3>
              <div className="word-list-options">
                {availableWordLists.map((list) => {
                  return (
                    <button
                      key={list.id}
                      className={`word-list-option ${selectedFileName === list.fileName ? "selected" : ""}`}
                      onClick={() => setSelectedFileName(list.fileName)}
                    >
                      {list.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            className="btn-begin"
            onClick={() => dispatch({ type: "start-game" })}
            disabled={!selectedFileName || state.wordPack === null}
          >
            Begin new game
          </button>
        </>
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

      const highlightedLetters = getHighlightedLetters(
        state.scrambledGoal,
        state.guess.toUpperCase() || " ",
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
              <div className="guess-container">
                <div className="guess-underlay word">
                  {highlightedLetters.map((item, index) => (
                    <span key={index} style={{ color: item.color }}>
                      {item.letter}
                    </span>
                  ))}
                </div>
                <input
                  id="guess-input"
                  ref={guessInputRef}
                  type="text"
                  className="guess-input word"
                  value={state.guess}
                  autoFocus
                  onChange={(ev) =>
                    dispatch({
                      type: "update-guess",
                      newGuess: ev.target.value,
                    })
                  }
                  style={{
                    backgroundColor: "transparent",
                    color: "transparent",
                    caretColor: "black",
                  }}
                />
              </div>
            </label>
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
