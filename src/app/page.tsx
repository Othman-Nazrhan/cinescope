'use client';

import SearchBar from '@/components/SearchBar';
import MovieList from '@/components/MovieList';
import { useMovies } from '@/hooks/useMovies';

export default function Home() {
  const { movies, loading, error, searchQuery, handleSearch } = useMovies();

  return (
    <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
      <div className="text-center mb-8" suppressHydrationWarning>
        <h1 className="text-4xl font-bold text-white mb-4">
          {searchQuery ? `Résultats pour "${searchQuery}"` : 'Films Tendances'}
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      <MovieList movies={movies} loading={loading} error={error || undefined} />
    </div>
  );
}
