import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

function getRandomMovies(movies, count = 5) {
  if (!movies || movies.length === 0) return [];
  const shuffled = [...movies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Hero({ movies }) {
  const showcaseMovies = getRandomMovies(movies, 5);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setIndex(i => (i + 1) % showcaseMovies.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [showcaseMovies.length]);

  const goLeft = () => {
    setDirection(-1);
    setIndex(i => (i - 1 + showcaseMovies.length) % showcaseMovies.length);
  };
  const goRight = () => {
    setDirection(1);
    setIndex(i => (i + 1) % showcaseMovies.length);
  };

  const movie = showcaseMovies[index];
  if (!movie) return null;
  const posterUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/800x450?text=No+Image';

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
  };

  return (
    <section className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${posterUrl})` }} />
      <div className="hero-content">
        <button className="hero-arrow left" onClick={goLeft}>&#8592;</button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={movie.id}
            className="hero-main"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
          >
            <h1 className="hero-title">{movie.title}</h1>
            <div className="hero-rating">IMDb RATING <span>⭐ {movie.vote_average || 'N/A'}</span></div>
            <div className="hero-meta" style={{ color: '#ff1744' }}>{movie.genres?.[0]?.name || 'Genre'} • {movie.release_date?.slice(0, 4) || 'Year'}</div>
            <p className="hero-overview">{movie.overview || 'No overview available.'}</p>
            <div className="hero-actions">
              <button className="hero-watch">Watch Now</button>
              <button className="hero-add">+</button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="hero-side">
          <button className="hero-play"><span>▶</span></button>
          <div className="hero-thumbnails">
            {showcaseMovies.map((m, i) => (
              <img
                key={m.id}
                src={m.backdrop_path ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}` : 'https://via.placeholder.com/300x169?text=No+Image'}
                alt={m.title}
                className={i === index ? 'active' : ''}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                style={{ cursor: 'pointer', opacity: i === index ? 1 : 0.5, border: i === index ? '2px solid #ff1744' : '2px solid transparent' }}
              />
            ))}
          </div>
        </div>
        <button className="hero-arrow right" onClick={goRight}>&#8594;</button>
      </div>
    </section>
  );
}

export default Hero; 