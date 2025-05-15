import React from 'react';
import { Link } from 'react-router-dom';
import './GamesPage.scss';

const GamesPage = () => {
  return (
    <div className="games-page">
      <h1>Games</h1>
      <div className="games-list">
        <div className="game-card">
          <h3>Duma</h3>
          <p>The game where you create the world with DUMA, the Goddes with who you <br/>have to watch out for the balance in the world</p>
          <Link to="/duma">Play Now</Link>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;