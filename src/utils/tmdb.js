const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function searchMovies(query, page = 1) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

export async function discoverMovies(genreId, page = 1) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch movies by genre');
  return res.json();
}

export async function getPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
} 