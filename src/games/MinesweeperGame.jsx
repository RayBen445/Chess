import { useState, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function MinesweeperGame({ onBack }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 }
  };

  const config = difficulties[difficulty];

  const initializeBoard = useCallback(() => {
    const { rows, cols, mines } = config;
    const newBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
    const newRevealed = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const newFlagged = Array(rows).fill(null).map(() => Array(cols).fill(false));

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (newBoard[row][col] !== -1) {
        newBoard[row][col] = -1;
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc] === -1) {
              count++;
            }
          }
        }
        newBoard[r][c] = count;
      }
    }

    setBoard(newBoard);
    setRevealed(newRevealed);
    setFlagged(newFlagged);
    setGameOver(false);
    setWon(false);
    setGameStarted(true);
  }, [config]);

  const revealCell = useCallback((row, col) => {
    if (gameOver || won || revealed[row][col] || flagged[row][col]) return;

    const newRevealed = revealed.map(r => [...r]);
    
    const reveal = (r, c) => {
      if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
      if (newRevealed[r][c] || flagged[r][c]) return;
      
      newRevealed[r][c] = true;
      
      if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              reveal(r + dr, c + dc);
            }
          }
        }
      }
    };

    if (board[row][col] === -1) {
      // Hit a mine
      setGameOver(true);
      // Reveal all mines
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (board[r][c] === -1) {
            newRevealed[r][c] = true;
          }
        }
      }
    } else {
      reveal(row, col);
      
      // Check win condition
      let unrevealedCount = 0;
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (!newRevealed[r][c] && board[r][c] !== -1) {
            unrevealedCount++;
          }
        }
      }
      if (unrevealedCount === 0) {
        setWon(true);
      }
    }

    setRevealed(newRevealed);
  }, [board, revealed, flagged, gameOver, won, config]);

  const toggleFlag = useCallback((e, row, col) => {
    e.preventDefault();
    if (gameOver || won || revealed[row][col]) return;
    
    const newFlagged = flagged.map(r => [...r]);
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
  }, [flagged, revealed, gameOver, won]);

  const getCellContent = (row, col) => {
    if (flagged[row][col]) return '🚩';
    if (!revealed[row][col]) return '';
    if (board[row][col] === -1) return '💣';
    if (board[row][col] === 0) return '';
    return board[row][col];
  };

  const getCellColor = (value) => {
    const colors = {
      1: '#0000ff',
      2: '#008000',
      3: '#ff0000',
      4: '#000080',
      5: '#800000',
      6: '#008080',
      7: '#000000',
      8: '#808080'
    };
    return colors[value] || '#000';
  };

  const minesRemaining = config.mines - flagged.flat().filter(Boolean).length;

  return (
    <div className="minesweeper-game">
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
        <h1>💣 Minesweeper</h1>
        <p>Find all mines without clicking on them!</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* How to Play */}
        <HowToPlay instructions={[
          {
            title: '🎯 Objective',
            text: 'Reveal all safe squares without clicking on any mines!'
          },
          {
            title: '🎮 Controls',
            steps: [
              'Left Click: Reveal a square',
              'Right Click: Place or remove a flag (mark suspected mines)',
              'Numbers show how many mines are adjacent to that square',
              'Empty squares with no adjacent mines auto-reveal neighbors'
            ]
          },
          {
            title: '📊 Difficulty Levels',
            steps: [
              'Easy: 9x9 grid with 10 mines',
              'Medium: 16x16 grid with 40 mines',
              'Hard: 16x30 grid with 99 mines'
            ]
          },
          {
            title: '⚡ Gameplay',
            steps: [
              'The first click is always safe',
              'Use numbers to deduce where mines are',
              'Flag all suspected mines',
              'Reveal all safe squares to win',
              'Clicking a mine ends the game'
            ]
          },
          {
            title: '💡 Tips',
            text: 'Start from corners and edges. If a square shows "1" and has only one unrevealed neighbor, that neighbor is definitely a mine!'
          }
        ]} />

        {/* Difficulty Selection */}
        {!gameStarted && (
          <div style={{
            display: 'flex',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: difficulty === diff ? 'rgba(100, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        {gameStarted && (
          <div style={{
            display: 'flex',
            gap: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px 30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <span>💣 Mines: {minesRemaining}</span>
          </div>
        )}

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
            🎉 You Won! 🎉
          </div>
        )}

        {gameOver && (
          <div style={{
            background: 'rgba(255, 100, 100, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(255, 100, 100, 0.5)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            💥 Game Over! 💥
          </div>
        )}

        {/* Game Board */}
        {gameStarted && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            display: 'grid',
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            gap: '2px',
            maxHeight: '70vh',
            overflow: 'auto'
          }}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    width: difficulty === 'hard' ? '30px' : '40px',
                    height: difficulty === 'hard' ? '30px' : '40px',
                    border: 'none',
                    borderRadius: '3px',
                    backgroundColor: revealed[r][c] 
                      ? (board[r][c] === -1 ? 'rgba(255, 50, 50, 0.6)' : 'rgba(200, 200, 200, 0.3)')
                      : 'rgba(255, 255, 255, 0.3)',
                    color: revealed[r][c] ? getCellColor(board[r][c]) : 'white',
                    fontSize: difficulty === 'hard' ? '1rem' : '1.2rem',
                    fontWeight: 'bold',
                    cursor: (gameOver || won || revealed[r][c]) ? 'default' : 'pointer',
                    transition: 'all 0.1s ease'
                  }}
                >
                  {getCellContent(r, c)}
                </button>
              ))
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!gameStarted ? (
            <button
              onClick={initializeBoard}
              style={{
                padding: '15px 40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1.2rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              🎮 Start Game
            </button>
          ) : (
            <button
              onClick={() => {
                setGameStarted(false);
                setBoard([]);
              }}
              style={{
                padding: '15px 40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1.2rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              🔄 New Game
            </button>
          )}
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '10px 15px',
          color: 'white',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          💡 Left click to reveal, Right click to flag
        </div>
      </div>
    </div>
  );
}

export default MinesweeperGame;
