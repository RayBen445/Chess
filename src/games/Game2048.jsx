import { useState, useEffect, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function Game2048({ onBack }) {
  const gridSize = 4;
  
  const addRandomTile = (currentGrid) => {
    const emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const initializeGrid = () => {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    addRandomTile(grid);
    addRandomTile(grid);
    return grid;
  };

  const [grid, setGrid] = useState(initializeGrid);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const canMove = (currentGrid) => {
    // Check for empty cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (currentGrid[i][j] === 0) return true;
        if (j < gridSize - 1 && currentGrid[i][j] === currentGrid[i][j + 1]) return true;
        if (i < gridSize - 1 && currentGrid[i][j] === currentGrid[i + 1][j]) return true;
      }
    }
    return false;
  };

  const moveLeft = (currentGrid) => {
    let moved = false;
    let newScore = 0;
    const newGrid = currentGrid.map(row => [...row]);

    for (let i = 0; i < gridSize; i++) {
      const row = newGrid[i].filter(val => val !== 0);
      const newRow = [];
      
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = row[j] * 2;
          newRow.push(mergedValue);
          newScore += mergedValue;
          if (mergedValue === 2048) setWon(true);
          j++;
          moved = true;
        } else {
          newRow.push(row[j]);
        }
      }
      
      while (newRow.length < gridSize) {
        newRow.push(0);
      }
      
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      newGrid[i] = newRow;
    }

    return { grid: newGrid, moved, score: newScore };
  };

  const rotateGrid = (currentGrid) => {
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newGrid[j][gridSize - 1 - i] = currentGrid[i][j];
      }
    }
    return newGrid;
  };

  const move = useCallback((direction) => {
    if (gameOver) return;

    let currentGrid = grid.map(row => [...row]);
    let rotations = 0;

    switch (direction) {
      case 'right':
        rotations = 2;
        break;
      case 'up':
        rotations = 3;
        break;
      case 'down':
        rotations = 1;
        break;
      default:
        rotations = 0;
    }

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    const { grid: movedGrid, moved, score: addedScore } = moveLeft(currentGrid);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentGrid = rotateGrid(movedGrid);
    }

    if (moved) {
      addRandomTile(currentGrid);
      setGrid(currentGrid);
      setScore(prev => {
        const newScore = prev + addedScore;
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });

      if (!canMove(currentGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver, highScore]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          move('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          move('right');
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          move('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          move('down');
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameOver]);

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const getTileColor = (value) => {
    const colors = {
      0: 'rgba(238, 228, 218, 0.35)',
      2: 'rgba(238, 228, 218, 0.8)',
      4: 'rgba(237, 224, 200, 0.8)',
      8: 'rgba(242, 177, 121, 0.8)',
      16: 'rgba(245, 149, 99, 0.8)',
      32: 'rgba(246, 124, 95, 0.8)',
      64: 'rgba(246, 94, 59, 0.8)',
      128: 'rgba(237, 207, 114, 0.8)',
      256: 'rgba(237, 204, 97, 0.8)',
      512: 'rgba(237, 200, 80, 0.8)',
      1024: 'rgba(237, 197, 63, 0.8)',
      2048: 'rgba(237, 194, 46, 0.8)'
    };
    return colors[value] || 'rgba(60, 58, 50, 0.8)';
  };

  const getTileSize = (value) => {
    if (value >= 1000) return '2rem';
    if (value >= 100) return '2.5rem';
    return '3rem';
  };

  return (
    <div className="game-2048">
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
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ← Back to Games
      </button>

      <div className="game-header">
        <h1>🎲 2048</h1>
        <p>Join the tiles to reach 2048! Use arrow keys or WASD</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* How to Play */}
        <HowToPlay instructions={[
          {
            title: '🎯 Objective',
            text: 'Combine tiles with the same numbers to reach the 2048 tile!'
          },
          {
            title: '🎮 Controls',
            steps: [
              'Use Arrow Keys (↑ ↓ ← →) or WASD to slide tiles',
              'Use on-screen buttons for touch devices',
              'All tiles slide in the chosen direction until they hit a wall or another tile'
            ]
          },
          {
            title: '⚡ Gameplay',
            steps: [
              'When two tiles with the same number touch, they merge into one',
              'The merged tile\'s value is the sum of the two tiles',
              'After each move, a new tile (2 or 4) appears in a random empty spot',
              'Keep combining tiles to reach 2048!',
              'Game ends when no moves are possible'
            ]
          },
          {
            title: '💡 Tips',
            text: 'Keep your highest tile in a corner and build around it. Try to create sequences of descending numbers!'
          }
        ]} />

        {/* Score Display */}
        <div style={{
          display: 'flex',
          gap: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '20px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Best</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{highScore}</div>
          </div>
        </div>

        {/* Game Status */}
        {won && !gameOver && (
          <div style={{
            background: 'rgba(100, 255, 100, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(100, 255, 100, 0.5)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
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
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Game Over! Final Score: {score}
          </div>
        )}

        {/* Game Board */}
        <div style={{
          background: 'rgba(187, 173, 160, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '15px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px'
        }}>
          {grid.map((row, i) =>
            row.map((value, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: getTileColor(value),
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: getTileSize(value),
                  fontWeight: 'bold',
                  color: value <= 4 ? '#776e65' : '#f9f6f2',
                  transition: 'all 0.15s ease',
                  boxShadow: value !== 0 ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                {value !== 0 && value}
              </div>
            ))
          )}
        </div>

        {/* On-Screen Control Buttons */}
        {!gameOver && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 80px)',
            gridTemplateRows: 'repeat(3, 80px)',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            <div></div>
            <button
              onClick={() => move('up')}
              style={{
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '2rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => move('left')}
              style={{
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '2rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              ←
            </button>
            <div></div>
            <button
              onClick={() => move('right')}
              style={{
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '2rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              →
            </button>
            <div></div>
            <button
              onClick={() => move('down')}
              style={{
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(100, 150, 255, 0.4)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '2rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              ↓
            </button>
            <div></div>
          </div>
        )}

        {/* Controls */}
        <button
          onClick={resetGame}
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
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
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
          🔄 New Game
        </button>
      </div>
    </div>
  );
}

export default Game2048;
