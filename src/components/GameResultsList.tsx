import { ResultStats } from "../appState";

 export const GameResultsList = ({ results }: { results: ResultStats[] }) => {
    if (results.length === 0) return null;
    
    return (
      <div className="game-history">
        <h3>Game Results</h3>
          {results.map((resultItem, index) => (
            <li key={index}>
              {resultItem.word} - {resultItem.guessed ? "Guessed correctly" : "Skipped"}
            </li>
          ))}
      </div>
    );
  };