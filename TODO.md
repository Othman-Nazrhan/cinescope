# TODO: Integrate TVMaze API for TV Shows with Real Images

## Tasks
- [x] Update src/lib/tmdb.ts to use TVMaze API instead of SWAPI
- [x] Map TVMaze show data to existing Movie interface
- [x] Update image paths to use TVMaze image URLs
- [x] Test the app to ensure images load correctly
- [ ] Update any references if needed (e.g., rename to tvmaze.ts if appropriate)

## Notes
- TVMaze provides images without API key
- Switch from movies to TV shows
- Use /shows?page=1 for trending, /search/shows?q= for search, /shows/{id} for details
