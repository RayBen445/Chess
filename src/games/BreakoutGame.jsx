import { useState, useEffect, useRef, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function BreakoutGame({ onBack }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 100, height: 15, speed: 8 },
    ball: { x: 0, y: 0, dx: 3, dy: -3, radius: 8 },
    bricks: [],
    keys: {}
  });

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Initialize paddle
    gameStateRef.current.paddle = {
      x: width / 2 - 50,
      y: height - 30,
      width: 100,
      height: 15,
      speed: 8
    };

    // Initialize ball
    gameStateRef.current.ball = {
      x: width / 2,
      y: height - 50,
      dx: 3,
      dy: -3,
      radius: 8
    };

    // Initialize bricks
    const brickRows = 5;
    const brickCols = 8;
    const brickWidth = 70;
    const brickHeight = 25;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 35;
    const bricks = [];

    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        bricks.push({
          x: col * (brickWidth + brickPadding) + brickOffsetLeft,
          y: row * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          status: 1,
          color: `hsl(${row * 36}, 70%, 60%)`
        });
      }
    }

    gameStateRef.current.bricks = bricks;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawPaddle = () => {
      const { paddle } = gameStateRef.current;
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;
    };

    const drawBall = () => {
      const { ball } = gameStateRef.current;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const drawBricks = () => {
      gameStateRef.current.bricks.forEach(brick => {
        if (brick.status === 1) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });
    };

    const collisionDetection = () => {
      const { ball, bricks } = gameStateRef.current;
      
      bricks.forEach(brick => {
        if (brick.status === 1) {
          if (ball.x > brick.x && ball.x < brick.x + brick.width &&
              ball.y > brick.y && ball.y < brick.y + brick.height) {
            ball.dy = -ball.dy;
            brick.status = 0;
            setScore(prev => {
              const newScore = prev + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
              }
              return newScore;
            });
            
            // Check win condition
            if (bricks.every(b => b.status === 0)) {
              setWon(true);
              setIsPlaying(false);
            }
          }
        }
      });
    };

    const update = () => {
      const { paddle, ball, keys } = gameStateRef.current;

      // Move paddle
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x = Math.max(0, paddle.x - paddle.speed);
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x = Math.min(width - paddle.width, paddle.x + paddle.speed);
      }

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Paddle collision
      if (ball.y + ball.radius > paddle.y &&
          ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        // Add angle based on where it hit the paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 8;
      }

      // Ball falls off bottom
      if (ball.y + ball.radius > height) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setIsPlaying(false);
          } else {
            // Reset ball
            ball.x = width / 2;
            ball.y = height - 50;
            ball.dx = 3;
            ball.dy = -3;
          }
          return newLives;
        });
      }

      collisionDetection();
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      drawBricks();
      drawPaddle();
      drawBall();
      update();
    };

    const gameLoop = setInterval(draw, 1000 / 60);

    const handleKeyDown = (e) => {
      gameStateRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, highScore]);

  return (
    <div className="breakout-game">
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
        <h1>🧱 Breakout</h1>
        <p>Break all the bricks! Use arrow keys or A/D</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* How to Play */}
        <HowToPlay instructions={[
          {
            title: '🎯 Objective',
            text: 'Break all the bricks by bouncing the ball with your paddle without letting it fall off the bottom!'
          },
          {
            title: '🎮 Controls',
            steps: [
              'Move your mouse left and right to control the paddle',
              'The paddle follows your mouse position horizontally',
              'Click "Start" to begin the game',
              'Click "Restart" to start over after game ends'
            ]
          },
          {
            title: '⚡ Gameplay',
            steps: [
              'The ball bounces off walls, paddle, and bricks',
              'Each brick gives you 10 points when broken',
              'Different colored bricks are worth different points',
              'You have 3 lives - you lose one each time the ball falls',
              'Game ends when you break all bricks (you win!) or run out of lives',
              'Ball speed increases as you break more bricks'
            ]
          },
          {
            title: '💡 Tips',
            steps: [
              'Hit the ball with the edge of the paddle to change its angle',
              'Aim for the top rows of bricks first',
              'Keep the paddle moving to reach the ball in time',
              'Try to beat your high score!'
            ]
          }
        ]} />

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '15px 30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          <span>Score: {score}</span>
          <span>High: {highScore}</span>
          <span>Lives: {'❤️'.repeat(lives)}</span>
        </div>

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
            🎉 Level Complete! 🎉
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
            Game Over! Final Score: {score}
          </div>
        )}

        {/* Game Canvas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '10px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{
              display: 'block',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Controls */}
        <button
          onClick={initializeGame}
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
          {isPlaying && !gameOver && !won ? '🔄 Restart' : '🎮 Start Game'}
        </button>
      </div>
    </div>
  );
}

export default BreakoutGame;
