import { useState, useEffect, useCallback } from 'react';
import HowToPlay from '../components/HowToPlay';

function MatchingGame({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // veryeasy, easy, medium, hard, expert

  const emojis = {
    veryeasy: ['🎮', '🎯', '🎨', '🎭'],
    easy: ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'],
    medium: ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎼', '🎹'],
    hard: ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎼', '🎹', '🎲', '🎰', '🎳', '🎴'],
    expert: ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎼', '🎹', '🎲', '🎰', '🎳', '🎴', '🏀', '⚽', '🏈', '⚾']
  };

  const initializeGame = useCallback((diff) => {
    const selectedEmojis = emojis[diff];
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    const shuffled = cardPairs
      .map((emoji, index) => ({ id: index, emoji, matched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty, initializeGame]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards]);

  const handleCardClick = useCallback((index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    ) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped, matched, cards]);

  const resetGame = useCallback(() => {
    initializeGame(difficulty);
  }, [difficulty, initializeGame]);

  const changeDifficulty = useCallback((diff) => {
    setDifficulty(diff);
  }, []);

  const gridCols = {
    veryeasy: 4,
    easy: 3,
    medium: 4,
    hard: 6,
    expert: 6
  };

  const difficultyLabels = {
    veryeasy: 'Very Easy',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert'
  };

  return (
    <div className="matching-game">
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
        <h1>🎴 Matching Game</h1>
        <p>Find all the matching pairs!</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* How to Play */}
        <HowToPlay instructions={[
          {
            title: '🎯 Objective',
            text: 'Find all matching pairs of cards by remembering their positions!'
          },
          {
            title: '🎮 How to Play',
            steps: [
              'Choose a difficulty level (Very Easy to Expert)',
              'Click on a card to flip it and reveal the emoji',
              'Click on a second card to try to find its match',
              'If the cards match, they stay flipped',
              'If they don\'t match, they flip back over',
              'Match all pairs to win!'
            ]
          },
          {
            title: '📊 Difficulty Levels',
            steps: [
              'Very Easy: 4 pairs (8 cards)',
              'Easy: 6 pairs (12 cards)',
              'Medium: 10 pairs (20 cards)',
              'Hard: 14 pairs (28 cards)',
              'Expert: 18 pairs (36 cards)'
            ]
          },
          {
            title: '💡 Tip',
            text: 'Pay attention to card positions and try to remember where each emoji is located!'
          }
        ]} />

        {/* Difficulty Selection */}
        <div style={{
          display: 'flex',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {['veryeasy', 'easy', 'medium', 'hard', 'expert'].map((diff) => (
            <button
              key={diff}
              onClick={() => changeDifficulty(diff)}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: difficulty === diff ? 'rgba(100, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              {difficultyLabels[diff]} ({emojis[diff].length})
            </button>
          ))}
        </div>

        {/* Stats */}
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
            <div style={{ fontSize: '1rem', opacity: 0.7 }}>Moves</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{moves}</div>
          </div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', opacity: 0.7 }}>Matched</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{matched.length / 2} / {cards.length / 2}</div>
          </div>
        </div>

        {/* Game Won Message */}
        {gameWon && (
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
            🎉 Congratulations! You won in {moves} moves! 🎉
          </div>
        )}

        {/* Game Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols[difficulty]}, 1fr)`,
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                style={{
                  width: (difficulty === 'hard' || difficulty === 'expert') ? '80px' : '100px',
                  height: (difficulty === 'hard' || difficulty === 'expert') ? '80px' : '100px',
                  fontSize: (difficulty === 'hard' || difficulty === 'expert') ? '2.5rem' : '3rem',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: matched.includes(index)
                    ? 'rgba(100, 255, 100, 0.4)'
                    : isFlipped
                    ? 'rgba(100, 150, 255, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: matched.includes(index) ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  if (!matched.includes(index) && !isFlipped) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'rotateY(180deg) scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!matched.includes(index) && !isFlipped) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'rotateY(180deg) scale(1)';
                  }
                }}
              >
                {isFlipped ? card.emoji : '?'}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <button
          onClick={resetGame}
          style={{
            padding: '15px 30px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(100, 150, 255, 0.4)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1.1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
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

export default MatchingGame;
