import React, { useState } from "react";
import { getRandomWord } from "./words";
import { HangmanDrawing } from "./hangmanDrawing";
import "./hangman.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Hangman({ onExit }) {
  // Convert word to uppercase to match the ALPHABET buttons
  const [word, setWord] = useState(() => getRandomWord().toUpperCase());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const mistakes = guessedLetters.filter((l) => !word.includes(l)).length;
  const isWinner = word.split("").every((l) => guessedLetters.includes(l));
  const isLoser = mistakes >= 6;

  const handleGuess = (letter) => {
    if (isWinner || isLoser) return;
    setGuessedLetters((prev) => [...prev, letter]);
  };

  const resetGame = () => {
    setWord(getRandomWord().toUpperCase());
    setGuessedLetters([]);
  };

  return (
    <div className="game-screen">
      <button className="exit-btn" onClick={onExit}>
        ← Back to Lobby
      </button>

      <h1>{isWinner ? "YOU WON! 🎉" : isLoser ? "GAME OVER 💀" : "HANGMAN"}</h1>

      <HangmanDrawing mistakes={mistakes} />

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
