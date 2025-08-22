import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAepUOgRJI49JkRo6K-e21P2Tpq837zs-c",
  authDomain: "movie-finder-a6bc6.firebaseapp.com",
  projectId: "movie-finder-a6bc6",
  storageBucket: "movie-finder-a6bc6.appspot.com",
  messagingSenderId: "464141307178",
  appId: "1:464141307178:web:3bee31862a340751f7e253",
  measurementId: "G-4T4CHPCY0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Collection References
const usersRef = collection(db, 'users');
const moviesRef = collection(db, 'movies');
const ratingsRef = collection(db, 'ratings');
const watchHistoryRef = collection(db, 'watchHistory');

// User Operations
const getUserDoc = (userId) => doc(db, 'users', userId);
const getUserWatchlistRef = (userId) => doc(db, 'users', userId, 'private', 'watchlist');
const getUserRatingsRef = (userId) => doc(db, 'users', userId, 'private', 'ratings');
const getUserHistoryRef = (userId) => doc(db, 'users', userId, 'private', 'history');

// Movie Operations
const getMovieRef = (movieId) => doc(db, 'movies', movieId);
const getMovieRatingsRef = (movieId) => doc(db, 'movies', movieId, 'aggregates', 'ratings');

// Export everything
export { 
  auth, 
  db,
  analytics,
  // Collections
  usersRef,
  moviesRef,
  ratingsRef,
  watchHistoryRef,
  // Refs
  getUserDoc,
  getUserWatchlistRef,
  getUserRatingsRef,
  getUserHistoryRef,
  getMovieRef,
  getMovieRatingsRef,
  // Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit
};
