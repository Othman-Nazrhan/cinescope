'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Movie, fetchTrendingMovies } from '@/lib/tmdb';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

const HeroBanner = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const response = await fetchTrendingMovies();
        if (response.results.length > 0) {
          setTrendingMovies(response.results.slice(0, 5)); // Get top 5 for carousel
        }
      } catch (error) {
        console.error('Error loading trending movies:', error);
      }
    };

    loadTrendingMovies();
  }, []);

  useEffect(() => {
    if (trendingMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [trendingMovies.length]);

  if (trendingMovies.length === 0) {
    return (
      <div className="relative h-96 bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>
    );
  }

  const currentMovie = trendingMovies[currentIndex];

  const backdropSrc = currentMovie.backdrop_path.startsWith('http')
    ? currentMovie.backdrop_path
    : currentMovie.backdrop_path.startsWith('/')
    ? currentMovie.backdrop_path
    : `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
  };

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-96 overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backdropSrc}
          alt={currentMovie.title}
          fill
          className="object-cover filter blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {trendingMovies.length > 1 && (
        <>
          <button
            onClick={prevMovie}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            ‹
          </button>
          <button
            onClick={nextMovie}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {trendingMovies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {trendingMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-red-600' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center h-full px-8">
        <div className="max-w-2xl">
          <motion.h1
            key={currentMovie.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4"
          >
            {currentMovie.title}
          </motion.h1>
          <motion.p
            key={`overview-${currentMovie.id}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-200 mb-6 line-clamp-3"
          >
            {currentMovie.overview}
          </motion.p>
          <motion.div
            key={`rating-${currentMovie.id}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center space-x-4 mb-6"
          >
            <span className="text-yellow-400 text-lg">
              ⭐ {currentMovie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300 text-lg">
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
          </motion.div>
          <motion.div
            key={`button-${currentMovie.id}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              href={`/movie/${currentMovie.id}`}
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('watchNow')}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
