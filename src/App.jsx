import { useState } from "react";
import "./App.css";

// 1. Import your game components
import Hangman from "./hangman/hangman";
import TicTacToe from "./tictactoe/tictactoe";
import Wordle from "./wordle/wordle";

function App() {
  const [activeGame, setActiveGame] = useState(null);

  const goToLobby = () => setActiveGame(null);

  return (
    <div className="app-container">
      {activeGame === null ? (
        <div className="lobby">
          <h1>GameHub</h1>
          <p>Select a game to play:</p>
          <div className="game-options">
            <button onClick={() => setActiveGame("hangman")}>
              Play Hangman
            </button>
            <button onClick={() => setActiveGame("tictactoe")}>
              Play Tic Tac Toe
            </button>
            <button onClick={() => setActiveGame("wordle")}>Play Wordle</button>
          </div>
        </div>
      ) : (
        <div className="game-wrapper">
          {/* Hangman provides its own Exit button via the onExit prop */}
          {activeGame === "hangman" && <Hangman onExit={goToLobby} />}

          {/* Tic Tac Toe and Wordle logic */}
          {activeGame === "tictactoe" && (
            <>
              <button className="exit-btn" onClick={goToLobby}>
                ← Back to Lobby
              </button>
              <TicTacToe />
            </>
          )}

          {activeGame === "wordle" && (
            <>
              <button className="exit-btn" onClick={goToLobby}>
                ← Back to Lobby
              </button>
              <Wordle />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
