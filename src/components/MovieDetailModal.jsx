import React from 'react';
import './MovieDetailModal.css';
import { motion, AnimatePresence } from 'framer-motion';

function MovieDetailModal({ movie, onClose, isInWatchlist, onAdd, onRemove }) {
  if (!movie) return null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content"
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <button className="modal-close" onClick={onClose}>&times;</button>
          <img className="modal-poster" src={posterUrl} alt={movie.title} />
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <div className="modal-rating">⭐ {movie.vote_average || 'N/A'}</div>
            <p className="modal-overview">{movie.overview || 'No overview available.'}</p>
            <div className="modal-details">
              <span>Release Date: {movie.release_date || 'N/A'}</span>
              <span>Language: {movie.original_language?.toUpperCase() || 'N/A'}</span>
            </div>
            {isInWatchlist ? (
              <button className="watchlist-btn remove" onClick={() => onRemove(movie)}>
                Remove from Watchlist
              </button>
            ) : (
              <button className="watchlist-btn add" onClick={() => onAdd(movie)}>
                Add to Watchlist
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MovieDetailModal; 