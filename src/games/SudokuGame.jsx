import { useState, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function SudokuGame({ onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [selected, setSelected] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [won, setWon] = useState(false);

  const isValid = (board, row, col, num) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }
    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generatePuzzle = useCallback(() => {
    // Create a solved board
    const newBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first (they're independent)
    for (let box = 0; box < 3; box++) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      let idx = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          newBoard[box * 3 + r][box * 3 + c] = nums[idx++];
        }
      }
    }
    
    // Solve the rest
    solveSudoku(newBoard);
    
    // Save solution
    const sol = newBoard.map(row => [...row]);
    setSolution(sol);
    
    // Remove numbers to create puzzle (remove ~40-50 numbers for medium difficulty)
    const puzzle = newBoard.map(row => [...row]);
    const cellsToRemove = 45;
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }
    
    setBoard(puzzle);
    setInitialBoard(puzzle.map(row => [...row]));
    setGameStarted(true);
    setWon(false);
    setSelected(null);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (initialBoard[row][col] !== 0) return; // Can't change initial numbers
    setSelected({ row, col });
  }, [initialBoard]);

  const handleNumberInput = useCallback((num) => {
    if (!selected) return;
    const { row, col } = selected;
    if (initialBoard[row][col] !== 0) return;
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    
    // Check if puzzle is solved
    if (newBoard.every((row, r) => row.every((cell, c) => cell === solution[r][c]))) {
      setWon(true);
    }
  }, [selected, board, initialBoard, solution]);

  const getCellColor = (row, col) => {
    if (initialBoard[row][col] !== 0) {
      return 'rgba(200, 200, 255, 0.4)'; // Initial cells
    }
    if (board[row][col] !== 0 && board[row][col] !== solution[row][col]) {
      return 'rgba(255, 100, 100, 0.4)'; // Wrong cells
    }
    if (selected && selected.row === row && selected.col === col) {
      return 'rgba(100, 200, 255, 0.6)'; // Selected cell
    }
    return 'rgba(255, 255, 255, 0.2)'; // Empty cells
  };

  return (
    <div className="sudoku-game">
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
          zIndex: 1000
        }}
      >
        ← Back to Games
      </button>

      <div className="game-header">
        <h1>🔢 Sudoku</h1>
        <p>Fill the grid with numbers 1-9!</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* How to Play */}
        <HowToPlay instructions={[
          {
            title: '🎯 Objective',
            text: 'Fill the 9x9 grid so that each row, column, and 3x3 box contains the digits 1-9 without repetition.'
          },
          {
            title: '🎮 How to Play',
            steps: [
              'Click on any empty white cell to select it',
              'Type a number (1-9) to fill the cell',
              'The puzzle starts with some cells already filled (gray cells)',
              'You cannot edit the pre-filled gray cells',
              'Invalid entries will be highlighted in red'
            ]
          },
          {
            title: '📏 Rules',
            steps: [
              'Each row must contain numbers 1-9 exactly once',
              'Each column must contain numbers 1-9 exactly once',
              'Each of the nine 3x3 boxes must contain numbers 1-9 exactly once',
              'No number can repeat in its row, column, or 3x3 box'
            ]
          },
          {
            title: '💡 Strategy Tips',
            steps: [
              'Start with rows/columns/boxes that have the most filled cells',
              'Look for cells where only one number is possible',
              'Use process of elimination',
              'Check each move carefully before entering'
            ]
          }
        ]} />

        {/* Game Status */}
        {won && (
          <div style={{
            background: 'rgba(100, 255, 100, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(100, 255, 100, 0.5)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🎉 Puzzle Solved! 🎉
          </div>
        )}

        {/* Sudoku Board */}
        {gameStarted && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)',
            gap: '2px'
          }}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: `2px solid ${(r % 3 === 0 && r !== 0) || (c % 3 === 0 && c !== 0) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '3px',
                    backgroundColor: getCellColor(r, c),
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    cursor: initialBoard[r][c] !== 0 ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              ))
            )}
          </div>
        )}

        {/* Number Input */}
        {gameStarted && !won && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(100, 150, 255, 0.5)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {num === 0 ? '✖' : num}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <button
          onClick={generatePuzzle}
          style={{
            padding: '15px 40px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(100, 150, 255, 0.4)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1.2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(100, 150, 255, 0.6)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(100, 150, 255, 0.4)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {gameStarted ? '🔄 New Puzzle' : '🎮 Start Game'}
        </button>
      </div>
    </div>
  );
}

export default SudokuGame;
