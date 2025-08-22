import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MovieProvider } from './contexts/MovieContext';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <PrivateRoute>
                  <Watchlist />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
