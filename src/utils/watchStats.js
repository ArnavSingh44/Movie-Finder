/**
 * Utility functions for calculating watch statistics
 */

export const calculateWatchStats = (watchHistory) => {
  if (!watchHistory || watchHistory.length === 0) {
    return {
      totalWatchTime: 0,
      totalMoviesWatched: 0,
      avgWatchTime: 0,
      moviesPerMonth: {},
      watchTimeByHour: {},
      watchTimeByDay: {},
      genreDistribution: {},
      lastWatched: null
    };
  }

  // Sort history by watch date (newest first)
  const sortedHistory = [...watchHistory].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  
  // Calculate totals
  const totalWatchTime = watchHistory.reduce((sum, item) => sum + (item.runtime || 0), 0);
  const totalMoviesWatched = watchHistory.length;
  const avgWatchTime = totalWatchTime / totalMoviesWatched;

  // Calculate movies per month
  const moviesPerMonth = {};
  const watchTimeByHour = Array(24).fill(0);
  const watchTimeByDay = Array(7).fill(0);
  const genreDistribution = {};
  
  watchHistory.forEach(item => {
    // Movies per month
    const date = new Date(item.watchedAt);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    moviesPerMonth[monthYear] = (moviesPerMonth[monthYear] || 0) + 1;
    
    // Watch time by hour
    const hour = new Date(item.watchedAt).getHours();
    watchTimeByHour[hour] += item.runtime || 0;
    
    // Watch time by day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    watchTimeByDay[dayOfWeek] += item.runtime || 0;
    
    // Genre distribution
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach(genre => {
        genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
      });
    }
  });

  // Convert genre distribution to array and sort by count
  const sortedGenres = Object.entries(genreDistribution)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  // Get favorite time of day
  const favoriteHour = watchTimeByHour.indexOf(Math.max(...watchTimeByHour));
  const favoriteDay = watchTimeByDay.indexOf(Math.max(...watchTimeByDay));
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeOfDay = favoriteHour < 12 ? 'morning' : favoriteHour < 17 ? 'afternoon' : 'evening';

  return {
    totalWatchTime,
    totalMoviesWatched,
    avgWatchTime,
    moviesPerMonth,
    watchTimeByHour,
    watchTimeByDay,
    genreDistribution: sortedGenres,
    favoriteTime: {
      hour: favoriteHour,
      day: dayNames[favoriteDay],
      timeOfDay
    },
    lastWatched: sortedHistory[0]?.watchedAt || null
  };
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const getProgressPercentage = (currentTime, totalDuration) => {
  if (!totalDuration) return 0;
  return Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));
};

export const filterWatchHistory = (history, filters = {}) => {
  return history.filter(item => {
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = item.title?.toLowerCase().includes(query);
      const matchesGenre = item.genres?.some(genre => 
        genre.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesGenre) return false;
    }
    
    // Filter by genre
    if (filters.genre && filters.genre !== 'all') {
      if (!item.genres?.includes(filters.genre)) return false;
    }
    
    // Filter by year
    if (filters.year && filters.year !== 'all') {
      const releaseYear = new Date(item.release_date).getFullYear();
      if (String(releaseYear) !== filters.year) return false;
    }
    
    // Filter by rating
    if (filters.minRating) {
      const rating = item.userRating || item.vote_average / 2;
      if (rating < Number(filters.minRating)) return false;
    }
    
    return true;
  });
};

export const sortWatchHistory = (history, sortBy = 'date', sortOrder = 'desc') => {
  const sorted = [...history];
  
  return sorted.sort((a, b) => {
    let compareA, compareB;
    
    switch (sortBy) {
      case 'title':
        compareA = a.title?.toLowerCase() || '';
        compareB = b.title?.toLowerCase() || '';
        return sortOrder === 'asc' 
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
          
      case 'rating':
        compareA = a.userRating || a.vote_average / 2 || 0;
        compareB = b.userRating || b.vote_average / 2 || 0;
        return sortOrder === 'asc' 
          ? compareA - compareB
          : compareB - compareA;
          
      case 'date':
      default:
        compareA = new Date(a.watchedAt || 0).getTime();
        compareB = new Date(b.watchedAt || 0).getTime();
        return sortOrder === 'asc' 
          ? compareA - compareB
          : compareB - compareA;
    }
  });
};

// Generate years for filter dropdown
export const getYearOptions = (history) => {
  const years = new Set();
  history.forEach(item => {
    if (item.release_date) {
      years.add(new Date(item.release_date).getFullYear());
    }
  });
  return Array.from(years).sort((a, b) => b - a);
};
