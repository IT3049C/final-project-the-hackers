import { useState } from "react";
import "./tictactoe.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const winner = getWinner(board);

  function handleClick(i) {
    if (board[i] !== "" || winner) return;

    const updated = [...board];
    updated[i] = turn;
    setBoard(updated);
    setTurn(turn === "X" ? "O" : "X");
  }

  function reset() {
    setBoard(Array(9).fill(""));
    setTurn("X");
  }

  return (
    <div className="ttt-container">
      <h1>Tic Tac Toe</h1>

      <div className="ttt-grid">
        {board.map((value, i) => (
          <button key={i} className="ttt-cell" onClick={() => handleClick(i)}>
            {value}
          </button>
        ))}
      </div>

      <h2>
        {winner
          ? `Winner: ${winner}`
          : board.every((c) => c !== "")
            ? "Draw"
            : `Turn: ${turn}`}
      </h2>

      <button className="ttt-reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

function getWinner(board) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
