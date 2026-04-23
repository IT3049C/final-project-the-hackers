import { useState, useEffect } from "react";
import "./wordle.css";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// You can replace this with any word you want
const ANSWER = "APPLE";

export default function Wordle() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  function handleKeyPress(e) {
    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }

    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage("Not enough letters");
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess === ANSWER) {
        setMessage("You win!");
        setGameOver(true);
      } else if (newGuesses.length === MAX_GUESSES) {
        setMessage(`You lost. Answer: ${ANSWER}`);
        setGameOver(true);
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  function getTileColor(letter, index) {
    if (!ANSWER.includes(letter)) return "gray";
    if (ANSWER[index] === letter) return "green";
    return "yellow";
  }

  function resetGame() {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
  }

  return (
    <div className="wordle-container">
      <h1>Wordle Clone</h1>

      <div className="board">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || "";
          const isCurrent = rowIndex === guesses.length;

          return (
            <div className="row" key={rowIndex}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const letter = isCurrent
                  ? currentGuess[colIndex] || ""
                  : guess[colIndex] || "";

                const color =
                  !isCurrent && guess
                    ? getTileColor(letter, colIndex)
                    : "empty";

                return (
                  <div className={`tile ${color}`} key={colIndex}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="message">{message}</p>

      <button className="reset-btn" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}
