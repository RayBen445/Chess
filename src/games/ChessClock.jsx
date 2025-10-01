const ChessClock = ({ whiteTime, blackTime, activePlayer, formatTime }) => {
  const ClockDisplay = ({ time, label, isActive }) => (
    <div
      style={{
        background: isActive 
          ? 'rgba(100, 200, 100, 0.3)' 
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '15px 20px',
        border: isActive 
          ? '2px solid rgba(100, 255, 100, 0.5)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        transition: 'all 0.3s ease',
        minWidth: '150px'
      }}
    >
      <div
        style={{
          color: time <= 60000 ? '#ff6b6b' : 'white',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}
      >
        {formatTime(time)}
      </div>
      <div
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          textAlign: 'center',
          marginTop: '5px'
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center'
      }}
    >
      <ClockDisplay
        time={blackTime}
        label="Black"
        isActive={activePlayer === 'b'}
      />
      <ClockDisplay
        time={whiteTime}
        label="White"
        isActive={activePlayer === 'w'}
      />
    </div>
  );
};

export default ChessClock;
