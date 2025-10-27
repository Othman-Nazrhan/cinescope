'use client';

import React from 'react';
import { getFavorites, getUserRatings } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StatsPage() {
  const favorites = getFavorites();
  const ratings = getUserRatings();
  const { t } = useLanguage();

  const totalFavorites = favorites.length;
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  const genreStats = favorites.reduce((acc, movie) => {
    movie.genres?.forEach(genre => {
      acc[genre.name] = (acc[genre.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const exportData = () => {
    const data = {
      favorites: favorites.map(f => ({
        id: f.id,
        title: f.title,
        rating: ratings.find(r => r.movieId === f.id)?.rating || null,
        genres: f.genres?.map(g => g.name) || [],
        year: new Date(f.release_date).getFullYear(),
        tmdbRating: f.vote_average
      })),
      ratings: ratings,
      stats: {
        totalFavorites,
        averageRating: parseFloat(averageRating),
        genreDistribution: genreStats
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinescope-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">{t('stats')}</h1>
        <button
          onClick={exportData}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {t('exportJson')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{t('totalFavorites')}</h3>
          <p className="text-3xl font-bold text-red-600">{totalFavorites}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{t('averageRating')}</h3>
          <p className="text-3xl font-bold text-yellow-400">{averageRating}/10</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{t('genreDistribution')}</h3>
          <div className="space-y-2">
            {topGenres.map(([genre, count]) => (
              <div key={genre} className="flex justify-between text-sm">
                <span className="text-gray-300">{genre}</span>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">{t('favorites')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((movie) => {
              const userRating = ratings.find(r => r.movieId === movie.id)?.rating;
              return (
                <div key={movie.id} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">{movie.title}</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>{t('yourRating')}: {userRating ? `${userRating}/10` : t('notRated')}</p>
                    <p>TMDB: {movie.vote_average.toFixed(1)}/10</p>
                    <p>{new Date(movie.release_date).getFullYear()}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres?.slice(0, 2).map((genre) => (
                      <span key={genre.id} className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
