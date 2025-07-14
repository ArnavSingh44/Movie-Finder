import React from 'react';
import './MovieCardSkeleton.css';

function MovieCardSkeleton() {
  return (
    <div className="movie-card skeleton">
      <div className="movie-poster-skeleton skeleton-animate" />
      <div className="movie-info">
        <div className="skeleton-title skeleton-animate" />
        <div className="skeleton-rating skeleton-animate" />
        <div className="skeleton-overview skeleton-animate" />
        <div className="skeleton-btn skeleton-animate" />
      </div>
    </div>
  );
}

export default MovieCardSkeleton; 