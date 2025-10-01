import { getOpeningInfo } from '../utils/openingBook';

const OpeningBook = ({ position }) => {
  const openingInfo = getOpeningInfo(position);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '15px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        minHeight: '80px'
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
        📚 Opening Book
      </h3>
      {openingInfo ? (
        <div>
          <p
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '0 0 10px 0'
            }}
          >
            {openingInfo.name}
          </p>
          {openingInfo.moves && openingInfo.moves.length > 0 && (
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  margin: '5px 0'
                }}
              >
                Common continuations:
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px',
                  marginTop: '8px'
                }}
              >
                {openingInfo.moves.map((move, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontStyle: 'italic',
            margin: 0
          }}
        >
          Out of opening book
        </p>
      )}
    </div>
  );
};

export default OpeningBook;
