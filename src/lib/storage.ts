import { Movie } from './tmdb';

export interface UserRating {
  movieId: number;
  rating: number;
}

export const getFavorites = (): Movie[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
};

export const addToFavorites = (movie: Movie): void => {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === movie.id)) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (movieId: number): void => {
  const favorites = getFavorites().filter(f => f.id !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

export const isFavorite = (movieId: number): boolean => {
  return getFavorites().some(f => f.id === movieId);
};

export const getUserRatings = (): UserRating[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('userRatings');
  return stored ? JSON.parse(stored) : [];
};

export const setUserRating = (movieId: number, rating: number): void => {
  const ratings = getUserRatings();
  const existingIndex = ratings.findIndex(r => r.movieId === movieId);
  if (existingIndex >= 0) {
    ratings[existingIndex].rating = rating;
  } else {
    ratings.push({ movieId, rating });
  }
  localStorage.setItem('userRatings', JSON.stringify(ratings));
};

export const getUserRating = (movieId: number): number | null => {
  const ratings = getUserRatings();
  const rating = ratings.find(r => r.movieId === movieId);
  return rating ? rating.rating : null;
};
