import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const getImageUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const Hero = ({ movies }) => {
  // State for slideshow
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef();
  
  // Get a fixed set of random movies on initial render
  const showcaseMovies = React.useMemo(() => {
    if (!movies || movies.length === 0) return [];
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [movies]);

  // Set up auto-advance timer
  useEffect(() => {
    if (showcaseMovies.length <= 1) return;
    
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % showcaseMovies.length);
    }, 8000);
    
    return () => clearInterval(intervalRef.current);
  }, [showcaseMovies]);

  // Navigation functions
  const goToSlide = (newIndex) => {
    if (newIndex === currentIndex) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
    setIsLoading(true);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % showcaseMovies.length);
    setIsLoading(true);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + showcaseMovies.length) % showcaseMovies.length);
    setIsLoading(true);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Get current movie
  const currentMovie = showcaseMovies[currentIndex];
  if (!currentMovie) return null;

  const posterUrl = getImageUrl(currentMovie.backdrop_path, 'original');

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <section className="hero-section">
      {/* Background Image */}
      <div className="hero-bg-container">
        <img
          src={posterUrl}
          alt=""
          className="hero-bg"
          style={{
            filter: isLoading ? 'blur(10px)' : 'blur(0)',
            transform: isLoading ? 'scale(1.05)' : 'scale(1)'
          }}
          onLoad={handleImageLoad}
        />
        {isLoading && <div className="loading-overlay" />}
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Left Arrow */}
        <button className="hero-arrow left" onClick={goToPrev}>
          &#8592;
        </button>

        {/* Main Content */}
        <div className="hero-main">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentMovie.id}
              className="hero-content-inner"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <h1 className="hero-title">{currentMovie.title || 'No Title'}</h1>
              <div className="hero-meta">
                <span className="hero-rating">
                  &#9733; {currentMovie.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="hero-year">
                  {currentMovie.release_date?.slice(0, 4) || 'Year'}
                </span>
                {currentMovie.genres?.[0]?.name && (
                  <span className="hero-genre">{currentMovie.genres[0].name}</span>
                )}
              </div>
              <p className="hero-overview">
                {currentMovie.overview || 'No overview available.'}
              </p>
              <div className="hero-actions">
                <button className="hero-watch">Watch Now</button>
                <button className="hero-add">+</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button className="hero-arrow right" onClick={goToNext}>
          &#8594;
        </button>
      </div>

      {/* Thumbnails */}
      <div className="hero-thumbnails">
        {showcaseMovies.map((movie, i) => (
          <div
            key={movie.id}
            className={`thumbnail ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          >
            <img
              src={getImageUrl(movie.poster_path, 'w154')}
              alt={movie.title}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;