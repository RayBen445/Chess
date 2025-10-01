import { useState, useCallback } from 'react';

function TicTacToeGame({ onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'ai'

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  const getAIMove = (squares) => {
    // Simple AI: Try to win, block opponent, or take center/corner
    const availableSquares = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    
    // Check if AI can win
    for (let i of availableSquares) {
      const testSquares = [...squares];
      testSquares[i] = 'O';
      if (calculateWinner(testSquares)?.winner === 'O') {
        return i;
      }
    }
    
    // Check if need to block player
    for (let i of availableSquares) {
      const testSquares = [...squares];
      testSquares[i] = 'X';
      if (calculateWinner(testSquares)?.winner === 'X') {
        return i;
      }
    }
    
    // Take center if available
    if (availableSquares.includes(4)) return 4;
    
    // Take corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(c => availableSquares.includes(c));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available
    return availableSquares[Math.floor(Math.random() * availableSquares.length)];
  };

  const handleClick = useCallback((index) => {
    if (board[index] || calculateWinner(board)) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const result = calculateWinner(newBoard);
    if (result) {
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (isBoardFull(newBoard)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else if (gameMode === 'ai' && isXNext) {
      // AI's turn after player moves
      setTimeout(() => {
        const aiMove = getAIMove(newBoard);
        if (aiMove !== undefined) {
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = 'O';
          setBoard(aiBoard);
          
          const aiResult = calculateWinner(aiBoard);
          if (aiResult) {
            setScores(prev => ({ ...prev, [aiResult.winner]: prev[aiResult.winner] + 1 }));
          } else if (isBoardFull(aiBoard)) {
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          }
        }
      }, 500);
      return; // Don't toggle turn yet
    }
    
    setIsXNext(!isXNext);
  }, [board, isXNext, gameMode]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }, []);

  const resetScores = useCallback(() => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  }, [resetGame]);

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  const isDraw = !winner && isBoardFull(board);
  
  let status;
  if (winner) {
    status = `Winner: ${winner}!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="tictactoe-game">
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
        <h1>✖ Tic-Tac-Toe ⭕</h1>
        <p>Classic X and O game</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Game Mode Selection */}
        <div style={{
          display: 'flex',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button
            onClick={() => {
              setGameMode('pvp');
              resetGame();
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: gameMode === 'pvp' ? 'rgba(100, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Player vs Player
          </button>
          <button
            onClick={() => {
              setGameMode('ai');
              resetGame();
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: gameMode === 'ai' ? 'rgba(100, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Player vs AI
          </button>
        </div>

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
          {status}
        </div>

        {/* Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                width: '100px',
                height: '100px',
                fontSize: '3rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: winningLine.includes(index) 
                  ? 'rgba(100, 255, 100, 0.4)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: value === 'X' ? '#ff6b6b' : value === 'O' ? '#4ecdc4' : 'transparent',
                cursor: value || winner ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!value && !winner) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!value && !winner) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {value}
            </button>
          ))}
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
            <div style={{ fontSize: '2rem', color: '#ff6b6b' }}>X</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.X}</div>
          </div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>Draws</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.draws}</div>
          </div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#4ecdc4' }}>O</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scores.O}</div>
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
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(100, 150, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(100, 150, 255, 0.4)';
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
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 100, 100, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 100, 100, 0.4)';
            }}
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicTacToeGame;
