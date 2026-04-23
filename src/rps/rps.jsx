import React, { useState, useEffect } from "react";
import "./rps.css";

// Sample avatars you can use
const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=3",
];

const MOVES = ["rock", "paper", "scissors"];

export default function RockPaperScissors({ onExit }) {
  // Game States
  const [gameState, setGameState] = useState("settings"); // 'settings' or 'game'
  const [settings, setSettings] = useState({
    name: "",
    avatar: "",
    difficulty: "normal",
  });
  const [score, setScore] = useState({ player: 0, cpu: 0, ties: 0 });
  const [history, setHistory] = useState([]);
  const [lastPlayerMove, setLastPlayerMove] = useState(null);
  const [highscores, setHighscores] = useState([]);

  // Load highscores on mount
  useEffect(() => {
    const savedScores = JSON.parse(
      localStorage.getItem("game.highscores") || "[]",
    );
    setHighscores(savedScores);
  }, []);

  const handleStartGame = (e) => {
    e.preventDefault();
    if (settings.name && settings.avatar) setGameState("game");
  };

  const decideWinner = (player, cpu) => {
    if (player === cpu) return "tie";
    if (
      (player === "rock" && cpu === "scissors") ||
      (player === "scissors" && cpu === "paper") ||
      (player === "paper" && cpu === "rock")
    ) {
      return "player";
    }
    return "cpu";
  };

  const getCpuMove = () => {
    if (settings.difficulty === "hard" && lastPlayerMove) {
      // 60% chance to counter the player's last move on hard
      if (Math.random() < 0.6) {
        if (lastPlayerMove === "rock") return "paper";
        if (lastPlayerMove === "paper") return "scissors";
        if (lastPlayerMove === "scissors") return "rock";
      }
    }
    // Otherwise, random move
    return MOVES[Math.floor(Math.random() * MOVES.length)];
  };

  const playRound = (playerMove) => {
    const cpuMove = getCpuMove();
    const winner = decideWinner(playerMove, cpuMove);

    setLastPlayerMove(playerMove);

    const outcomeText =
      winner === "tie"
        ? "It's a tie!"
        : winner === "player"
          ? "You win!"
          : "CPU wins!";
    setHistory((prev) => [
      `${settings.name} (${playerMove}) vs CPU (${cpuMove}) — ${outcomeText}`,
      ...prev,
    ]);

    setScore((prev) => ({
      ...prev,
      [winner === "tie" ? "ties" : winner]:
        prev[winner === "tie" ? "ties" : winner] + 1,
    }));
  };

  const saveHighscoreAndExit = () => {
    // Only save if they actually played a round
    if (score.player > 0 || score.cpu > 0 || score.ties > 0) {
      const newScore = {
        name: settings.name,
        stats: `W:${score.player} L:${score.cpu} T:${score.ties}`,
        date: new Date().toLocaleDateString(),
      };
      const newHighscores = [newScore, ...highscores].slice(0, 5); // Keep top 5
      localStorage.setItem("game.highscores", JSON.stringify(newHighscores));
    }
    onExit(); // Return to lobby
  };

  // --- SETTINGS VIEW ---
  if (gameState === "settings") {
    return (
      <div className="rps-container">
        <button className="exit-btn" onClick={onExit}>
          ← Back to Lobby
        </button>
        <h2>Rock Paper Scissors Setup</h2>

        <form onSubmit={handleStartGame} className="settings-form">
          <input
            type="text"
            placeholder="Enter your Name"
            required
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          />

          <div className="avatar-selection">
            <p>Select an Avatar:</p>
            <div className="avatars">
              {AVATARS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="avatar"
                  className={settings.avatar === url ? "selected" : ""}
                  onClick={() => setSettings({ ...settings, avatar: url })}
                />
              ))}
            </div>
          </div>

          <div className="difficulty-selection">
            <p>Difficulty:</p>
            <select
              value={settings.difficulty}
              onChange={(e) =>
                setSettings({ ...settings, difficulty: e.target.value })
              }
            >
              <option value="easy">Easy (Random)</option>
              <option value="normal">Normal (Random)</option>
              <option value="hard">Hard (Counters you)</option>
            </select>
          </div>

          <button type="submit" disabled={!settings.name || !settings.avatar}>
            Start Game
          </button>
        </form>

        {highscores.length > 0 && (
          <div className="highscores-preview">
            <h3>Recent Scores</h3>
            <ul>
              {highscores.map((s, i) => (
                <li key={i}>
                  {s.name} - {s.stats} ({s.date})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // --- GAME VIEW ---
  return (
    <div className="rps-container">
      <button className="exit-btn" onClick={saveHighscoreAndExit}>
        ← Save & Exit
      </button>

      <div className="game-header">
        <img src={settings.avatar} alt="avatar" />
        <h2>{settings.name}</h2>
        <span className="diff-badge">{settings.difficulty.toUpperCase()}</span>
      </div>

      <div className="scoreboard">
        <div className="score-box">
          Player
          <br />
          <strong>{score.player}</strong>
        </div>
        <div className="score-box">
          Ties
          <br />
          <strong>{score.ties}</strong>
        </div>
        <div className="score-box">
          CPU
          <br />
          <strong>{score.cpu}</strong>
        </div>
      </div>

      <div className="move-buttons">
        <button onClick={() => playRound("rock")}>🪨 Rock</button>
        <button onClick={() => playRound("paper")}>📄 Paper</button>
        <button onClick={() => playRound("scissors")}>✂️ Scissors</button>
      </div>

      <div className="history">
        <h3>Match History</h3>
        <ul>
          {history.length === 0 ? (
            <li>Make your first move!</li>
          ) : (
            history.map((line, i) => <li key={i}>{line}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
