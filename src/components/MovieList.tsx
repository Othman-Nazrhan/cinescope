'use client';

import { Movie } from '@/lib/tmdb';
import MovieGrid from './MovieGrid';

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  loadingMore?: boolean;
  error?: string;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

const MovieList = ({ movies, loading, loadingMore, error, hasNextPage, onLoadMore }: MovieListProps) => {
  return (
    <MovieGrid
      movies={movies}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasNextPage={hasNextPage}
      onLoadMore={onLoadMore}
      emptyMessage="Aucun film trouvé"
    />
  );
};

export default MovieList;
