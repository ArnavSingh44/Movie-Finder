import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaRegEye, FaHeart, FaRegHeart, FaStar, FaRegStar, FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import './MovieCard.css';

const MovieCard = ({
  movie,
  isInWatchlist = false,
  isWatched = false,
  userRating = 0,
  userReview = '',
  onToggleWatchlist,
  onToggleWatched,
  onRateMovie,
  showActions = true,
  showRating = true,
  showReviewForm = false,
  onCloseReview,
  className = ''
}) => {
  const [showReview, setShowReview] = useState(showReviewForm);
  const [isHovering, setIsHovering] = useState(false);

  const handleRateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReview(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await onRateMovie(reviewData);
      setShowReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleCloseReview = () => {
    setShowReview(false);
    if (onCloseReview) onCloseReview();
  };

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null;

  return (
    <div 
      className={`movie-card ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <div className="movie-poster">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          
          {isHovering && (
            <div className="movie-overlay">
              {showActions && (
                <div className="quick-actions">
                  <button 
                    className={`action-btn ${isInWatchlist ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleWatchlist && onToggleWatchlist(movie);
                    }}
                    title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    {isInWatchlist ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  
                  <button 
                    className={`action-btn ${isWatched ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleWatched && onToggleWatched(movie);
                    }}
                    title={isWatched ? 'Mark as not watched' : 'Mark as watched'}
                  >
                    {isWatched ? <FaEye /> : <FaRegEye />}
                  </button>
                </div>
              )}
              
              {showRating && userRating > 0 && (
                <div className="user-rating-badge">
                  <FaStar className="star-icon" />
                  <span>{userRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="movie-info">
          <h4>{movie.title}</h4>
          
          <div className="movie-meta">
            {releaseYear && <span>{releaseYear}</span>}
            {rating && (
              <span className="rating">
                <FaStar className="star-icon" />
                {rating}
              </span>
            )}
          </div>
          
          {showRating && userRating > 0 && !isHovering && (
            <div className="user-rating">
              <StarRating 
                rating={userRating} 
                size={14} 
                showValue={false}
              />
            </div>
          )}
        </div>
      </Link>
      
      {showActions && (showReview || showReviewForm) && (
        <div className="review-form-container">
          <ReviewForm
            movie={movie}
            userRating={userRating}
            userReview={userReview}
            onSubmit={handleReviewSubmit}
            onCancel={handleCloseReview}
          />
        </div>
      )}
      
      {!showReview && showActions && onRateMovie && (
        <button 
          className="rate-movie-btn"
          onClick={handleRateClick}
        >
          {userRating > 0 ? 'Edit Rating' : 'Rate This Movie'}
        </button>
      )}
    </div>
  );
};

export default MovieCard;
