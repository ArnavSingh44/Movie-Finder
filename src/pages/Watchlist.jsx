import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard/MovieCard';
import './Watchlist.css';

function getWatchlistFromStorage() {
  return JSON.parse(localStorage.getItem('watchlist') || '[]');
}

function Watchlist() {
  const [watchlist, setWatchlist] = useState(getWatchlistFromStorage());

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter(m => m.id !== movie.id));
  };

  return (
    <div className="watchlist-page">
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <div className="info-msg">Your watchlist is empty.</div>
      ) : (
        <div className="movie-grid">
          {watchlist.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={true}
              onRemove={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist; 