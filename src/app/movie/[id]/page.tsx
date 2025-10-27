'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Movie, fetchMovieDetails, fetchSimilarMovies, fetchMovieVideos, fetchMovieCast, Video, CastMember } from '@/lib/tmdb';
import { addToFavorites, removeFromFavorites, isFavorite, getUserRating, setUserRating } from '@/lib/storage';
import MovieCard from '@/components/MovieCard';
import ActorPopup from '@/components/ActorPopup';
import ImageWithFallback from '@/components/ImageWithFallback';

const RatingStars = ({ rating, onRatingChange }: { rating: number | null; onRatingChange: (rating: number) => void }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className={`text-2xl ${rating && star <= rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-white">{rating ? `${rating}/10` : 'Not rated'}</span>
    </div>
  );
};

export default function MoviePage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRatingState] = useState<number | null>(null);
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        const [movieData, similarData, videosData, castData] = await Promise.all([
          fetchMovieDetails(id),
          fetchSimilarMovies(id),
          fetchMovieVideos(id),
          fetchMovieCast(id)
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData);
        setVideos(videosData);
        setCast(castData);
        setUserRatingState(getUserRating(id));
      } catch (err) {
        setError('Erreur lors du chargement du film');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadMovieData();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleRatingChange = (rating: number) => {
    setUserRatingState(rating);
    setUserRating(id, rating);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="h-4 bg-gray-800 rounded mb-2"></div>
          <div className="h-4 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg">{error || 'Film non trouvé'}</p>
      </div>
    );
  }

  const posterSrc = movie.poster_path.startsWith('http')
    ? movie.poster_path
    : movie.poster_path.startsWith('/')
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden">
            <ImageWithFallback
              src={posterSrc}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
        </div>
        <div className="lg:w-2/3">
          <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-yellow-400 text-lg">⭐ {movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">{movie.overview}</p>

          <div className="space-y-4">
            <button
              onClick={handleFavoriteToggle}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isFavorite(movie.id)
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isFavorite(movie.id) ? '⭐ Retirer des favoris' : '⭐ Ajouter aux favoris'}
            </button>

            <div>
              <h3 className="text-white text-lg font-semibold mb-2">Votre note personnelle</h3>
              <RatingStars rating={userRating} onRatingChange={handleRatingChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {videos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trailer</h2>
          <div className="aspect-video w-full max-w-4xl">
            <iframe
              src={`https://www.youtube.com/embed?listType=search&list=${videos[0].key}`}
              title={`${movie.title} Trailer`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="text-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedActor(actor.id)}
              >
                <ImageWithFallback
                  src={actor.image || ''}
                  alt={actor.name}
                  width={100}
                  height={150}
                  className="rounded-lg object-cover w-full mb-2"
                  fallbackSrc="/placeholder-movie.svg"
                />
                <h3 className="text-white font-semibold text-sm">{actor.name}</h3>
                <p className="text-gray-400 text-xs">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {similarMovies.map((similarMovie) => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}

      {/* Actor Popup */}
      {selectedActor && (
        <ActorPopup actorId={selectedActor} onClose={() => setSelectedActor(null)} />
      )}
    </div>
  );
}
