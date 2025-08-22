import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaCalendarAlt, FaStar, FaTimes } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { filterWatchHistory, sortWatchHistory, getYearOptions } from '../utils/watchStats';
import MovieCard from './MovieCard';
import './WatchHistory.css';

const WatchHistory = ({ 
  history, 
  onRemoveFromHistory, 
  onRateMovie,
  onToggleWatchlist,
  onToggleWatched,
  watchlist = [],
  watched = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: 'all',
    year: 'all',
    minRating: '0',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique genres from history
  const allGenres = useMemo(() => {
    const genres = new Set();
    history.forEach(item => {
      if (item.genres && Array.isArray(item.genres)) {
        item.genres.forEach(genre => genres.add(genre));
      }
    });
    return Array.from(genres).sort();
  }, [history]);
  
  // Get available years from history
  const years = useMemo(() => getYearOptions(history), [history]);
  
  // Apply filters and sorting
  const filteredHistory = useMemo(() => {
    let result = [...history];
    
    // Apply search and filters
    result = filterWatchHistory(result, {
      ...filters,
      searchQuery: searchQuery.toLowerCase(),
    });
    
    // Apply sorting
    result = sortWatchHistory(result, sortBy, sortOrder);
    
    return result;
  }, [history, filters, searchQuery, sortBy, sortOrder]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      genre: 'all',
      year: 'all',
      minRating: '0',
    });
    setSearchQuery('');
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const getSortLabel = () => {
    const labels = {
      date: 'Date',
      title: 'Title',
      rating: 'Rating',
    };
    return `${labels[sortBy]} (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`;
  };
  
  return (
    <div className="watch-history">
      <div className="history-header">
        <h2 className="section-title">
          <FaCalendarAlt className="section-icon" />
          Your Watch History
          <span className="item-count">{filteredHistory.length} items</span>
        </h2>
        
        <div className="history-controls">
          <div className={`search-bar ${showFilters ? 'expanded' : ''}`}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            
            <button 
              className={`filter-toggle ${Object.values(filters).some(f => f !== 'all' && f !== '0') ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
            
            <div className="sort-dropdown">
              <button 
                className="sort-toggle"
                onClick={toggleSortOrder}
                aria-label="Change sort order"
              >
                <FaSortAmountDown className="sort-icon" />
                {getSortLabel()}
              </button>
              <div className="sort-options">
                <button 
                  className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => setSortBy('date')}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`sort-option ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() => setSortBy('title')}
                >
                  Title {sortBy === 'title' && (sortOrder === 'asc' ? 'A-Z' : 'Z-A')}
                </button>
                <button 
                  className={`sort-option ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => setSortBy('rating')}
                >
                  Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Genre</label>
              <select 
                name="genre" 
                value={filters.genre}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">All Genres</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Year</label>
              <select 
                name="year" 
                value={filters.year}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Min Rating</label>
              <select 
                name="minRating" 
                value={filters.minRating}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="0">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Star</option>
              </select>
            </div>
            
            <button 
              className="clear-filters"
              onClick={clearFilters}
              disabled={Object.values(filters).every(f => f === 'all' || f === '0') && !searchQuery}
            >
              <FaTimes /> Clear All
            </button>
          </div>
        )}
      </div>
      
      {filteredHistory.length > 0 ? (
        <div className="history-grid">
          {filteredHistory.map(item => (
            <div key={`${item.id}-${item.watchedAt}`} className="history-item">
              <MovieCard
                movie={item}
                isInWatchlist={watchlist.some(m => m.id === item.id)}
                isWatched={watched.some(m => m.id === item.id)}
                userRating={item.userRating}
                onToggleWatchlist={onToggleWatchlist}
                onToggleWatched={onToggleWatched}
                onRateMovie={onRateMovie}
                className="history-movie-card"
              />
              <div className="history-meta">
                <div className="watched-date">
                  <FaCalendarAlt className="meta-icon" />
                  {format(parseISO(item.watchedAt), 'MMM d, yyyy')}
                </div>
                {item.userRating > 0 && (
                  <div className="user-rating">
                    <FaStar className="star-icon" />
                    {item.userRating.toFixed(1)}
                  </div>
                )}
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveFromHistory(item.id)}
                  aria-label="Remove from history"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaCalendarAlt />
          </div>
          <h3>No movies found</h3>
          <p>Try adjusting your search or filters</p>
          {(searchQuery || Object.values(filters).some(f => f !== 'all' && f !== '0')) && (
            <button 
              className="clear-filters"
              onClick={clearFilters}
            >
              <FaTimes /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
