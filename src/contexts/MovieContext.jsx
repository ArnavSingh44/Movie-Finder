import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getWatchlist, 
  addToWatchlist as addToWatchlistService,
  removeFromWatchlist as removeFromWatchlistService,
  rateMovie,
  getUserRating,
  addToWatchHistory,
  getWatchHistory,
  getUserMovieStats
} from '../services/movieService';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [ratings, setRatings] = useState({});
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's movie data
  const loadUserData = useCallback(async () => {
    if (!currentUser) {
      setWatchlist([]);
      setRatings({});
      setHistory([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [watchlistData, historyData, statsData] = await Promise.all([
        getWatchlist(currentUser.uid),
        getWatchHistory(currentUser.uid),
        getUserMovieStats(currentUser.uid).catch(() => null)
      ]);

      setWatchlist(watchlistData);
      setHistory(historyData);
      setStats(statsData);
      
      // Load ratings for all movies in watchlist and history
      const allMovieIds = [
        ...new Set([
          ...watchlistData.map(m => m.id),
          ...historyData.map(h => h.movieId)
        ])
      ];

      const ratingsData = {};
      for (const movieId of allMovieIds) {
        const rating = await getUserRating(currentUser.uid, movieId);
        if (rating) {
          ratingsData[movieId] = rating;
        }
      }
      setRatings(ratingsData);
      
    } catch (err) {
      console.error('Error loading user movie data:', err);
      setError('Failed to load your movie data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load data when user changes
  useEffect(() => {
    loadUserData();
  }, [currentUser?.uid, loadUserData]);

  // Add movie to watchlist
  const addToWatchlist = async (movie) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      await addToWatchlistService(currentUser.uid, movie);
      setWatchlist(prev => [...prev, movie]);
      return { success: true };
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      await removeFromWatchlistService(currentUser.uid, movieId);
      setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
      return { success: true };
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  // Rate a movie
  const rateMovieHandler = async (movieId, rating, review = '') => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      const result = await rateMovie(currentUser.uid, movieId, rating, review);
      
      // Update local state
      setRatings(prev => ({
        ...prev,
        [movieId]: { movieId, rating, review, timestamp: new Date() }
      }));
      
      // Reload stats to get updated data
      const statsData = await getUserMovieStats(currentUser.uid);
      setStats(statsData);
      
      return { ...result, success: true };
    } catch (err) {
      console.error('Error rating movie:', err);
      return { success: false, error: err.message };
    }
  };

  // Add to watch history
  const addToHistory = async (movie, durationWatched = 0) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      await addToWatchHistory(currentUser.uid, movie, durationWatched);
      
      // Update local state
      const newHistoryItem = {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        durationWatched,
        timestamp: new Date()
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      
      // Reload stats to get updated data
      const statsData = await getUserMovieStats(currentUser.uid);
      setStats(statsData);
      
      return { success: true };
    } catch (err) {
      console.error('Error adding to history:', err);
      return { success: false, error: err.message };
    }
  };

  // Check if movie is in watchlist
  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  // Get user's rating for a movie
  const getUserMovieRating = (movieId) => {
    return ratings[movieId]?.rating || null;
  };

  // Toggle watchlist status
  const toggleWatchlist = async (movie) => {
    if (isInWatchlist(movie.id)) {
      return await removeFromWatchlist(movie.id);
    } else {
      return await addToWatchlist(movie);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        ratings,
        history,
        stats,
        loading,
        error,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        rateMovie: rateMovieHandler,
        getUserMovieRating,
        addToHistory,
        refreshData: loadUserData
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;
