import { useState, useEffect, useCallback } from 'react';
import ChessBoard from './ChessBoard';
import MoveHistory from './MoveHistory';
import ChessClock from './ChessClock';
import GameControls from './GameControls';
import OpeningBook from './OpeningBook';
import { useChessGame } from '../hooks/useChessGame';
import { useChessClock } from '../hooks/useChessClock';
import { useStockfish } from '../hooks/useStockfish';

function ChessGame({ onBack }) {
  const {
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
    currentTurn
  } = useChessGame();

  const {
    whiteTime,
    blackTime,
    isRunning,
    activePlayer,
    start,
    pause,
    switchPlayer,
    reset: resetClock,
    formatTime
  } = useChessClock(600000);

  const {
    isReady: isStockfishReady,
    bestMove,
    evaluation,
    isThinking,
    getBestMove,
    stopThinking
  } = useStockfish();

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (moveHistory.length === 1 && !isRunning) {
      start();
    }
  }, [moveHistory.length, isRunning, start]);

  useEffect(() => {
    if (isRunning && moveHistory.length > 0) {
      switchPlayer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, moveHistory.length]);

  useEffect(() => {
    if (gameStatus.isCheckmate || gameStatus.isStalemate || gameStatus.isDraw) {
      pause();
    }
  }, [gameStatus, pause]);

  useEffect(() => {
    if (bestMove && !isThinking) {
      const from = bestMove.substring(0, 2);
      const to = bestMove.substring(2, 4);
      const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
      
      setTimeout(() => {
        makeMove(from, to, promotion);
      }, 500);
    }
  }, [bestMove, isThinking, makeMove]);

  const handleSquareClick = useCallback((square) => {
    if (currentMoveIndex !== moveHistory.length - 1) {
      return;
    }
    selectSquare(square);
  }, [selectSquare, currentMoveIndex, moveHistory.length]);

  const handleDrop = useCallback((from, to) => {
    if (currentMoveIndex !== moveHistory.length - 1) {
      return;
    }
    makeMove(from, to);
  }, [makeMove, currentMoveIndex, moveHistory.length]);

  const handleReset = useCallback(() => {
    resetGame();
    resetClock();
    stopThinking();
  }, [resetGame, resetClock, stopThinking]);

  const handleComputerMove = useCallback(() => {
    if (isStockfishReady && !isThinking && currentMoveIndex === moveHistory.length - 1) {
      getBestMove(position, 15);
    }
  }, [isStockfishReady, isThinking, getBestMove, position, currentMoveIndex, moveHistory.length]);

  const handleFlip = useCallback(() => {
    setFlipped(prev => !prev);
  }, []);

  return (
    <div className="chess-game">
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ← Back to Games
      </button>

      <div className="game-header">
        <h1>♔ Chess Game ♚</h1>
        <p>A modern chess application with drag & drop, timers, and AI</p>
      </div>

      <div className="game-container">
        <div className="left-panel">
          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            activePlayer={activePlayer}
            formatTime={formatTime}
          />
          <OpeningBook position={position} />
        </div>

        <div className="center-panel">
          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            onDrop={handleDrop}
            flipped={flipped}
          />
        </div>

        <div className="right-panel">
          <GameControls
            onReset={handleReset}
            onPrevious={previousMove}
            onNext={nextMove}
            onFlip={handleFlip}
            onComputerMove={handleComputerMove}
            gameStatus={gameStatus}
            currentTurn={currentTurn}
            isComputerThinking={isThinking}
            canGoBack={currentMoveIndex >= 0}
            canGoForward={currentMoveIndex < moveHistory.length - 1}
          />
          <MoveHistory
            moves={moveHistory}
            currentMoveIndex={currentMoveIndex}
            onMoveClick={goToMove}
          />
          {!isStockfishReady && (
            <div
              style={{
                background: 'rgba(255, 200, 100, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid rgba(255, 200, 100, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                marginTop: '15px'
              }}
            >
              <p style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>
                ⚠️ Stockfish engine not available. The app works fully without it, but computer moves won't be available.
              </p>
            </div>
          )}
          {isStockfishReady && evaluation !== 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                marginTop: '15px'
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>
                📊 Evaluation
              </h3>
              <p style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChessGame;
