import React, { useState } from "react";
import { getRandomWord } from "./words";
import "./hangman.css";

export default function Hangman({ onExit }) {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Correct placement of game logic
  const mistakes = guessedLetters.filter((l) => !word.includes(l)).length;
  const isWinner = word.split("").every((l) => guessedLetters.includes(l));
  const isLoser = mistakes >= 6;

  const handleGuess = (letter) => {
    if (isWinner || isLoser) return;
    setGuessedLetters((prev) => [...prev, letter]);
  };

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
  };

  return (
    <div className="game-screen">
      <button className="exit-btn" onClick={onExit}>
        ← Back to Lobby
      </button>

      <h1>{isWinner ? "YOU WON! 🎉" : isLoser ? "GAME OVER 💀" : "HANGMAN"}</h1>

      <Drawing mistakes={mistakes} />

      <div className="word-display">
        {word.split("").map((letter, i) => (
          <span key={i} className="letter-slot">
            {guessedLetters.includes(letter) || isLoser ? letter : "_"}
          </span>
        ))}
      </div>

      <Keyboard
        guessedLetters={guessedLetters}
        onSelect={handleGuess}
        disabled={isWinner || isLoser}
      />

      {(isWinner || isLoser) && (
        <button className="reset-btn" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

// Visual components defined below to keep the "Brain" clean
const BODY_PARTS = [
  <div key="head" className="head" />,
  <div key="body" className="body" />,
  <div key="l-arm" className="l-arm" />,
  <div key="r-arm" className="r-arm" />,
  <div key="l-leg" className="l-leg" />,
  <div key="r-leg" className="r-leg" />,
];

function Drawing({ mistakes }) {
  return (
    <div className="hangman-container">
      <div className="bar-top" />
      <div className="bar-vertical" />
      <div className="bar-bottom" />
      {BODY_PARTS.slice(0, mistakes)}
    </div>
  );
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function Keyboard({ guessedLetters, onSelect, disabled }) {
  return (
    <div className="keyboard">
      {ALPHABET.map((letter) => (
        <button
          key={letter}
          className="key-btn"
          disabled={guessedLetters.includes(letter) || disabled}
          onClick={() => onSelect(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
