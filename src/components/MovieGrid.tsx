'use client';

import MovieCard from './MovieCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Movie } from '@/lib/tmdb';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  loadingMore?: boolean;
  error?: string;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  skeletonCount?: number;
  emptyMessage?: string;
}

const MovieGrid = ({
  movies,
  loading,
  loadingMore,
  error,
  hasNextPage,
  onLoadMore,
  skeletonCount = 20,
  emptyMessage = 'No movies found'
}: MovieGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <LoadingSkeleton count={skeletonCount} />
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
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {loadingMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
          <LoadingSkeleton count={skeletonCount} />
        </div>
      )}
      <div ref={(node) => {
        if (node && hasNextPage && !loadingMore && onLoadMore) {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                onLoadMore();
              }
            },
            { rootMargin: '100px' }
          );
          observer.observe(node);
          return () => observer.disconnect();
        }
      }} className="h-10"></div>
    </div>
  );
};

export default MovieGrid;
