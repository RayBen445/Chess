import { useState, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function ConnectFourGame({ onBack }) {
  const rows = 6;
  const cols = 7;

  const [board, setBoard] = useState(Array(rows).fill(null).map(() => Array(cols).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [scores, setScores] = useState({ red: 0, yellow: 0, draws: 0 });

  const checkWinner = useCallback((board) => {
    // Check horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 3; c++) {
        if (board[r][c] && 
            board[r][c] === board[r][c+1] && 
            board[r][c] === board[r][c+2] && 
            board[r][c] === board[r][c+3]) {
          return { winner: board[r][c], cells: [[r,c], [r,c+1], [r,c+2], [r,c+3]] };
        }
      }
    }

    // Check vertical
    for (let r = 0; r < rows - 3; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] && 
            board[r][c] === board[r+1][c] && 
            board[r][c] === board[r+2][c] && 
            board[r][c] === board[r+3][c]) {
          return { winner: board[r][c], cells: [[r,c], [r+1,c], [r+2,c], [r+3,c]] };
        }
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r < rows - 3; r++) {
      for (let c = 0; c < cols - 3; c++) {
        if (board[r][c] && 
            board[r][c] === board[r+1][c+1] && 
            board[r][c] === board[r+2][c+2] && 
            board[r][c] === board[r+3][c+3]) {
          return { winner: board[r][c], cells: [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]] };
        }
      }
    }

    // Check diagonal (down-left)
    for (let r = 0; r < rows - 3; r++) {
      for (let c = 3; c < cols; c++) {
        if (board[r][c] && 
            board[r][c] === board[r+1][c-1] && 
            board[r][c] === board[r+2][c-2] && 
            board[r][c] === board[r+3][c-3]) {
          return { winner: board[r][c], cells: [[r,c], [r+1,c-1], [r+2,c-2], [r+3,c-3]] };
        }
      }
    }

    return null;
  }, []);

  const dropPiece = useCallback((col) => {
    if (winner) return;

    // Find the lowest empty row in this column
    let row = -1;
    for (let r = rows - 1; r >= 0; r--) {
      if (!board[r][col]) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (newBoard.every(row => row.every(cell => cell))) {
      setWinner('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
    }
  }, [board, currentPlayer, winner, checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(rows).fill(null).map(() => Array(cols).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
  }, []);

  const resetScores = useCallback(() => {
    setScores({ red: 0, yellow: 0, draws: 0 });
    resetGame();
  }, [resetGame]);

  const isWinningCell = (r, c) => {
    return winningCells.some(([wr, wc]) => wr === r && wc === c);
  };

  return (
    <div className="connect-four-game">
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
        <h1>🔴 Connect Four 🟡</h1>
        <p>Get four in a row to win!</p>
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
            text: 'Be the first player to connect four of your colored discs in a row - horizontally, vertically, or diagonally!'
          },
          {
            title: '🎮 How to Play',
            steps: [
              'Two players take turns (Red and Yellow)',
              'Click on any column to drop your disc',
              'Discs fall to the lowest available position in that column',
              'Red always goes first',
              'First player to get 4 in a row wins!',
              'If all slots fill up with no winner, it\'s a draw'
            ]
          },
          {
            title: '⚡ Strategy Tips',
            steps: [
              'Control the center column - it gives you more winning opportunities',
              'Watch for your opponent\'s three-in-a-row and block them',
              'Try to create multiple threats at once',
              'Think ahead - plan your moves 2-3 turns in advance'
            ]
          }
        ]} />

        {/* Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          minWidth: '300px'
        }}>
          {winner === 'draw' ? "It's a Draw!" : 
           winner ? `${winner === 'red' ? '🔴 Red' : '🟡 Yellow'} Wins!` :
           `${currentPlayer === 'red' ? '🔴 Red' : '🟡 Yellow'}'s Turn`}
        </div>

        {/* Board */}
        <div style={{
          background: 'rgba(30, 100, 200, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '20px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '10px'
        }}>
          {Array(rows).fill(null).map((_, r) =>
            Array(cols).fill(null).map((_, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => dropPiece(c)}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: board[r][c] === 'red' ? '#ff4444' :
                                   board[r][c] === 'yellow' ? '#ffeb3b' :
                                   'rgba(255, 255, 255, 0.2)',
                  cursor: (!winner && !board[r][c]) ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  boxShadow: isWinningCell(r, c) 
                    ? '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.5)'
                    : board[r][c] 
                    ? '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!winner && !board[r][c]) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!winner && !board[r][c]) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Scores */}
        <div style={{
          display: 'flex',
          gap: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🔴</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.red}</div>
          </div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>Draws</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.draws}</div>
          </div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🟡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.yellow}</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={resetGame}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(100, 150, 255, 0.4)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            🔄 New Game
          </button>
          <button
            onClick={resetScores}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(255, 100, 100, 0.4)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectFourGame;
