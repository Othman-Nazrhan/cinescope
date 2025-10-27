// Using TVMaze API - provides TV shows with real images, no API key required
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
}

export interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  page: number;
}

interface TVMazeShow {
  id: number;
  name: string;
  image?: {
    medium: string;
    original: string;
  };
  summary: string;
  rating?: {
    average: number;
  };
  premiered: string;
  genres: string[];
}

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

// Cache for shows to avoid repeated API calls
let cachedShows: Movie[] | null = null;

const fetchTVMazeShows = async (): Promise<Movie[]> => {
  if (cachedShows) return cachedShows;

  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=0`);
    if (!response.ok) throw new Error('Failed to fetch shows');
    const data: TVMazeShow[] = await response.json();

    cachedShows = data.slice(0, 20).map((show) => ({
      id: show.id,
      title: show.name,
      poster_path: show.image?.medium || "/placeholder-movie.svg",
      backdrop_path: show.image?.original || "/placeholder-movie.svg",
      overview: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No description available.',
      vote_average: show.rating?.average || 7.0,
      release_date: show.premiered || '',
      genre_ids: [], // TVMaze doesn't have genre IDs, but we can map genres
      genres: show.genres.map((genre, index) => ({ id: index + 1, name: genre }))
    }));

    return cachedShows;
  } catch (error) {
    console.error('Error fetching TVMaze shows:', error);
    // Fallback to mock data if TVMaze fails
    return getMockShows();
  }
};

const getMockShows = (): Movie[] => [
  {
    id: 1,
    title: "Breaking Bad",
    poster_path: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg",
    backdrop_path: "https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    vote_average: 9.5,
    release_date: "2008-01-20",
    genre_ids: [18, 80],
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }]
  },
  {
    id: 2,
    title: "Game of Thrones",
    poster_path: "https://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg",
    backdrop_path: "https://static.tvmaze.com/uploads/images/original_untouched/190/476117.jpg",
    overview: "Seven noble families fight for control of the mythical land of Westeros.",
    vote_average: 9.3,
    release_date: "2011-04-17",
    genre_ids: [10765, 18],
    genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }, { id: 18, name: "Drama" }]
  },
  {
    id: 3,
    title: "The Sopranos",
    poster_path: "https://static.tvmaze.com/uploads/images/medium_portrait/4/11341.jpg",
    backdrop_path: "https://static.tvmaze.com/uploads/images/original_untouched/4/11341.jpg",
    overview: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life.",
    vote_average: 9.2,
    release_date: "1999-01-10",
    genre_ids: [18, 80],
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }]
  }
];

export const fetchTrendingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const shows = await fetchTVMazeShows();
  const startIndex = (page - 1) * 20;
  const endIndex = startIndex + 20;
  const paginatedShows = shows.slice(startIndex, endIndex);
  return {
    results: paginatedShows,
    total_pages: Math.ceil(shows.length / 20),
    page
  };
};

export const searchMovies = async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search shows');
    const data: { show: TVMazeShow }[] = await response.json();

    const shows = data.map((item) => ({
      id: item.show.id,
      title: item.show.name,
      poster_path: item.show.image?.medium || "/placeholder-movie.svg",
      backdrop_path: item.show.image?.original || "/placeholder-movie.svg",
      overview: item.show.summary ? item.show.summary.replace(/<[^>]*>/g, '') : 'No description available.',
      vote_average: item.show.rating?.average || 7.0,
      release_date: item.show.premiered || '',
      genre_ids: [],
      genres: item.show.genres.map((genre, index) => ({ id: index + 1, name: genre }))
    }));

    return {
      results: shows,
      total_pages: 1,
      page
    };
  } catch (error) {
    console.error('Error searching TVMaze shows:', error);
    // Fallback to filtering cached shows
    const shows = await fetchTVMazeShows();
    const filteredShows = shows.filter(show =>
      show.title.toLowerCase().includes(query.toLowerCase()) ||
      show.overview.toLowerCase().includes(query.toLowerCase())
    );
    return {
      results: filteredShows,
      total_pages: 1,
      page
    };
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/shows/${id}`);
    if (!response.ok) throw new Error('Failed to fetch show details');
    const show: TVMazeShow = await response.json();

    return {
      id: show.id,
      title: show.name,
      poster_path: show.image?.medium || "/placeholder-movie.svg",
      backdrop_path: show.image?.original || "/placeholder-movie.svg",
      overview: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No description available.',
      vote_average: show.rating?.average || 7.0,
      release_date: show.premiered || '',
      genre_ids: [],
      genres: show.genres.map((genre, index) => ({ id: index + 1, name: genre }))
    };
  } catch (error) {
    console.error('Error fetching TVMaze show details:', error);
    // Fallback to cached shows
    const shows = await fetchTVMazeShows();
    const show = shows.find(s => s.id === id);
    if (!show) throw new Error('Show not found');
    return show;
  }
};

