import { useState, useEffect } from 'react';
import { generateSudoku, BLANK } from './game/sudokuGenerator';
import { Experience } from './components/Experience';
import './App.css';

function App() {
  // Phase 1 Logic
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = (difficulty = 'easy') => {
    const newGame = generateSudoku(difficulty);
    setGame(newGame);
    setBoard(newGame.initial.map(row => [...row]));
  };

  const handleChange = (row, col, value) => {
    const val = parseInt(value) || 0;
    if (val >= 0 && val <= 9) {
      const newBoard = [...board];
      newBoard[row] = [...newBoard[row]];
      newBoard[row][col] = val === 0 ? BLANK : val;
      setBoard(newBoard);
    }
  };

  // Phase 2: 3D Background
  return (
    <>
      <Experience />

      {game && (
        <div className="app-container">
          <h1>Sudoku Cosmic Odyssey</h1>
          <div className="controls">
            <button onClick={() => startNewGame('easy')}>Easy</button>
            <button onClick={() => startNewGame('medium')}>Medium</button>
            <button onClick={() => startNewGame('hard')}>Hard</button>
          </div>

          <div className="sudoku-grid">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell === BLANK ? '' : cell}
                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                    maxLength={1}
                    className={`cell ${game.initial[rowIndex][colIndex] !== BLANK ? 'fixed' : ''
                      }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
