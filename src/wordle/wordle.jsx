import { useEffect, useState } from "react";
import { targetWord } from "./wordleGame";
import "./App.css";

const config = {
  cols: 5,
  rows: 6,
  wordLength: 5,
};

export default function Wordle() {
  const [grid, setGrid] = useState(
    Array(config.rows)
      .fill("")
      .map(() => Array(config.cols).fill(""))
  );

  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function isLetter(letter) {
    return letter.length === 1 && /[a-z]/i.test(letter);
  }

  function addLetter(letter) {
    if (currentPosition < config.wordLength) {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition] = letter;
      setGrid(newGrid);
      setCurrentPosition(currentPosition + 1);
    }
  }

  function removeLetter() {
    if (currentPosition > 0) {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition - 1] = "";
      setGrid(newGrid);
      setCurrentPosition(currentPosition - 1);
    }
  }

  function submitGuess() {
    if (currentPosition < config.wordLength) {
      return;
    }

    const guess = grid[currentAttempt].join("").toLowerCase();
    const word = targetWord.toLowerCase();

    if (guess === word) {
      alert("You Win!");
      setGameOver(true);
      return;
    }

    const nextAttempt = currentAttempt + 1;
    if (nextAttempt === config.rows) {
      setGameOver(true);
    }

    setCurrentAttempt(nextAttempt);
    setCurrentPosition(0);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (gameOver) return;

      if (isLetter(e.key)) {
        addLetter(e.key);
      } else if (e.key === "Backspace") {
        removeLetter();
      } else if (e.key === "Enter") {
        submitGuess();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div>
      <h1>Wordle</h1>

      <div id="wordle-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className="letter">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameOver && <h2>Game Over!</h2>}
    </div>
  );
}