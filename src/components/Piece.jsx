import { useDrag } from 'react-dnd';
import { getPieceSymbol } from '../utils/pieces';

const ItemTypes = {
  PIECE: 'piece'
};

const Piece = ({ piece, square, isCurrentPlayerPiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { square },
    canDrag: isCurrentPlayerPiece,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [square, isCurrentPlayerPiece]);

  if (!piece) return null;

  return (
    <div
      ref={drag}
      style={{
        fontSize: '3rem',
        cursor: isCurrentPlayerPiece ? 'grab' : 'default',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default Piece;
