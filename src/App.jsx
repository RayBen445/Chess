import { useState } from 'react';
import GameMenu from './components/GameMenu';
import ChessGame from './games/ChessGame';
import TicTacToeGame from './games/TicTacToeGame';
import MatchingGame from './games/MatchingGame';
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
      {!currentGame ? (
        <>
          <div className="app-header">
            <h1>🎮 Game Center</h1>
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
      ) : null}
    </div>
  );
}

export default App;
