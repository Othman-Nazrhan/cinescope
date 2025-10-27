# Cinescope

A modern movie discovery web application built with Next.js, allowing users to explore TV shows, search for content, filter by genres, manage favorites, and view detailed information about shows and cast members.

## Features

- **Trending Shows**: Browse the latest trending TV shows
- **Search Functionality**: Search for TV shows by title or description
- **Genre Filtering**: Filter shows by genres like Action, Drama, Comedy, etc.
- **Favorites Management**: Add/remove shows to/from favorites list
- **Movie Details**: View detailed information, cast, and similar shows
- **Top Rated Shows**: Explore highly-rated TV shows
- **Random Show**: Discover random shows with the "Surprise Me" feature
- **Statistics**: View stats about your favorites and browsing habits
- **Multi-language Support**: Switch between different languages
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **API**: TVMaze API (no API key required)
- **State Management**: React Context API
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cinescope
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
cinescope/
├── data/
│   └── favorites.json          # Local storage for favorites
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── favorites/          # Favorites page
│   │   ├── movie/[id]/         # Movie detail page
│   │   ├── stats/              # Statistics page
│   │   ├── top/                # Top-rated shows page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React contexts for theme and language
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions and API calls
└── package.json
```

## API Usage

This application uses the TVMaze API to fetch TV show data. No API key is required, making it easy to run locally. The API provides:

- Show listings and details
- Search functionality
- Cast information
- Genre data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
