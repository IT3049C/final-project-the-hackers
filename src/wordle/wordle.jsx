import React, { useState, useEffect } from 'react';

// Game Constants
const WORDS = ['REACT', 'STYLE', 'PROPS', 'STACK', 'VOTED', 'PHONE', 'CLARK', 'GHOST'];
const SOLUTION = WORDS[Math.floor(Math.random() * WORDS.length)];

const Wordle = ({ playerName }) => {
  const [guesses, setGuesses] = useState(Array(6).fill('')); 
  const [currentGuess, setCurrentGuess] = useState('');
  const [turn, setTurn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState(`Good luck, ${playerName}!`);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (isGameOver) return;

      // Handle Backspace
      if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
        return;
      }

      // Handle Enter
      if (e.key === 'Enter') {
        if (currentGuess.length !== 5) {
          setMessage("Word must be 5 letters!");
          return;
        }
        
        const newGuesses = [...guesses];
        newGuesses[turn] = currentGuess.toUpperCase();
        setGuesses(newGuesses);
        
        if (currentGuess.toUpperCase() === SOLUTION) {
          setIsGameOver(true);
          setMessage(`Incredible, ${playerName}! You won! 🎉`);
        } else if (turn === 5) {
          setIsGameOver(true);
          setMessage(`Game Over, ${playerName}. The word was ${SOLUTION}`);
        } else {
          setTurn(turn + 1);
          setCurrentGuess('');
          setMessage(`Keep going, ${playerName}!`);
        }
      }

      if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + e.key.toUpperCase());
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [currentGuess, turn, isGameOver, playerName, guesses]);

  const getLetterStyle = (guess, index) => {
    const letter = guess[index];
    const solutionLetter = SOLUTION[index];

    if (letter === solutionLetter) return { backgroundColor: '#6aaa64', color: 'white', borderColor: '#6aaa64' }; 
    if (SOLUTION.includes(letter)) return { backgroundColor: '#c9b458', color: 'white', borderColor: '#c9b458' }; 
    return { backgroundColor: '#787c7e', color: 'white', borderColor: '#787c7e' }; 
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Wordle</h2>
      <p style={styles.status}>{message}</p>

      <div style={styles.grid}>
        {guesses.map((guess, i) => {
          const isCurrentTurn = i === turn;
          const displayGuess = isCurrentTurn ? currentGuess.padEnd(5, ' ') : guess;
          
          return (
            <div key={i} style={styles.row}>
              {Array.from({ length: 5 }).map((_, j) => (
                <div 
                  key={j} 
                  style={{ 
                    ...styles.cell, 
                    ...(i < turn ? getLetterStyle(guess, j) : {}) 
                  }}
                >
                  {displayGuess[j]}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {isGameOver && (
        <button 
          style={styles.resetBtn} 
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      )}
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '80vh'
  },
  title: { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', letterSpacing: '2px' },
  status: { fontSize: '1.1rem', marginBottom: '20px', fontWeight: '500' },
  grid: { display: 'grid', gap: '5px' },
  row: { display: 'flex', gap: '5px' },
  cell: { 
    width: '60px', 
    height: '60px', 
    border: '2px solid #d3d6da', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontSize: '2rem', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.5s ease'
  },
  resetBtn: {
    marginTop: '30px',
    padding: '10px 25px',
    fontSize: '1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Wordle;