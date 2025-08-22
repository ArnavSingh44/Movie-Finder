import React from 'react';
import { FaPlay, FaClock } from 'react-icons/fa';
import { formatDuration, getProgressPercentage } from '../utils/watchStats';
import './ContinueWatching.css';

const ContinueWatching = ({ watchHistory, onResume, onRemove }) => {
  // Filter items with progress less than 90%
  const inProgressItems = watchHistory
    .filter(item => item.progress && item.progress < 90 && item.runtime)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5); // Limit to 5 items

  if (inProgressItems.length === 0) {
    return null;
  }

  return (
    <div className="continue-watching">
      <h3 className="section-title">
        <FaPlay className="section-icon" />
        Continue Watching
      </h3>
      
      <div className="continue-watching-grid">
        {inProgressItems.map((item) => (
          <div key={item.id} className="continue-card">
            <div className="continue-poster">
              <img 
                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder-poster.jpg'}
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-poster.jpg';
                }}
              />
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              
              <div className="continue-overlay">
                <button 
                  className="resume-btn"
                  onClick={() => onResume(item)}
                  aria-label={`Resume ${item.title}`}
                >
                  <FaPlay />
                </button>
              </div>
            </div>
            
            <div className="continue-info">
              <h4 className="continue-title">{item.title}</h4>
              <div className="continue-meta">
                <span className="time-remaining">
                  <FaClock className="meta-icon" />
                  {formatDuration(Math.floor((item.runtime * 60) * ((100 - item.progress) / 100)))} left
                </span>
                <span className="progress-percent">{Math.round(item.progress)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar-sm"
                  style={{
                    '--progress': `${item.progress}%`,
                    '--progress-color': item.progress > 80 ? '#4CAF50' : '#646cff'
                  }}
                >
                  <div className="progress-fill-sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
