import { useState, useEffect } from 'react';
import { generateSudoku, BLANK } from './game/sudokuGenerator';
import { Experience } from './components/Experience';
import './App.css';

function App() {
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  // Update Body class for global variables
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;

      if (game.initial[row][col] !== BLANK) return;

      if (e.key >= '1' && e.key <= '9') {
        fillCell(row, col, parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        fillCell(row, col, BLANK);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell(prev => ({ ...prev, row: Math.max(0, prev.row - 1) }));
      } else if (e.key === 'ArrowDown') {
        setSelectedCell(prev => ({ ...prev, row: Math.min(8, prev.row + 1) }));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }));
      } else if (e.key === 'ArrowRight') {
        setSelectedCell(prev => ({ ...prev, col: Math.min(8, prev.col + 1) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board, game]);

  const startNewGame = (difficulty = 'easy') => {
    const newGame = generateSudoku(difficulty);
    setGame(newGame);
    setBoard(newGame.initial.map(row => [...row]));
    setSelectedCell(null);
  };

  const fillCell = (row, col, value) => {
    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = value;
    setBoard(newBoard);
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  return (
    <>
      <Experience
        board={board}
        initialBoard={game?.initial}
        onCellClick={handleCellClick}
        selectedCell={selectedCell}
        isLightMode={isLightMode}
      />

      <div className="app-container">
        <h1>{isLightMode ? 'Sudoku Solar' : 'Sudoku Cosmic'}</h1>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={() => setIsLightMode(!isLightMode)} title="Toggle Theme">
          {isLightMode ? '☀️' : '🌑'}
        </div>

        <div className="instructions-panel">
          <p>COMMAND CENTER</p>
          <p>Select Cell • Type 1-9 • Navigation Keys</p>
        </div>

        <div className="controls">
          <button onClick={() => startNewGame('easy')}>Initiate Easy</button>
          <button onClick={() => startNewGame('medium')}>Initiate Medium</button>
          <button onClick={() => startNewGame('hard')}>Initiate Hard</button>
        </div>
      </div>
    </>
  );
}

export default App;
