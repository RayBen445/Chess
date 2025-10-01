import { useState, useEffect, useCallback, useRef } from 'react';

function SnakeGame({ onBack }) {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef(null);

  const gridSize = 20;
  const cellSize = 25;

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((snakeBody) => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize)
      ];
    } while (snakeBody.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }, []);

  const checkCollision = useCallback((head, snakeBody) => {
    // Check wall collision
    if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize) {
      return true;
    }
    // Check self collision
    return snakeBody.some(segment => segment[0] === head[0] && segment[1] === head[1]);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = [...prevSnake[0]];
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP':
          head[1] -= 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'RIGHT':
          head[0] += 1;
          break;
        default:
          break;
      }

      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) {
          setHighScore(score);
        }
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if food is eaten
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed(prev => Math.max(50, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, checkCollision, generateFood, score, highScore]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [isPlaying, gameOver, moveSnake, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      const currentDirection = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDirection !== 'DOWN') setDirection('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDirection !== 'UP') setDirection('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDirection !== 'RIGHT') setDirection('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDirection !== 'LEFT') setDirection('RIGHT');
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  const startGame = useCallback(() => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(150);
  }, []);

  return (
    <div className="snake-game">
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
        <h1>🐍 Snake Game</h1>
        <p>Eat the food and grow! Use arrow keys or WASD</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
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
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>High Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{highScore}</div>
          </div>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Length</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{snake.length}</div>
          </div>
        </div>

        {/* Game Status */}
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
          width: gridSize * cellSize,
          height: gridSize * cellSize,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Grid lines */}
          {Array.from({ length: gridSize }).map((_, i) => (
            <div
              key={`h-${i}`}
              style={{
                position: 'absolute',
                top: i * cellSize,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            />
          ))}
          {Array.from({ length: gridSize }).map((_, i) => (
            <div
              key={`v-${i}`}
              style={{
                position: 'absolute',
                top: 0,
                left: i * cellSize,
                width: '1px',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            />
          ))}

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: segment[0] * cellSize,
                top: segment[1] * cellSize,
                width: cellSize - 2,
                height: cellSize - 2,
                backgroundColor: index === 0 ? '#4ade80' : '#22c55e',
                borderRadius: '3px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.05s ease'
              }}
            />
          ))}

          {/* Food */}
          <div
            style={{
              position: 'absolute',
              left: food[0] * cellSize,
              top: food[1] * cellSize,
              width: cellSize - 2,
              height: cellSize - 2,
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
            }}
          />
        </div>

        {/* On-Screen Control Buttons */}
        {isPlaying && !gameOver && (
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
              onClick={() => {
                if (directionRef.current !== 'DOWN') setDirection('UP');
              }}
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
              onClick={() => {
                if (directionRef.current !== 'RIGHT') setDirection('LEFT');
              }}
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
              onClick={() => {
                if (directionRef.current !== 'LEFT') setDirection('RIGHT');
              }}
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
              onClick={() => {
                if (directionRef.current !== 'UP') setDirection('DOWN');
              }}
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
          onClick={startGame}
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
          {isPlaying && !gameOver ? '🔄 Restart Game' : '🎮 Start Game'}
        </button>
      </div>
    </div>
  );
}

export default SnakeGame;
