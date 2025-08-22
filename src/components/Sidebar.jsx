import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import AuthModal from './Auth/AuthModal';
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';

function Sidebar({ children }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!currentUser;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    setIsProfileOpen(false);
  };

  const handleWatchlistNavigation = () => {
    navigate('/watchlist');
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
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
          <div style={{ position: 'relative' }}>
            <div className="profile-section" ref={profileRef}>
              <button 
                className={`profile-button ${isLoggedIn ? 'logged-in' : ''}`}
                onClick={handleProfileClick}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                {isLoggedIn ? (
                  <div className="user-avatar">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                    ) : (
                      <span>{currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}</span>
                    )}
                  </div>
                ) : (
                  <span>👤</span>
                )}
                <span className="profile-text">
                  {isLoggedIn ? (currentUser.displayName || currentUser.email) : 'Sign In'}
                </span>
                {isLoggedIn && <FaChevronDown className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`} />}
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="user-info">
                    <div className="user-avatar">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                      ) : (
                        <FaUser className="default-avatar" />
                      )}
                    </div>
                    <div className="user-details">
                      <h4>{currentUser.displayName || 'User'}</h4>
                      <p>{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleProfileNavigation}>
                    <FaUser className="dropdown-icon" /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={handleWatchlistNavigation}>
                    <FaCog className="dropdown-icon" /> My Watchlist
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" /> Sign Out
                  </button>
                </div>
              )}
            </div>
            <button title="Settings" className="sidebar-btn" style={{ position: 'relative', zIndex: 101 }}>⚙️</button>
          </div>
          <button title="Settings" className="sidebar-btn" style={{ position: 'relative', zIndex: 101 }}>⚙️</button>
        </div>
      </aside>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Sidebar;