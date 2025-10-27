'use client';

import { useState } from 'react';
import { Movie } from '@/lib/tmdb';
import { getFavorites, removeFromFavorites, getUserRating } from '@/lib/storage';
import MovieCard from '@/components/MovieCard';

type SortOption = 'title' | 'year' | 'tmdb' | 'personal';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>(getFavorites());
  const [sortBy, setSortBy] = useState<SortOption>('title');

  const handleRemoveFavorite = (movieId: number) => {
    removeFromFavorites(movieId);
    setFavorites(getFavorites());
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case 'tmdb':
        return b.vote_average - a.vote_average;
      case 'personal':
        const aRating = getUserRating(a.id) || 0;
        const bRating = getUserRating(b.id) || 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Mes Favoris</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none"
        >
          <option value="title">Trier par titre</option>
          <option value="year">Trier par année</option>
          <option value="tmdb">Trier par note TMDB</option>
          <option value="personal">Trier par note perso</option>
        </select>
      </div>

      {sortedFavorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Aucun film dans vos favoris</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedFavorites.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie} />
              <button
                onClick={() => handleRemoveFavorite(movie.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                title="Retirer des favoris"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
