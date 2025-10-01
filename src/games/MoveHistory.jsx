const MoveHistory = ({ moves, currentMoveIndex, onMoveClick }) => {
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
      whiteIndex: i,
      blackIndex: i + 1
    });
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '15px',
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <h3
        style={{
          color: 'white',
          marginTop: 0,
          marginBottom: '10px',
          fontSize: '1.2rem'
        }}
      >
        Move History
      </h3>
      {groupedMoves.length === 0 ? (
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
          No moves yet
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {groupedMoves.map((group) => (
            <div
              key={group.number}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr',
                gap: '5px',
                alignItems: 'center'
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                {group.number}.
              </span>
              <button
                onClick={() => onMoveClick(group.whiteIndex)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor:
                    currentMoveIndex === group.whiteIndex
                      ? 'rgba(100, 150, 255, 0.6)'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: currentMoveIndex === group.whiteIndex ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentMoveIndex !== group.whiteIndex) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMoveIndex !== group.whiteIndex) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                {group.white.san}
              </button>
              {group.black && (
                <button
                  onClick={() => onMoveClick(group.blackIndex)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor:
                      currentMoveIndex === group.blackIndex
                        ? 'rgba(100, 150, 255, 0.6)'
                        : 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: currentMoveIndex === group.blackIndex ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentMoveIndex !== group.blackIndex) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentMoveIndex !== group.blackIndex) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                >
                  {group.black.san}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
