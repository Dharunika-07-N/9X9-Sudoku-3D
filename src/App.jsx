import { useState, useEffect, useRef } from 'react';
import { generateSudoku, BLANK, isValid } from './game/sudokuGenerator';
import { SudokuBoard } from './components/ui/SudokuBoard';
import { WinModal } from './components/ui/WinModal';
import './App.css';

function App() {
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [solverStatus, setSolverStatus] = useState({
    action: 'Ready',
    cell: '-',
    value: '-',
    type: '',
    log: []
  });
  const solvingRef = useRef(false);

  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('sudoku-level') || '1'));

  useEffect(() => {
    localStorage.setItem('sudoku-level', level);
  }, [level]);

  useEffect(() => {
    startNewGame(level);
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
      if (!selectedCell || isSolving || isGameWon) return;
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
  }, [selectedCell, board, game, isSolving, isGameWon]);

  const startNewGame = (diffOrLevel = level) => {
    solvingRef.current = false;
    setIsSolving(false);
    setIsGameWon(false);

    // If it's a string (easy/medium/hard), we don't change the numeric level state conceptually,
    // or we could map it. Let's just pass it through.
    // If it's a number, we update the level state if needed?
    // Let's decide: "Levels" is the main way.
    // If user clicks "Easy", that's Level 1. "Medium" -> Level 10. "Hard" -> Level 20.

    let newLevel = diffOrLevel;
    if (typeof diffOrLevel === 'string') {
      if (diffOrLevel === 'easy') newLevel = 1;
      if (diffOrLevel === 'medium') newLevel = 10;
      if (diffOrLevel === 'hard') newLevel = 20;
    }

    setLevel(newLevel);
    setDifficulty(newLevel); // Difficulty is now numeric mostly

    const newGame = generateSudoku(newLevel);
    setGame(newGame);
    setBoard(newGame.initial.map(row => [...row]));
    setSelectedCell(null);
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    startNewGame(nextLevel);
  };

  const checkWin = (currentBoard) => {
    if (!game || !game.solution) return;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j] !== game.solution[i][j]) return;
      }
    }
    setIsGameWon(true);
  };

  const fillCell = (row, col, value) => {
    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = value;
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const handleCellClick = (row, col) => {
    if (!isSolving && !isGameWon) {
      setSelectedCell({ row, col });
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const solveStepByStep = async () => {
    if (!game) return;

    // Reset to initial state to ensure clean solve
    const currentBoard = game.initial.map(row => [...row]);
    setBoard(currentBoard.map(row => [...row]));
    setIsSolving(true);
    setSolverStatus({ action: 'Starting...', cell: '-', value: '-', log: [] });
    solvingRef.current = true;

    const solved = await solveRecursively(currentBoard);

    setIsSolving(false);
    solvingRef.current = false;

    if (solved) {
      setIsGameWon(true);
    }
  };

  const solveRecursively = async (tempBoard) => {
    if (!solvingRef.current) return false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (tempBoard[row][col] === BLANK) {
          for (let num = 1; num <= 9; num++) {
            // Update status
            const statusMsg = `Trying ${num} at [${row}, ${col}]`;
            setSolverStatus(prev => ({
              action: 'Trying',
              cell: `R${row + 1} C${col + 1}`,
              value: num,
              log: [statusMsg, ...prev.log].slice(0, 5)
            }));

            if (isValid(tempBoard, row, col, num)) {
              tempBoard[row][col] = num;

              // Update visual state
              setBoard(tempBoard.map(r => [...r]));
              await sleep(20); // Delay for visualization

              if (await solveRecursively(tempBoard)) return true;

              // Backtrack
              setSolverStatus(prev => ({
                action: 'Backtracking',
                cell: `R${row + 1} C${col + 1}`,
                value: 'X',
                log: [`Backtracking from [${row}, ${col}]`, ...prev.log].slice(0, 5)
              }));

              tempBoard[row][col] = BLANK;
              setBoard(tempBoard.map(r => [...r]));
              // await sleep(5); // Optional: faster backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const solveGame = () => {
    if (game && game.solution) {
      setBoard(game.solution.map(row => [...row]));
    }
  };

  return (
    <div className="hero-section">
      <div className="theme-toggle" onClick={() => setIsLightMode(!isLightMode)} title="Toggle Theme">
        {isLightMode ? '☀️' : '🌑'}
      </div>

      <h1>{isLightMode ? 'Sudoku Solar' : 'Sudoku Cosmic'}</h1>
      <h2 style={{ fontFamily: 'Rajdhani', margin: '0 0 1rem 0', color: isLightMode ? '#666' : '#ccc' }}>
        LEVEL {level}
      </h2>

      <SudokuBoard
        board={board}
        initialBoard={game?.initial}
        onCellClick={handleCellClick}
        selectedCell={selectedCell}
        isLightMode={isLightMode}
      />

      <div className="controls">
        <button onClick={() => startNewGame('easy')}>Reset to Level 1</button>
        <button onClick={() => startNewGame('medium')}>Skip to Level 10</button>
        <button onClick={() => startNewGame('hard')}>Skip to Level 20</button>
        <button
          onClick={solveStepByStep}
          style={{ borderColor: isLightMode ? '#0066cc' : '#ff00ff', color: isLightMode ? '#0066cc' : '#ff00ff' }}
          disabled={isSolving}
        >
          {isSolving ? 'Auto-Solve' : 'Solve'}
        </button>
      </div>

      <div className="instructions-panel" style={{ position: 'relative', top: 'auto', left: 'auto', marginTop: '2rem' }}>
        <p>COMMAND CENTER</p>
        <p>Select Cell • Type 1-9 • Navigation Keys</p>
      </div>

      {isSolving && (
        <div className="solver-status-panel" style={{ position: 'absolute', top: '2rem', left: '2rem', right: 'auto', transform: 'none' }}>
          <h3>Solver Logic</h3>
          <div className="status-item">
            <span className="label">Action:</span>
            <span className="value">{solverStatus.action}</span>
          </div>
          <div className="status-item">
            <span className="label">Cell:</span>
            <span className="value">{solverStatus.cell}</span>
          </div>
          <div className="status-item">
            <span className="label">Value:</span>
            <span className={`value ${solverStatus.type || ''}`}>{solverStatus.value}</span>
          </div>
          <div className="log-container">
            {solverStatus.log.map((entry, i) => (
              <div key={i} className="log-entry">{entry}</div>
            ))}
          </div>
        </div>
      )}

      {isGameWon && (
        <WinModal
          onClose={() => setIsGameWon(false)}
          difficulty={difficulty}
          onPlayAgain={() => startNewGame(level)}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}

export default App;
