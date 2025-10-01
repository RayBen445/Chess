import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Square from './Square';

const ChessBoard = ({ game, selectedSquare, validMoves, onSquareClick, onDrop, flipped = false }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  if (flipped) {
    files.reverse();
    ranks.reverse();
  }

  const isLightSquare = (file, rank) => {
    const fileIndex = files.indexOf(file);
    const rankIndex = ranks.indexOf(rank);
    return (fileIndex + rankIndex) % 2 === 0;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          width: '100%',
          aspectRatio: '1',
          maxWidth: '600px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          overflow: 'hidden'
        }}
      >
        {ranks.map((rank) =>
          files.map((file) => {
            const square = file + rank;
            const piece = game.get(square);
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves.includes(square);

            return (
              <Square
                key={square}
                square={square}
                piece={piece}
                isLight={isLightSquare(file, rank)}
                isSelected={isSelected}
                isValidMove={isValidMove}
                onSquareClick={onSquareClick}
                onDrop={onDrop}
                currentTurn={game.turn()}
              />
            );
          })
        )}
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
