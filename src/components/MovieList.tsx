'use client';

import { Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error?: string;
}

const MovieList = ({ movies, loading, error }: MovieListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" suppressHydrationWarning>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse" suppressHydrationWarning>
            <div className="h-64 bg-gray-700" suppressHydrationWarning></div>
            <div className="p-4" suppressHydrationWarning>
              <div className="h-4 bg-gray-700 rounded mb-2" suppressHydrationWarning></div>
              <div className="h-3 bg-gray-700 rounded" suppressHydrationWarning></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Aucun film trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" suppressHydrationWarning>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
