import { 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp,
  query,
  where,
  getDocs,
  limit as firestoreLimit,
  orderBy
} from 'firebase/firestore';
import { 
  getMovieRef, 
  getMovieRatingsRef,
  getUserWatchlistRef,
  getUserRatingsRef,
  getUserHistoryRef,
  collection,
  doc,
  db
} from '../firebase/config';

// Movie Operations
export const getMovie = async (movieId) => {
  try {
    const movieDoc = await getDoc(getMovieRef(movieId));
    if (movieDoc.exists()) {
      return { id: movieDoc.id, ...movieDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting movie:', error);
    throw error;
  }
};

// Watchlist Operations
export const addToWatchlist = async (userId, movie) => {
  try {
    const watchlistRef = getUserWatchlistRef(userId);
    await setDoc(watchlistRef, 
      { movies: arrayUnion(movie) },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (userId, movieId) => {
  try {
    const watchlistRef = getUserWatchlistRef(userId);
    const watchlistDoc = await getDoc(watchlistRef);
    
    if (watchlistDoc.exists()) {
      const watchlist = watchlistDoc.data().movies || [];
      const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
      
      await updateDoc(watchlistRef, {
        movies: updatedWatchlist
      });
    }
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const getWatchlist = async (userId) => {
  try {
    const watchlistRef = getUserWatchlistRef(userId);
    const watchlistDoc = await getDoc(watchlistRef);
    return watchlistDoc.exists() ? watchlistDoc.data().movies || [] : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    throw error;
  }
};

// Rating Operations
export const rateMovie = async (userId, movieId, rating, review = '') => {
  try {
    const userRatingRef = doc(db, 'ratings', `${userId}_${movieId}`);
    const movieRatingsRef = getMovieRatingsRef(movieId);
    
    // Add/update user's rating
    await setDoc(userRatingRef, {
      userId,
      movieId,
      rating,
      review,
      timestamp: serverTimestamp()
    });

    // Update movie's aggregate ratings
    const ratingsSnapshot = await getDocs(
      query(
        collection(db, 'ratings'),
        where('movieId', '==', movieId)
      )
    );

    const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const ratingCount = ratings.length;

    await setDoc(movieRatingsRef, {
      averageRating,
      ratingCount,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // Update user's ratings collection
    const userRatingsRef = getUserRatingsRef(userId);
    await setDoc(userRatingsRef, 
      { 
        ratings: arrayUnion({
          movieId,
          rating,
          review,
          timestamp: serverTimestamp()
        })
      },
      { merge: true }
    );

    return { success: true, averageRating, ratingCount };
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
};

export const getUserRating = async (userId, movieId) => {
  try {
    const userRatingRef = doc(db, 'ratings', `${userId}_${movieId}`);
    const ratingDoc = await getDoc(userRatingRef);
    return ratingDoc.exists() ? ratingDoc.data() : null;
  } catch (error) {
    console.error('Error getting user rating:', error);
    throw error;
  }
};

// Watch History Operations
export const addToWatchHistory = async (userId, movie, durationWatched = 0) => {
  try {
    const historyRef = getUserHistoryRef(userId);
    
    await setDoc(historyRef, 
      { 
        history: arrayUnion({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          durationWatched,
          timestamp: serverTimestamp()
        })
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    throw error;
  }
};

export const getWatchHistory = async (userId, limit = 10) => {
  try {
    const historyRef = getUserHistoryRef(userId);
    const historyDoc = await getDoc(historyRef);
    
    if (!historyDoc.exists()) return [];
    
    const history = historyDoc.data().history || [];
    return history
      .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting watch history:', error);
    throw error;
  }
};

// Analytics Operations
export const getUserMovieStats = async (userId) => {
  try {
    const [watchlist, ratingsDoc, historyDoc] = await Promise.all([
      getWatchlist(userId),
      getDoc(getUserRatingsRef(userId)),
      getDoc(getUserHistoryRef(userId))
    ]);

    const ratings = ratingsDoc.exists() ? ratingsDoc.data().ratings || [] : [];
    const history = historyDoc.exists() ? historyDoc.data().history || [] : [];
    
    // Calculate genre distribution
    const genreCount = {};
    const ratedMovies = ratings.map(r => r.movieId);
    const uniqueRatedMovies = [...new Set(ratedMovies)];
    
    // Get all rated movies details (in a real app, you'd fetch these)
    const movieDetails = []; // This would be populated with actual movie data
    
    movieDetails.forEach(movie => {
      if (movie.genres) {
        movie.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });
    
    const genreDistribution = Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate watch time
    const totalWatchTime = history.reduce((sum, entry) => sum + (entry.durationWatched || 0), 0);
    
    return {
      watchlistCount: watchlist.length,
      ratedCount: uniqueRatedMovies.length,
      watchedCount: history.length,
      totalWatchTime, // in minutes
      genreDistribution,
      recentActivity: history
        .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting user movie stats:', error);
    throw error;
  }
};

// Movie Search (placeholder - would integrate with your movie API)
export const searchMovies = async (query, page = 1) => {
  // This would be replaced with your actual movie API call
  console.log('Searching movies with query:', query, 'page:', page);
  return [];
};
