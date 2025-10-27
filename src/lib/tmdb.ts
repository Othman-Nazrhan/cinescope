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
  return {
    results: shows,
    total_pages: 1,
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
