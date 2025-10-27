import { useState, useEffect } from 'react';
import { Movie, fetchTrendingMovies, searchMovies, fetchMoviesByGenre, fetchRandomMovie } from '@/lib/tmdb';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadTrendingMovies = async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
        setCurrentPage(1);
        setHasNextPage(true);
      } else {
        setLoadingMore(true);
      }
      const data = await fetchTrendingMovies(page);
      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      setHasNextPage(page < data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedGenre('');
    setCurrentPage(1);
    setHasNextPage(true);
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

  const handleGenreFilter = async (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    setCurrentPage(1);
    setHasNextPage(true);
    if (!genre) {
      await loadTrendingMovies();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchMoviesByGenre(genre);
      setMovies(data.results);
    } catch (err) {
      setError('Erreur lors du filtrage par genre');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (hasNextPage && !loadingMore && !searchQuery && !selectedGenre) {
      await loadTrendingMovies(currentPage + 1, true);
    }
  };

  const handleRandomMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const movie = await fetchRandomMovie();
      setMovies([movie]);
      setSearchQuery('');
      setSelectedGenre('');
    } catch (err) {
      setError('Erreur lors de la sélection aléatoire');
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
    loadingMore,
    error,
    searchQuery,
    selectedGenre,
    hasNextPage,
    handleSearch,
    handleGenreFilter,
    handleRandomMovie,
    loadMore,
  };
};
