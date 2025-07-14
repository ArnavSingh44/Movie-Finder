import React from 'react';
import './Sidebar.css';

function Sidebar({ children }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎬</div>
      <nav className="sidebar-nav">
        <button title="Movies" className="sidebar-btn">🎥</button>
        <button title="Series" className="sidebar-btn">📺</button>
        <button title="TV Shows" className="sidebar-btn">📽️</button>
        <button title="Favorites" className="sidebar-btn">❤️</button>
        <button title="Watchlist" className="sidebar-btn">🔖</button>
      </nav>
      <div className="sidebar-bottom">
        <button title="Profile" className="sidebar-btn">👤</button>
        <button title="Settings" className="sidebar-btn">⚙️</button>
      </div>
    </aside>
  );
}

export default Sidebar; 