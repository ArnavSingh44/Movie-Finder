import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaFilm, FaHistory, FaClock, 
  FaSignOutAlt, FaStar, FaRegClock, 
  FaTimes, FaArrowUp, FaChartBar
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Profile.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Helper component for loading state
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading your data...</p>
  </div>
);

// Helper component for empty state
const EmptyState = ({ message, ctaText, onCtaClick }) => (
  <div className="empty-state">
    <p>{message}</p>
    {ctaText && (
      <button className="browse-btn" onClick={onCtaClick}>
        {ctaText}
      </button>
    )}
  </div>
);

// Helper component for stats cards
const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { 
    watchlist, 
    history, 
    stats, 
    loading, 
    error,
    ratings
  } = useMovies();
  
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();
  
  // Process ratings to separate liked and disliked movies
  const likedMovies = Object.values(ratings || {})
    .filter(rating => rating.rating >= 4)
    .sort((a, b) => b.rating - a.rating);
    
  const dislikedMovies = Object.values(ratings || {})
    .filter(rating => rating.rating < 3)
    .sort((a, b) => a.rating - b.rating);
    
  // Prepare data for charts
  const genreData = {
    labels: stats?.genreDistribution?.map(g => g.genre) || [],
    datasets: [
      {
        label: 'Movies by Genre',
        data: stats?.genreDistribution?.map(g => g.count) || [],
        backgroundColor: [
          '#646cff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
          '#ffaa80', '#ff9ff3', '#feca57', '#5f27cd', '#ff9f43'
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const ratingData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Your Ratings',
        data: [1, 1, 1, 1, 1], // Placeholder - would calculate actual distribution
        backgroundColor: '#646cff',
        borderRadius: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#aaa',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#aaa',
        },
      },
    },
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const renderMovieCard = (movie, index) => {
    const isWatchlistItem = activeTab === 'watchlist';
    const isHistoryItem = activeTab === 'history';
    const isLikedItem = activeTab === 'liked';
    const isDislikedItem = activeTab === 'disliked';
    
    return (
      <div key={`${movie.id || index}`} className="movie-card">
        <div className="movie-poster">
          {movie.posterPath ? (
            <img 
              src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} 
              alt={movie.title || 'Movie poster'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
          ) : (
            <div className="placeholder-poster">
              <FaFilm className="placeholder-icon" />
            </div>
          )}
          
          {isWatchlistItem && (
            <div className="movie-overlay">
              <button className="icon-btn" title="Mark as watched">
                <FaEye />
              </button>
              <button className="icon-btn" title="Remove from watchlist">
                <FaTimes />
              </button>
            </div>
          )}
        </div>
        
        <div className="movie-info">
          <h4>{movie.title || 'Movie Title'}</h4>
          
          {isHistoryItem && movie.timestamp && (
            <div className="movie-meta">
              <span><FaRegClock /> {new Date(movie.timestamp).toLocaleDateString()}</span>
              {movie.durationWatched && (
                <span><FaClock /> {Math.round(movie.durationWatched)} min</span>
              )}
            </div>
          )}
          
          {(isLikedItem || isDislikedItem) && movie.rating && (
            <div className="movie-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(movie.rating) ? 'filled' : 'empty'}
                />
              ))}
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
          
          {movie.genres && (
            <div className="movie-genres">
              {movie.genres.slice(0, 2).map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStatsTab = () => (
    <div className="stats-container">
      <div className="stats-grid">
        <StatCard 
          icon={<FaRegClock />} 
          label="Watchlist" 
          value={watchlist?.length || 0} 
          color="#646cff" 
        />
        <StatCard 
          icon={<FaEye />} 
          label="Watched" 
          value={stats?.watchedCount || 0} 
          color="#4ecdc4" 
        />
        <StatCard 
          icon={<FaRegThumbsUp />} 
          label="Liked" 
          value={likedMovies?.length || 0} 
          color="#2ecc71" 
        />
        <StatCard 
          icon={<FaClock />} 
          label="Watch Time" 
          value={stats?.totalWatchTime ? `${Math.round(stats.totalWatchTime / 60)}h` : '0h'} 
          color="#e74c3c" 
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Your Ratings</h3>
          <Bar data={ratingData} options={chartOptions} />
        </div>
        
        {stats?.genreDistribution?.length > 0 && (
          <div className="chart-container">
            <h3>Favorite Genres</h3>
            <Pie data={genreData} options={chartOptions} />
          </div>
        )}
      </div>
      
      {stats?.recentActivity?.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'watch' ? <FaEye /> : <FaStar />}
                </div>
                <div className="activity-details">
                  <p>
                    {activity.type === 'watch' 
                      ? `Watched ${activity.movieTitle}`
                      : `Rated ${activity.movieTitle} ${activity.rating}/5`
                    }
                  </p>
                  <span className="activity-time">
                    {new Date(activity.timestamp?.toDate()).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return (
        <div className="error-message">
          <p>Error loading your data. Please try again later.</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      );
    }
    
    if (activeTab === 'stats') {
      return renderStatsTab();
    }
    
    let items = [];
    let emptyMessage = '';
    let emptyCta = 'Browse Movies';
    
    switch (activeTab) {
      case 'watchlist':
        items = watchlist;
        emptyMessage = 'Your watchlist is empty';
        break;
      case 'history':
        items = history;
        emptyMessage = 'Your watch history is empty';
        emptyCta = 'Start Watching';
        break;
      case 'liked':
        items = likedMovies;
        emptyMessage = 'You haven\'t liked any movies yet';
        break;
      case 'disliked':
        items = dislikedMovies;
        emptyMessage = 'You haven\'t disliked any movies yet';
        emptyCta = null;
        break;
      default:
        items = [];
    }
    
    const tabTitles = {
      watchlist: 'Your Watchlist',
      history: 'Watch History',
      liked: 'Liked Movies',
      disliked: 'Disliked Movies'
    };
    
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h3>{tabTitles[activeTab] || 'Your Movies'}</h3>
          {items.length > 0 && (
            <span className="tab-count">{items.length} items</span>
          )}
        </div>
        
        {items.length > 0 ? (
          <div className="movie-grid">
            {items.map((item, index) => renderMovieCard(item, index))}
          </div>
        ) : (
          <EmptyState 
            message={emptyMessage}
            ctaText={emptyCta}
            onCtaClick={() => navigate('/')}
          />
        )}
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              <FaUser />
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{currentUser?.displayName || 'Movie Enthusiast'}</h1>
          <p className="email">{currentUser?.email}</p>
          
          <div className="stats">
            <div className="stat">
              <FaRegClock />
              <span>{watchlist?.length || 0} Watchlist</span>
            </div>
            <div className="stat">
              <FaEye />
              <span>{stats?.watchedCount || 0} Watched</span>
            </div>
            <div className="stat">
              <FaRegThumbsUp />
              <span>{likedMovies?.length || 0} Liked</span>
            </div>
            {stats?.totalWatchTime > 0 && (
              <div className="stat">
                <FaFire />
                <span>{Math.round(stats.totalWatchTime / 60)}h watched</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="action-btn" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
          >
            <FaArrowUp />
          </button>
          <button 
            className="action-btn" 
            onClick={handleLogout}
            title="Sign out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <FaChartBar /> Stats
          </button>
          <button 
            className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <FaRegClock /> Watchlist
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> History
          </button>
          <button 
            className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
            onClick={() => setActiveTab('liked')}
          >
            <FaRegThumbsUp /> Liked
          </button>
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default Profile;
