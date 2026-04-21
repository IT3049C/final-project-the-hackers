import { useState } from "react";
import "./App.css";

// 1. Import your game components
import Hangman from "./hangman/hangman";
import TicTacToe from "./tictactoe/tictactoe";
import Wordle from "./wordle/wordle";

function App() {
  // 2. Create state to track which game is active
  // null = Lobby, 'hangman', 'tictactoe', or 'wordle'
  const [activeGame, setActiveGame] = useState(null);

  // 3. Helper to return to the lobby
  const goToLobby = () => setActiveGame(null);

  // 4. Conditional Rendering
  // If a game is selected, show that game. Otherwise, show the selection menu.
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
          {/* Hangman already has a 'Back' button via the onExit prop */}
          {activeGame === "hangman" && <Hangman onExit={goToLobby} />}

          {/* For TicTacToe and Wordle, we wrap them with a back button here */}
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

// 5. Ensure the component is exported!
export default App;
