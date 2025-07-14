import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ query, setQuery, handleSearch }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="movie">🎬</span> Movie Finder
      </div>
      <form className="navbar-search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies by title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Search
        </NavLink>
        <NavLink to="/watchlist" className={({ isActive }) => isActive ? 'active' : ''}>
          Watchlist
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar; 