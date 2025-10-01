import { useState } from 'react';
import GameMenu from './components/GameMenu';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ChessGame from './games/ChessGame';
import TicTacToeGame from './games/TicTacToeGame';
import MatchingGame from './games/MatchingGame';
import SimonGame from './games/SimonGame';
import SnakeGame from './games/SnakeGame';
import Game2048 from './games/Game2048';
import MinesweeperGame from './games/MinesweeperGame';
import ConnectFourGame from './games/ConnectFourGame';
import SudokuGame from './games/SudokuGame';
import BreakoutGame from './games/BreakoutGame';
import './App.css';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <div className="app">
      <PWAInstallPrompt />
      {!currentGame ? (
        <>
          <div className="app-header">
            <h1>🎮 Cool Shot Systems Game Hub</h1>
            <p>Choose your favorite game and start playing offline!</p>
          </div>
          <GameMenu onSelectGame={handleSelectGame} />
        </>
      ) : currentGame === 'chess' ? (
        <ChessGame onBack={handleBackToMenu} />
      ) : currentGame === 'tictactoe' ? (
        <TicTacToeGame onBack={handleBackToMenu} />
      ) : currentGame === 'matching' ? (
        <MatchingGame onBack={handleBackToMenu} />
      ) : currentGame === 'simon' ? (
        <SimonGame onBack={handleBackToMenu} />
      ) : currentGame === 'snake' ? (
        <SnakeGame onBack={handleBackToMenu} />
      ) : currentGame === '2048' ? (
        <Game2048 onBack={handleBackToMenu} />
      ) : currentGame === 'minesweeper' ? (
        <MinesweeperGame onBack={handleBackToMenu} />
      ) : currentGame === 'connectfour' ? (
        <ConnectFourGame onBack={handleBackToMenu} />
      ) : currentGame === 'sudoku' ? (
        <SudokuGame onBack={handleBackToMenu} />
      ) : currentGame === 'breakout' ? (
        <BreakoutGame onBack={handleBackToMenu} />
      ) : null}
    </div>
  );
}

export default App;
