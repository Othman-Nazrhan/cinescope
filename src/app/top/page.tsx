'use client';

import { useState, useEffect } from 'react';
import { Movie, fetchTopRatedMovies, fetchGenres } from '@/lib/tmdb';
import { getUserRating } from '@/lib/storage';
import MovieCard from '@/components/MovieCard';

export default function TopPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [moviesData, genresData] = await Promise.all([
          fetchTopRatedMovies(),
          fetchGenres()
        ]);
        setMovies(moviesData.results.slice(0, 10));
        setGenres(genresData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies;

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const aRating = getUserRating(a.id) || a.vote_average;
    const bRating = getUserRating(b.id) || b.vote_average;
    return bRating - aRating;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Top 10 Films</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Top 10 Films</h1>
        <select
          value={selectedGenre || ''}
          onChange={(e) => setSelectedGenre(e.target.value ? parseInt(e.target.value) : null)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none"
        >
          <option value="">Tous les genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {sortedMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Aucun film trouvé pour ce genre</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedMovies.map((movie, index) => (
            <div key={movie.id} className="relative">
              <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">
                {index + 1}
              </div>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
