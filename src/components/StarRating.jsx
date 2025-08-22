import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({
  rating = 0,
  onRatingChange,
  size = 20,
  editable = false,
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = (value) => {
    if (editable && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (editable) {
      setHoverRating(value);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const renderStar = (index) => {
    const displayRating = isHovering ? hoverRating : rating;
    const starValue = index + 1;
    const isHalf = displayRating >= starValue - 0.5 && displayRating < starValue;
    const isFilled = displayRating >= starValue;
    
    const StarIcon = isHalf ? FaStarHalfAlt : (isFilled ? FaStar : FaRegStar);
    
    return (
      <span
        key={index}
        className={`star ${editable ? 'editable' : ''}`}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        style={{
          color: isHalf || isFilled ? '#ffd700' : '#ddd',
          cursor: editable ? 'pointer' : 'default',
          fontSize: `${size}px`,
          margin: '0 2px',
          transition: 'color 0.2s, transform 0.2s'
        }}
      >
        <StarIcon />
      </span>
    );
  };

  return (
    <div className={`star-rating ${className}`}>
      {[...Array(5)].map((_, i) => renderStar(i))}
      {showValue && (
        <span className="rating-value" style={{ marginLeft: '8px', fontSize: `${size * 0.8}px` }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
