'use client';

import { useState, useEffect } from 'react';
import { Person, fetchPersonDetails } from '@/lib/tmdb';
import ImageWithFallback from './ImageWithFallback';

interface ActorPopupProps {
  actorId: number;
  onClose: () => void;
}

const ActorPopup = ({ actorId, onClose }: ActorPopupProps) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonDetails(actorId);
        setPerson(data);
      } catch (error) {
        console.error('Error loading actor details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (actorId) loadPerson();
  }, [actorId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">{person.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <ImageWithFallback
              src={person.image || ''}
              alt={person.name}
              width={300}
              height={450}
              className="rounded-lg object-cover w-full"
              fallbackSrc="/placeholder-movie.svg"
            />
          </div>

          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold text-white mb-4">Biography</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{person.biography}</p>

            {person.known_for && person.known_for.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Known For</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {person.known_for.map((movie) => (
                    <div key={movie.id} className="bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-white font-semibold">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">{movie.overview.substring(0, 100)}...</p>
                      <span className="text-yellow-400 text-sm">⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPopup;
