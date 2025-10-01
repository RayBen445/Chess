import { useState } from 'react';

function HowToPlay({ instructions }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      marginBottom: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>📖 How to Play</span>
        <span style={{ fontSize: '24px' }}>{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          color: 'white',
          lineHeight: '1.8',
          fontSize: '16px',
        }}>
          {instructions.map((instruction, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              {instruction.title && (
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  color: '#FFD700',
                }}>
                  {instruction.title}
                </div>
              )}
              {instruction.steps ? (
                <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {instruction.steps.map((step, stepIndex) => (
                    <li key={stepIndex} style={{ marginBottom: '5px' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>{instruction.text}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HowToPlay;
