'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieList from '@/components/MovieList';
import HeroBanner from '@/components/HeroBanner';
import { useMovies } from '@/hooks/useMovies';
import { fetchGenres } from '@/lib/tmdb';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { movies, loading, loadingMore, error, searchQuery, selectedGenre, hasNextPage, handleSearch, handleGenreFilter, handleRandomMovie, loadMore } = useMovies();
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const loadGenres = async () => {
      const data = await fetchGenres();
      setGenres(data.slice(0, 10)); // Limit to 10 genres for UI
    };
    loadGenres();
  }, []);

  return (
    <div>
      {!searchQuery && !selectedGenre && <HeroBanner />}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {searchQuery ? `${t('resultsFor')} "${searchQuery}"` : selectedGenre ? `${selectedGenre} ${t('movies')}` : t('trending')}
          </h1>
          <SearchBar onSearch={handleSearch} />
          {!searchQuery && (
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreFilter(selectedGenre === genre.name ? '' : genre.name)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedGenre === genre.name
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRandomMovie}
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                🎲 {t('surpriseMe')}
              </button>
            </div>
          )}
        </div>
        <MovieList
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          error={error || undefined}
          hasNextPage={hasNextPage}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}
