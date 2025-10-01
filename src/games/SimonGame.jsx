import { useState, useEffect, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function SimonGame({ onBack }) {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Level settings: sequence length and speed
  const levelSettings = {
    1: { startLength: 3, speed: 500 },
    2: { startLength: 4, speed: 450 },
    3: { startLength: 5, speed: 400 },
    4: { startLength: 6, speed: 350 },
    5: { startLength: 7, speed: 300 },
    6: { startLength: 9, speed: 250 },
    7: { startLength: 11, speed: 200 },
    8: { startLength: 13, speed: 150 },
    9: { startLength: 14, speed: 100 },
    10: { startLength: 15, speed: 70 }
  };

  const colors = ['red', 'blue', 'green', 'yellow'];
  const sounds = {
    red: 329.63,
    blue: 261.63,
    green: 392.00,
    yellow: 440.00
  };

  const playSound = useCallback((color) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = sounds[color];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  const flashButton = useCallback((color, duration) => {
    const actualDuration = duration || levelSettings[level].speed;
    return new Promise((resolve) => {
      setActiveButton(color);
      playSound(color);
      setTimeout(() => {
        setActiveButton(null);
        setTimeout(resolve, 100);
      }, actualDuration);
    });
  }, [playSound, level, levelSettings]);

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true);
    for (const color of sequence) {
      await flashButton(color);
    }
    setIsShowingSequence(false);
  }, [sequence, flashButton]);

  const startGame = useCallback(() => {
    const startLength = levelSettings[level].startLength;
    const newSequence = [];
    for (let i = 0; i < startLength; i++) {
      newSequence.push(colors[Math.floor(Math.random() * 4)]);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, [level, levelSettings]);

  const nextRound = useCallback(() => {
    const newSequence = [...sequence, colors[Math.floor(Math.random() * 4)]];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(prev => prev + 1);
  }, [sequence]);

  useEffect(() => {
    if (isPlaying && sequence.length > 0 && !isShowingSequence) {
      const timer = setTimeout(() => {
        showSequence();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, sequence, isShowingSequence, showSequence]);

  const handleButtonClick = useCallback((color) => {
    if (!isPlaying || isShowingSequence || gameOver) return;

    flashButton(color, 200);

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== color) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setTimeout(() => {
        nextRound();
      }, 1000);
    }
  }, [isPlaying, isShowingSequence, gameOver, playerSequence, sequence, flashButton, score, highScore, nextRound]);

  const getButtonColor = (color) => {
    const baseColors = {
      red: 'rgba(255, 50, 50, 0.8)',
      blue: 'rgba(50, 50, 255, 0.8)',
      green: 'rgba(50, 255, 50, 0.8)',
      yellow: 'rgba(255, 255, 50, 0.8)'
    };
    const activeColors = {
      red: 'rgba(255, 100, 100, 1)',
      blue: 'rgba(100, 100, 255, 1)',
      green: 'rgba(100, 255, 100, 1)',
      yellow: 'rgba(255, 255, 100, 1)'
    };
    return activeButton === color ? activeColors[color] : baseColors[color];
  };

  return (
    <div className="simon-game">
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
        <h1>🎵 Simon Says</h1>
        <p>Remember and repeat the sequence!</p>
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
            text: 'Watch the sequence of colored buttons flash and repeat it back correctly!'
          },
          {
            title: '🎮 How to Play',
            steps: [
              'Select a level (1-10) to set difficulty',
              'Click "Start" to begin the game',
              'Watch the sequence of colored buttons light up',
              'Each button makes a unique sound when it lights up',
              'After the sequence finishes, click the buttons in the same order',
              'If correct, the sequence gets one step longer',
              'If wrong, the game ends'
            ]
          },
          {
            title: '⚡ Levels',
            steps: [
              'Level 1: 3 colors, slow speed (perfect for beginners)',
              'Level 5: 7 colors, medium speed (moderate challenge)',
              'Level 10: 15 colors, very fast speed (expert only!)',
              'Higher levels = longer sequences and faster playback'
            ]
          },
          {
            title: '💡 Tip',
            text: 'Pay attention to both the visual patterns and the sounds - they help you remember the sequence!'
          }
        ]} />

        {/* Level Selector */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          width: '100%'
        }}>
          <div style={{ color: 'white', marginBottom: '15px', textAlign: 'center', fontSize: '1.1rem', fontWeight: '500' }}>
            Select Level
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lv) => (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                disabled={isPlaying && !gameOver}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  border: level === lv ? '3px solid rgba(100, 200, 255, 1)' : '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: level === lv ? 'rgba(100, 200, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  cursor: (isPlaying && !gameOver) ? 'not-allowed' : 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  opacity: (isPlaying && !gameOver) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isPlaying || gameOver) {
                    e.target.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {lv}
              </button>
            ))}
          </div>
          <div style={{ color: 'white', marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', opacity: 0.8 }}>
            Level {level}: {levelSettings[level].startLength} colors, {levelSettings[level].speed}ms speed
          </div>
        </div>

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

        {isShowingSequence && (
          <div style={{
            background: 'rgba(100, 150, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '15px 30px',
            border: '1px solid rgba(100, 150, 255, 0.5)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Watch the sequence...
          </div>
        )}

        {/* Simon Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          padding: '30px',
          border: '5px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          width: '400px',
          height: '400px'
        }}>
          {['red', 'blue', 'green', 'yellow'].map((color, index) => (
            <button
              key={color}
              onClick={() => handleButtonClick(color)}
              disabled={!isPlaying || isShowingSequence || gameOver}
              style={{
                width: '170px',
                height: '170px',
                border: 'none',
                borderRadius: index === 0 ? '100% 0 0 0' : 
                             index === 1 ? '0 100% 0 0' :
                             index === 2 ? '0 0 0 100%' : '0 0 100% 0',
                backgroundColor: getButtonColor(color),
                cursor: (!isPlaying || isShowingSequence || gameOver) ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s ease',
                boxShadow: activeButton === color ? 'inset 0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
                opacity: (!isPlaying || gameOver) ? 0.5 : 1
              }}
            />
          ))}
        </div>

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

export default SimonGame;
