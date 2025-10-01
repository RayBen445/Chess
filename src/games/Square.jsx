import { useDrop } from 'react-dnd';
import Piece from './Piece';

const ItemTypes = {
  PIECE: 'piece'
};

const Square = ({ square, piece, isLight, isSelected, isValidMove, onSquareClick, onDrop, currentTurn }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      onDrop(item.square, square);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [square, onDrop]);

  const getSquareColor = () => {
    if (isSelected) return 'rgba(255, 255, 0, 0.5)';
    if (isValidMove) return 'rgba(0, 255, 0, 0.4)';
    if (isOver) return 'rgba(255, 255, 255, 0.3)';
    return isLight 
      ? 'rgba(240, 217, 181, 0.7)' 
      : 'rgba(181, 136, 99, 0.7)';
  };

  const isCurrentPlayerPiece = piece && piece.color === currentTurn;

  return (
    <div
      ref={drop}
      onClick={() => onSquareClick(square)}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: getSquareColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
    >
      {isValidMove && !piece && (
        <div
          style={{
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 200, 0, 0.5)'
          }}
        />
      )}
      <Piece 
        piece={piece} 
        square={square} 
        isCurrentPlayerPiece={isCurrentPlayerPiece}
      />
    </div>
  );
};

export default Square;
