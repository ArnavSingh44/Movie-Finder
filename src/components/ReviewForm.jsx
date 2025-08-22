import React, { useState, useEffect } from 'react';
import { FaStar, FaPaperPlane, FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import './ReviewForm.css';

const ReviewForm = ({
  movie,
  userRating = 0,
  userReview = '',
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null
}) => {
  const [rating, setRating] = useState(userRating);
  const [review, setReview] = useState(userReview);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setRating(userRating);
    setReview(userReview);
  }, [userRating, userReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating,
        review: review.trim()
      });
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  if (!isExpanded && !rating) {
    return (
      <div className="rating-prompt">
        <p>Rate this movie:</p>
        <StarRating 
          rating={0} 
          onRatingChange={handleRatingChange}
          editable={true}
          size={24}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-header">
        <h4>Your Review for {movie.title}</h4>
        {onCancel && (
          <button 
            type="button" 
            className="close-btn"
            onClick={onCancel}
            aria-label="Close review form"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      <div className="form-group">
        <label>Your Rating:</label>
        <StarRating 
          rating={rating} 
          onRatingChange={handleRatingChange}
          editable={!isSubmitting}
          size={24}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor={`review-${movie.id}`}>Your Review (optional):</label>
        <textarea
          id={`review-${movie.id}`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          disabled={isSubmitting}
          maxLength={1000}
          rows={4}
        />
        <div className="char-count">
          {review.length}/1000 characters
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <FaPaperPlane /> Submit Review
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
