import React from 'react';
import { FaClock, FaFilm, FaChartLine, FaStar } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatDuration, calculateWatchStats } from '../utils/watchStats';
import './WatchStats.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WatchStats = ({ watchHistory }) => {
  const stats = calculateWatchStats(watchHistory);
  
  // Prepare data for monthly movies chart
  const months = Object.keys(stats.moviesPerMonth).sort();
  const monthlyMoviesData = {
    labels: months,
    datasets: [
      {
        label: 'Movies Watched',
        data: months.map(month => stats.moviesPerMonth[month]),
        backgroundColor: 'rgba(100, 108, 255, 0.7)',
        borderColor: 'rgba(100, 108, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for watch time by hour chart
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const watchTimeByHourData = {
    labels: hours,
    datasets: [
      {
        label: 'Watch Time (minutes)',
        data: stats.watchTimeByHour,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#aaa',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#aaa',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="watch-stats">
      <h3 className="stats-title">
        <FaChartLine className="stats-icon" />
        Your Watch Statistics
      </h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h4>Total Watch Time</h4>
            <p className="stat-value">{formatDuration(stats.totalWatchTime)}</p>
            <p className="stat-description">
              That's like watching all Lord of the Rings movies {Math.round(stats.totalWatchTime / 558)} times!
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaFilm />
          </div>
          <div className="stat-content">
            <h4>Total Movies Watched</h4>
            <p className="stat-value">{stats.totalMoviesWatched}</p>
            <p className="stat-description">
              {stats.totalMoviesWatched > 0 
                ? `That's an average of ${(stats.totalMoviesWatched / (months.length || 1)).toFixed(1)} movies per month!`
                : 'Start watching movies to see your stats here!'}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaRegClock />
          </div>
          <div className="stat-content">
            <h4>Favorite Time to Watch</h4>
            <p className="stat-value">{stats.favoriteTime.timeOfDay}</p>
            <p className="stat-description">
              You watch most movies around {stats.favoriteTime.hour}:00 on {stats.favoriteTime.day}s
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h4>Favorite Genres</h4>
            {stats.genreDistribution.length > 0 ? (
              <>
                <p className="stat-value">{stats.genreDistribution[0]?.genre}</p>
                <p className="stat-description">
                  {stats.genreDistribution.slice(0, 3).map((g, i) => (
                    <span key={i} className="genre-tag">{g.genre} ({g.count})</span>
                  ))}
                </p>
              </>
            ) : (
              <p className="stat-description">Watch more movies to see your favorite genres</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="stats-charts">
        <div className="chart-container">
          <h4>Monthly Activity</h4>
          <Bar data={monthlyMoviesData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h4>Watch Time by Hour</h4>
          <Bar 
            data={watchTimeByHourData} 
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: {
                  ...chartOptions.scales.x,
                  ticks: {
                    ...chartOptions.scales.x.ticks,
                    callback: (value) => value % 2 === 0 ? `${value}:00` : '',
                  },
                },
              },
            }} 
          />
        </div>
      </div>
      
      {stats.lastWatched && (
        <div className="last-watched">
          <FaCalendarAlt className="last-watched-icon" />
          <span>Last watched on {new Date(stats.lastWatched).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default WatchStats;
