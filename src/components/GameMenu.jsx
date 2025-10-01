const GameMenu = ({ onSelectGame }) => {
  const games = [
    {
      id: 'chess',
      name: '♔ Chess',
      description: 'Classic chess with timers and AI',
      icon: '♔',
      color: 'rgba(100, 150, 255, 0.3)'
    },
    {
      id: 'tictactoe',
      name: '✖ Tic-Tac-Toe',
      description: 'Classic X and O game',
      icon: '✖',
      color: 'rgba(255, 150, 100, 0.3)'
    },
    {
      id: 'matching',
      name: '🎴 Matching Game',
      description: 'Memory card matching game',
      icon: '🎴',
      color: 'rgba(150, 255, 100, 0.3)'
    },
    {
      id: 'simon',
      name: '🎵 Simon Says',
      description: 'Memory sequence game',
      icon: '🎵',
      color: 'rgba(255, 100, 200, 0.3)'
    },
    {
      id: 'snake',
      name: '🐍 Snake',
      description: 'Classic snake game',
      icon: '🐍',
      color: 'rgba(100, 255, 150, 0.3)'
    },
    {
      id: '2048',
      name: '🎲 2048',
      description: 'Slide and merge tiles',
      icon: '🎲',
      color: 'rgba(200, 150, 255, 0.3)'
    }
  ];

  return (
    <div className="game-menu">
      <div className="menu-header">
        <h1>🎮 Cool Shot Systems Game Hub</h1>
        <p>Choose your game and start playing!</p>
      </div>
      
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => onSelectGame(game.id)}
            style={{
              background: game.color,
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'white',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
            }}
          >
            <div style={{ fontSize: '4rem' }}>{game.icon}</div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{game.name}</h2>
            <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
              {game.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
