import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cat Escape: A Stealth Adventure</h1>
      </header>
      <main>
        <Game />
      </main>
      <footer>
        <p>Arrow keys to move. Avoid being seen!</p>
      </footer>
    </div>
  );
}

export default App;
