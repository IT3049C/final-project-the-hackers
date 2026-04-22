import React, { useState, useEffect } from 'react';

export const targetWord = "APPLE";

const CONFIG = {
  COLS: 5,
  ROWS: 6,
};

const WordleGame = () => {
  
  const [grid, setGrid] = useState(
    Array(CONFIG.ROWS).fill().map(() => Array(CONFIG.COLS).fill(""))
  );
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("");

  const isLetter = (key) => key.length === 1 && /[a-z]/i.test(key);

  const addLetter = (letter) => {
    if (currentPosition < CONFIG.COLS && currentAttempt < CONFIG.ROWS) {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition] = letter.toUpperCase();
      setGrid(newGrid);
      setCurrentPosition((prev) => prev + 1);
    }
  };

  const removeLetter = () => {
    if (currentPosition > 0) {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition - 1] = "";
      setGrid(newGrid);
      setCurrentPosition((prev) => prev - 1);
    }
  };

  const submitGuess = () => {
    if (currentPosition < CONFIG.COLS) {
      
      setStatus("Too short!");
      return;
    }

    const guess = grid[currentAttempt].join("").toLowerCase();
    const word = targetWord.toLowerCase();

    if (guess === word) {
      setStatus("Correct! You Win!");
      setGameOver(true);
      return;
    }

    if (currentAttempt === CONFIG.ROWS - 1) {
      setStatus(`Game Over! The word was ${targetWord}`);
      setGameOver(true);
    } else {
      setCurrentAttempt((prev) => prev + 1);
      setCurrentPosition(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      if (isLetter(e.key)) {
        addLetter(e.key);
      } else if (e.key === "Backspace") {
        removeLetter();
      } else if (e.key === "Enter") {
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentAttempt, gameOver, grid]);

  return (
    <div className="wordle-container">
      <div id="wordle-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((letter, colIndex) => {
              let className = "letter";
              if (rowIndex < currentAttempt) {
                className += letter.toLowerCase() === targetWord[colIndex] ? " correct" : "";
              }
              return (
                <div key={colIndex} className={className}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div id="game-result">{status}</div>
    </div>
  );
};



export default WordleGame;