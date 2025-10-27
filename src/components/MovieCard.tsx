'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);

  const imageSrc = movie.poster_path.startsWith('http') ? movie.poster_path : movie.poster_path.startsWith('/') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      suppressHydrationWarning={true}
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative h-64">
          <Image
            src={imageError ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=' : imageSrc}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            onError={() => setImageError(true)}
          />
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
