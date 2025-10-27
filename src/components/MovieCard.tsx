'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb';
import { addToFavorites, removeFromFavorites, isFavorite } from '@/lib/storage';
import ImageWithFallback from './ImageWithFallback';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isFav, setIsFav] = useState(isFavorite(movie.id));

  const imageSrc = movie.poster_path.startsWith('http')
    ? movie.poster_path
    : movie.poster_path.startsWith('/')
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
    setIsFav(!isFav);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative group"
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative h-64">
          <ImageWithFallback
            src={imageSrc}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm font-medium drop-shadow-lg">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300 text-sm drop-shadow-lg">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>
          </motion.div>
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isFav ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-white text-lg">⭐</span>
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-sm">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