export const fetchTopRatedMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const shows = await fetchTVMazeShows();
  // Sort by vote_average descending
  const sortedShows = shows.sort((a, b) => b.vote_average - a.vote_average);
  return {
    results: sortedShows,
    total_pages: 1,
    page
  };
};

export const fetchGenres = async (): Promise<{ id: number; name: string }[]> => {
  return [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];
};

export const fetchSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  const shows = await fetchTVMazeShows();
  const movie = shows.find(m => m.id === movieId);
  if (!movie) return [];

  // Find movies with at least one matching genre
  const similar = shows.filter(m =>
    m.id !== movieId &&
    m.genres?.some(g => movie.genres?.some(mg => mg.name === g.name))
  ).slice(0, 6); // Limit to 6 similar movies

  return similar;
};

export const fetchMoviesByGenre = async (genreName: string, page = 1): Promise<TMDBResponse<Movie>> => {
  const shows = await fetchTVMazeShows();
  const filtered = shows.filter(m =>
    m.genres?.some(g => g.name.toLowerCase() === genreName.toLowerCase())
  );

  return {
    results: filtered,
    total_pages: 1,
    page
  };
};

export const fetchRandomMovie = async (): Promise<Movie> => {
  const shows = await fetchTVMazeShows();
  const randomIndex = Math.floor(Math.random() * shows.length);
  return shows[randomIndex];
};

export interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

export const fetchMovieVideos = async (movieId: number): Promise<Video[]> => {
  // TVMaze doesn't provide videos, so mock a YouTube trailer based on movie title
  const shows = await fetchTVMazeShows();
  const movie = shows.find(m => m.id === movieId);
  if (!movie) return [];

  // Mock YouTube video key (in reality, you'd search YouTube API, but for demo, use a placeholder)
  // For originality, we'll use a search URL that can be embedded
  return [{
    key: `search?q=${encodeURIComponent(movie.title + ' trailer')}`,
    name: `${movie.title} Trailer`,
    site: 'YouTube',
    type: 'Trailer'
  }];
};

export interface CastMember {
  id: number;
  name: string;
  character: string;
  image?: string;
}

export const fetchMovieCast = async (movieId: number): Promise<CastMember[]> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/shows/${movieId}/cast`);
    if (!response.ok) throw new Error('Failed to fetch cast');
    const data: { person: { id: number; name: string; image?: { medium: string } }; character: { name: string } }[] = await response.json();

    return data.slice(0, 10).map(item => ({
      id: item.person.id,
      name: item.person.name,
      character: item.character.name,
      image: item.person.image?.medium
    }));
  } catch (error) {
    console.error('Error fetching cast:', error);
    return [];
  }
};

export interface Person {
  id: number;
  name: string;
  image?: string;
  biography?: string;
  known_for?: Movie[];
}

export const fetchPersonDetails = async (personId: number): Promise<Person> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/people/${personId}`);
    if (!response.ok) throw new Error('Failed to fetch person details');
    const person: { id: number; name: string; image?: { medium: string }; biography?: string } = await response.json();

    // Fetch cast credits for known_for
    const castResponse = await fetch(`${TVMAZE_BASE_URL}/people/${personId}/castcredits?embed=show`);
    const castData: { _embedded: { show: TVMazeShow } }[] = castResponse.ok ? await castResponse.json() : [];

    const known_for = castData.slice(0, 5).map(item => ({
      id: item._embedded.show.id,
      title: item._embedded.show.name,
      poster_path: item._embedded.show.image?.medium || "/placeholder-movie.svg",
      backdrop_path: item._embedded.show.image?.original || "/placeholder-movie.svg",
      overview: item._embedded.show.summary ? item._embedded.show.summary.replace(/<[^>]*>/g, '') : '',
      vote_average: item._embedded.show.rating?.average || 7.0,
      release_date: item._embedded.show.premiered || '',
      genre_ids: [],
      genres: item._embedded.show.genres.map((genre, index) => ({ id: index + 1, name: genre }))
    }));

    return {
      id: person.id,
      name: person.name,
      image: person.image?.medium,
      biography: person.biography || 'No biography available.',
      known_for
    };
  } catch (error) {
    console.error('Error fetching person details:', error);
    return {
      id: personId,
      name: 'Unknown',
      biography: 'No information available.',
      known_for: []
    };
  }
};
