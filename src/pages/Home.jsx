import React, { useState, useEffect } from 'react';
import GenreFilter from '../components/GenreFilter/GenreFilter';
import MovieCard from '../components/MovieCard/MovieCard';
import { searchMovies, getGenres, discoverMovies, getPopularMovies } from '../utils/tmdb';
import './Home.css';
import { useRef } from 'react';
import MovieDetailModal from '../components/MovieDetailModal';
import MovieCardSkeleton from '../components/MovieCard/MovieCardSkeleton';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import ThemeToggle from '../components/ThemeToggle';
import Navbar from '../components/Navbar/Navbar';

function getWatchlistFromStorage() {
  return JSON.parse(localStorage.getItem('watchlist') || '[]');
}

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [watchlist, setWatchlist] = useState(getWatchlistFromStorage());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const lastQuery = useRef('');
  const lastGenre = useRef('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    getGenres().then(data => setGenres(data.genres || []));
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    // Reset page and hasMore when query or genre changes
    setPage(1);
    setHasMore(true);
    lastQuery.current = query;
    lastGenre.current = selectedGenre;
  }, [query, selectedGenre]);

  // Infinite scroll effect
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        !loading &&
        !isFetchingMore &&
        hasMore &&
        (movies.length > 0)
      ) {
        fetchMoreMovies();
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // In Home component, update useEffect to fetch popular movies by default
  useEffect(() => {
    if (!query && !selectedGenre) {
      setLoading(true);
      setError('');
      setPage(1);
      setHasMore(true);
      getPopularMovies(1)
        .then(data => {
          setMovies(data.results || []);
          setHasMore(data.page < data.total_pages);
        })
        .catch(() => setError('Error fetching popular movies.'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [query, selectedGenre]);

  // Update fetchMoreMovies to support popular movies
  const fetchMoreMovies = async () => {
    setIsFetchingMore(true);
    try {
      let data;
      if (lastQuery.current) {
        data = await searchMovies(lastQuery.current, page + 1);
      } else if (lastGenre.current) {
        data = await discoverMovies(lastGenre.current, page + 1);
      } else {
        data = await getPopularMovies(page + 1);
      }
      if (data && data.results && data.results.length > 0) {
        setMovies(prev => [...prev, ...data.results]);
        setPage(prev => prev + 1);
        setHasMore(data.page < data.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
    }
    setIsFetchingMore(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setMovies([]);
      setError('Please enter a movie title.');
      return;
    }
    setLoading(true);
    setError('');
    setPage(1);
    setHasMore(true);
    try {
      const data = await searchMovies(query, 1);
      setMovies(data.results || []);
      setHasMore(data.page < data.total_pages);
      if ((data.results || []).length === 0) setError('No results found.');
    } catch (err) {
      setError('Error fetching movies.');
    }
    setLoading(false);
  };

  const handleGenreChange = async (genreId) => {
    setSelectedGenre(genreId);
    setQuery('');
    setLoading(true);
    setError('');
    setPage(1);
    setHasMore(true);
    try {
      if (!genreId) {
        setMovies([]);
        setLoading(false);
        return;
      }
      const data = await discoverMovies(genreId, 1);
      setMovies(data.results || []);
      setHasMore(data.page < data.total_pages);
      if ((data.results || []).length === 0) setError('No results found.');
    } catch (err) {
      setError('Error fetching movies.');
    }
    setLoading(false);
  };

  const addToWatchlist = (movie) => {
    if (!watchlist.some(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter(m => m.id !== movie.id));
  };

  const sortMovies = (movies) => {
    switch (sortOption) {
      case 'release_desc':
        return [...movies].sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      case 'release_asc':
        return [...movies].sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
      case 'rating_desc':
        return [...movies].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'rating_asc':
        return [...movies].sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
      case 'title_az':
        return [...movies].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title_za':
        return [...movies].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      default:
        return movies;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar query={query} setQuery={setQuery} handleSearch={handleSearch} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>
          <ThemeToggle />
          <Hero movies={movies} />
          <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onChange={handleGenreChange}
            />
            <div className="sort-bar">
              <label htmlFor="sort">Sort by: </label>
              <select id="sort" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                <option value="default">Default</option>
                <option value="release_desc">Release Date (Newest)</option>
                <option value="release_asc">Release Date (Oldest)</option>
                <option value="rating_desc">Rating (High to Low)</option>
                <option value="rating_asc">Rating (Low to High)</option>
                <option value="title_az">Title (A-Z)</option>
                <option value="title_za">Title (Z-A)</option>
              </select>
            </div>
            {loading && <div className="info-msg">Loading...</div>}
            {error && <div className="error-msg">{error}</div>}
            {!loading && !error && movies.length === 0 && (query || selectedGenre) && (
              <div className="info-msg">No results found.</div>
            )}
            <div className="movie-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
                : sortMovies(movies).map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isInWatchlist={watchlist.some(m => m.id === movie.id)}
                      onAdd={addToWatchlist}
                      onRemove={removeFromWatchlist}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
            </div>
            {isFetchingMore && <div className="info-msg">Loading more...</div>}
            {selectedMovie && (
              <MovieDetailModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                isInWatchlist={watchlist.some(m => m.id === selectedMovie.id)}
                onAdd={addToWatchlist}
                onRemove={removeFromWatchlist}
              />
            )}
          </motion.div>
          <Plans />
        </div>
      </div>
    </div>
  );
}

export default Home; 