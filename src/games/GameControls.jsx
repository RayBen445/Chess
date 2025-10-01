const GameControls = ({ 
  onReset, 
  onPrevious, 
  onNext, 
  onFlip, 
  onComputerMove,
  gameStatus,
  currentTurn,
  isComputerThinking,
  canGoBack,
  canGoForward
}) => {
  const getStatusMessage = () => {
    if (gameStatus.isCheckmate) {
      return `Checkmate! ${currentTurn === 'w' ? 'Black' : 'White'} wins!`;
    }
    if (gameStatus.isStalemate) {
      return 'Stalemate! Game is a draw.';
    }
    if (gameStatus.isDraw) {
      return 'Draw!';
    }
    if (gameStatus.inCheck) {
      return `${currentTurn === 'w' ? 'White' : 'Black'} is in check!`;
    }
    return `${currentTurn === 'w' ? 'White' : 'Black'} to move`;
  };

  const Button = ({ onClick, disabled, children, variant = 'default' }) => {
    const getBackgroundColor = () => {
      if (disabled) return 'rgba(100, 100, 100, 0.3)';
      if (variant === 'primary') return 'rgba(100, 150, 255, 0.4)';
      if (variant === 'danger') return 'rgba(255, 100, 100, 0.4)';
      return 'rgba(255, 255, 255, 0.2)';
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: getBackgroundColor(),
          color: disabled ? 'rgba(255, 255, 255, 0.4)' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = variant === 'primary' 
              ? 'rgba(100, 150, 255, 0.6)'
              : variant === 'danger'
              ? 'rgba(255, 100, 100, 0.6)'
              : 'rgba(255, 255, 255, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = getBackgroundColor();
          }
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '15px',
          textAlign: 'center',
          padding: '10px',
          background: gameStatus.inCheck 
            ? 'rgba(255, 100, 100, 0.3)'
            : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}
      >
        {getStatusMessage()}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '10px'
        }}
      >
        <Button onClick={onPrevious} disabled={!canGoBack}>
          ⬅️ Previous
        </Button>
        <Button onClick={onNext} disabled={!canGoForward}>
          Next ➡️
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Button onClick={onComputerMove} disabled={isComputerThinking} variant="primary">
          {isComputerThinking ? '🤔 Thinking...' : '🤖 Computer Move'}
        </Button>
        <Button onClick={onFlip}>
          🔄 Flip Board
        </Button>
        <Button onClick={onReset} variant="danger">
          🔄 New Game
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
