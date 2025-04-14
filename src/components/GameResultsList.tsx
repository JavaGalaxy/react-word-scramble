import { ResultStats } from "../hooks/useAppState";
import "./styles.css";

export const GameResultsList = ({ results }: { results: ResultStats[] }) => {
  if (results.length === 0) return null;

  return (
    <div className="game-history">
      <h3>Game Results</h3>
      <ul className="list-style">
        {results.map((resultItem, index) => (
          <li key={index} className="results-list">
            {resultItem.word} -{" "}
            {resultItem.guessed ? "Guessed correctly" : "Skipped"}
          </li>
        ))}
      </ul>
    </div>
  );
};
