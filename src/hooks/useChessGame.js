import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export const useChessGame = () => {
  const [game] = useState(() => new Chess());
  const [position, setPosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState({ 
    inCheck: false, 
    isCheckmate: false, 
    isStalemate: false,
    isDraw: false
  });

  const updateGameStatus = useCallback(() => {
    setGameStatus({
      inCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw()
    });
  }, [game]);

  const makeMove = useCallback((from, to, promotion = 'q') => {
    try {
      const move = game.move({
        from,
        to,
        promotion
      });
      
      if (move) {
        const newHistory = [...moveHistory.slice(0, currentMoveIndex + 1), move];
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);
        setPosition(game.fen());
        updateGameStatus();
        setSelectedSquare(null);
        setValidMoves([]);
        return move;
      }
      return null;
    } catch (error) {
      console.error('Invalid move:', error);
      return null;
    }
  }, [game, moveHistory, currentMoveIndex, updateGameStatus]);

  const selectSquare = useCallback((square) => {
    const piece = game.get(square);
    
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedSquare && piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else if (selectedSquare) {
      makeMove(selectedSquare, square);
    } else if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
    }
  }, [game, selectedSquare, makeMove]);

  const goToMove = useCallback((index) => {
    if (index < -1 || index >= moveHistory.length) return;

    game.reset();
    for (let i = 0; i <= index; i++) {
      game.move(moveHistory[i]);
    }
    
    setCurrentMoveIndex(index);
    setPosition(game.fen());
    updateGameStatus();
    setSelectedSquare(null);
    setValidMoves([]);
  }, [game, moveHistory, updateGameStatus]);

  const previousMove = useCallback(() => {
    if (currentMoveIndex >= 0) {
      goToMove(currentMoveIndex - 1);
    }
  }, [currentMoveIndex, goToMove]);

  const nextMove = useCallback(() => {
    if (currentMoveIndex < moveHistory.length - 1) {
      goToMove(currentMoveIndex + 1);
    }
  }, [currentMoveIndex, moveHistory.length, goToMove]);

  const resetGame = useCallback(() => {
    game.reset();
    setPosition(game.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setSelectedSquare(null);
    setValidMoves([]);
    updateGameStatus();
  }, [game, updateGameStatus]);

  return {
    game,
    position,
    moveHistory,
    currentMoveIndex,
    selectedSquare,
    validMoves,
    gameStatus,
    makeMove,
    selectSquare,
    goToMove,
    previousMove,
    nextMove,
    resetGame,
    currentTurn: game.turn()
  };
};
