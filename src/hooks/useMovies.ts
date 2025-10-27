import { useState, useEffect } from 'react';
import { Movie, fetchTrendingMovies, searchMovies } from '@/lib/tmdb';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTrendingMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrendingMovies();
      setMovies(data.results);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      await loadTrendingMovies();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchMovies(query);
      setMovies(data.results);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    searchQuery,
    handleSearch,
  };
};
