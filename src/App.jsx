import { useState } from "react";
import "./App.css";

import Hangman from "./hangman/hangman";
import TicTacToe from "./tictactoe/tictactoe";
import Wordle from "./wordle/wordle";
import RockPaperScissors from "./rps/rps";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [tempName, setTempName] = useState("");
  const [activeGame, setActiveGame] = useState(null);

  const goToLobby = () => setActiveGame(null);

  // If no name is set, show the Name Capture screen
  if (!playerName) {
    return (
      <div className="app-container lobby">
        <h1>Welcome to GameHub</h1>
        <p>Developed by: [Your Name Here]</p>
        <div className="name-capture">
          <label htmlFor="playerName">Enter Player Name:</label>
          <input
            id="playerName"
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Your name..."
          />
          <button onClick={() => setPlayerName(tempName)} disabled={!tempName}>
            Enter Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Show Global Player Name */}
      <div className="player-badge">
        Playing as: <strong>{playerName}</strong>
      </div>

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
            <button onClick={() => setActiveGame("rps")}>
              Play Rock Paper Scissors (Multiplayer)
            </button>
          </div>
        </div>
      ) : (
        <div className="game-wrapper">
          {activeGame === "hangman" && (
            <Hangman playerName={playerName} onExit={goToLobby} />
          )}
          {activeGame === "rps" && (
            <RockPaperScissors playerName={playerName} onExit={goToLobby} />
          )}

          {activeGame === "tictactoe" && (
            <>
              <button className="exit-btn" onClick={goToLobby}>
                ← Back to Lobby
              </button>
              <TicTacToe playerName={playerName} />
            </>
          )}

          {activeGame === "wordle" && (
            <>
              <button className="exit-btn" onClick={goToLobby}>
                ← Back to Lobby
              </button>
              <Wordle playerName={playerName} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
