import React, { useState, useEffect } from "react";
import "./rps.css";

const API_BASE_URL = "https://game-room-api.fly.dev";

export default function RockPaperScissors({ playerName, onExit }) {
  const [gameState, setGameState] = useState("lobby"); // lobby, waiting, playing, result
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [role, setRole] = useState(null); // 'p1' (creator) or 'p2' (joiner)

  // Local copy of the shared API state
  const [remoteState, setRemoteState] = useState(null);

  // --- 1. CREATE A ROOM ---
  const createRoom = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialState: {
            p1Name: playerName,
            p2Name: null,
            p1Move: null,
            p2Move: null,
            round: 1,
          },
        }),
      });
      const data = await res.json();
      setRoomCode(data.roomId);
      setRole("p1");
      setGameState("waiting"); // Wait for P2
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Failed to create room. Is the server running?");
    }
  };

  // --- 2. JOIN A ROOM ---
  const joinRoom = async (e) => {
    e.preventDefault();
    try {
      // Get current room state first
      const res = await fetch(`${API_BASE_URL}/api/rooms/${joinCode}`);
      if (!res.ok) throw new Error("Room not found");
      const data = await res.json();

      // Update the room to add Player 2
      await fetch(`${API_BASE_URL}/api/rooms/${joinCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameState: {
            ...data.gameState,
            p2Name: playerName,
          },
        }),
      });

      setRoomCode(joinCode);
      setRole("p2");
      setGameState("playing");
    } catch (err) {
      console.error("Error joining room:", err);
      alert("Failed to join. Check the room code.");
    }
  };

  // --- 3. POLLING (Check server every 2 seconds) ---
  useEffect(() => {
    if (!roomCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`);
        const data = await res.json();
        const currentState = data.gameState;
        setRemoteState(currentState);

        // Transition P1 from waiting to playing when P2 joins
        if (role === "p1" && currentState.p2Name && gameState === "waiting") {
          setGameState("playing");
        }

        // Transition to results if both players have moved
        if (
          currentState.p1Move &&
          currentState.p2Move &&
          gameState === "playing"
        ) {
          setGameState("result");
        }

        // Transition back to playing if someone clicked "Play Again" (moves cleared)
        if (
          !currentState.p1Move &&
          !currentState.p2Move &&
          gameState === "result"
        ) {
          setGameState("playing");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomCode, role, gameState]);

  // --- 4. MAKE A MOVE ---
  const makeMove = async (move) => {
    // We must fetch the absolute latest state so we don't accidentally erase P2's move if they just played
    const res = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`);
    const data = await res.json();
    const currentState = data.gameState;

    // Apply my move
    const updatedState = { ...currentState };
    if (role === "p1") updatedState.p1Move = move;
    if (role === "p2") updatedState.p2Move = move;

    // Send to server
    await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    // Optimistically update local UI to feel faster
    setRemoteState(updatedState);
  };

  // --- 5. RESET ROUND ---
  const playAgain = async () => {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`);
    const data = await res.json();

    // Clear moves and increment round
    await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameState: {
          ...data.gameState,
          p1Move: null,
          p2Move: null,
          round: data.gameState.round + 1,
        },
      }),
    });
  };

  // --- HELPER LOGIC ---
  const getWinnerMessage = () => {
    if (!remoteState || !remoteState.p1Move || !remoteState.p2Move) return "";
    const p1 = remoteState.p1Move;
    const p2 = remoteState.p2Move;

    if (p1 === p2) return "It's a Tie!";

    const p1Wins =
      (p1 === "rock" && p2 === "scissors") ||
      (p1 === "paper" && p2 === "rock") ||
      (p1 === "scissors" && p2 === "paper");

    if (role === "p1") return p1Wins ? "You Win!" : "You Lose!";
    if (role === "p2") return !p1Wins ? "You Win!" : "You Lose!";
  };

  const myMove = remoteState
    ? role === "p1"
      ? remoteState.p1Move
      : remoteState.p2Move
    : null;
  const opponentName = remoteState
    ? role === "p1"
      ? remoteState.p2Name
      : remoteState.p1Name
    : "...";

  return (
    <div className="rps-container">
      <button className="exit-btn" onClick={onExit}>
        ← Back to Hub
      </button>
      <h2>Multiplayer RPS</h2>

      {gameState === "lobby" && (
        <div className="multiplayer-lobby">
          <button className="primary-btn" onClick={createRoom}>
            Create New Room
          </button>
          <p>OR</p>
          <form
            onSubmit={joinRoom}
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit">Join Room</button>
          </form>
        </div>
      )}

      {gameState === "waiting" && (
        <div className="waiting-screen">
          <h3>
            Room Code: <strong>{roomCode}</strong>
          </h3>
          <p>Give this code to your friend.</p>
          <p>Waiting for opponent to join...</p>
        </div>
      )}

      {gameState === "playing" && remoteState && (
        <div className="playing-screen">
          <h3>Round {remoteState.round}</h3>
          <p>
            Playing against: <strong>{opponentName}</strong>
          </p>

          <div className="move-buttons">
            <button onClick={() => makeMove("rock")} disabled={myMove}>
              🪨 Rock
            </button>
            <button onClick={() => makeMove("paper")} disabled={myMove}>
              📄 Paper
            </button>
            <button onClick={() => makeMove("scissors")} disabled={myMove}>
              ✂️ Scissors
            </button>
          </div>

          {myMove && (
            <p className="waiting-text">
              Move locked in! Waiting for {opponentName}...
            </p>
          )}
        </div>
      )}

      {gameState === "result" && remoteState && (
        <div className="result-screen">
          <h2 className="result-text">{getWinnerMessage()}</h2>
          <div className="results-grid">
            <div className="result-card">
              <p>{remoteState.p1Name} played:</p>
              <h3>{remoteState.p1Move.toUpperCase()}</h3>
            </div>
            <div className="result-card">
              <p>{remoteState.p2Name} played:</p>
              <h3>{remoteState.p2Move.toUpperCase()}</h3>
            </div>
          </div>
          <button className="primary-btn" onClick={playAgain}>
            Play Next Round
          </button>
        </div>
      )}
    </div>
  );
}
