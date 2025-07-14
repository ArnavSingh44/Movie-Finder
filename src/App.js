import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </div>
  );
}

export default App;
