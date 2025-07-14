import React from 'react';
import './MovieCard.css';
import { motion } from 'framer-motion';

function MovieCard({ movie, isInWatchlist, onAdd, onRemove, onClick }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <motion.div
      className="movie-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(33,150,243,0.15)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <img className="movie-poster" src={posterUrl} alt={movie.title} />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">⭐ {movie.vote_average || 'N/A'}</div>
        <p className="movie-overview">{movie.overview ? movie.overview.slice(0, 100) + (movie.overview.length > 100 ? '...' : '') : 'No overview available.'}</p>
        {isInWatchlist ? (
          <button className="watchlist-btn remove" onClick={e => { e.stopPropagation(); onRemove(movie); }}>
            Remove from Watchlist
          </button>
        ) : (
          <button className="watchlist-btn add" onClick={e => { e.stopPropagation(); onAdd(movie); }}>
            Add to Watchlist
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default MovieCard; 