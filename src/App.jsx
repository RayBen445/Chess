import { useState, useEffect, useCallback } from 'react';
import ChessBoard from './components/ChessBoard';
import MoveHistory from './components/MoveHistory';
import ChessClock from './components/ChessClock';
import GameControls from './components/GameControls';
import OpeningBook from './components/OpeningBook';
import { useChessGame } from './hooks/useChessGame';
import { useChessClock } from './hooks/useChessClock';
import { useStockfish } from './hooks/useStockfish';
import './App.css';

function App() {
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
  } = useChessClock(600000); // 10 minutes

  const {
    isReady: isStockfishReady,
    bestMove,
    evaluation,
    isThinking,
    getBestMove,
    stopThinking
  } = useStockfish();

  const [flipped, setFlipped] = useState(false);

  // Start clock on first move
  useEffect(() => {
    if (moveHistory.length === 1 && !isRunning) {
      start();
    }
  }, [moveHistory.length, isRunning, start]);

  // Switch clock when turn changes
  useEffect(() => {
    if (isRunning && moveHistory.length > 0) {
      switchPlayer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, moveHistory.length]);

  // Pause clock on game end
  useEffect(() => {
    if (gameStatus.isCheckmate || gameStatus.isStalemate || gameStatus.isDraw) {
      pause();
    }
  }, [gameStatus, pause]);

  // Handle computer move
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
      // Don't allow moves when viewing history
      return;
    }
    selectSquare(square);
  }, [selectSquare, currentMoveIndex, moveHistory.length]);

  const handleDrop = useCallback((from, to) => {
    if (currentMoveIndex !== moveHistory.length - 1) {
      // Don't allow moves when viewing history
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
    <div className="app">
      <div className="app-header">
        <h1>♔ Glassmorphism Chess ♚</h1>
        <p>A modern chess application with drag & drop, timers, and Stockfish engine</p>
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

export default App;
