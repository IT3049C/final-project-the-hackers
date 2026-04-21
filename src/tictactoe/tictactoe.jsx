import { useState } from "react";
import "./App.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);

  function handleClick(index) {
    if (board[index] !== "" || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  }

  function checkWinner(board) {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  const winner = checkWinner(board);

  function resetGame() {
    setBoard(Array(9).fill(""));
    setIsXTurn(true);
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner ? (
        <h2>Winner: {winner}</h2>
      ) : (
        <h2>Turn: {isXTurn ? "X" : "O"}</h2>
      )}

      <button onClick={resetGame}>Restart</button>
    </div>
  );
}