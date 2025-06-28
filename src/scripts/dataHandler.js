let moviesData = [];
const FAVORITES_STORAGE_KEY = "movieFavorites";

export const loadMoviesData = async () => {
  try {
    const response = await fetch("src/data/movies.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    moviesData = await response.json();
    console.log("Movie data loaded successfully:", moviesData);
  } catch (error) {
    console.error("Failed to load movie data:", error);
  }
};

export const getAllMovies = () => {
  return moviesData;
};

export const getMoviesByGenre = (genre) => {
  return moviesData.filter((movie) => movie.genres.includes(genre));
};

export const searchMovies = (query) => {
  const lowerCaseQuery = query.toLowerCase();
  return moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getMovieById = (id) => {
  return moviesData.find((movie) => movie.id === id);
};

export const getLatestMovies = (count = 4) => {
  const sortedMovies = [...moviesData].sort((a, b) => b.year - a.year);
  return sortedMovies.slice(0, count);
};

export const getFavoriteMovieIds = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error parsing favorites from Local Storage:", error);
    return [];
  }
};

const saveFavoriteMovieIds = (favoriteIds) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error("Error saving favorites to Local Storage:", error);
  }
};

export const addMovieToFavorites = (movieId) => {
  let favorites = getFavoriteMovieIds();
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    saveFavoriteMovieIds(favorites);
    return true;
  }
  return false;
};

export const removeMovieFromFavorites = (movieId) => {
  let favorites = getFavoriteMovieIds();
  const initialLength = favorites.length;
  favorites = favorites.filter((id) => id !== movieId);
  if (favorites.length < initialLength) {
    saveFavoriteMovieIds(favorites);
    return true;
  }
  return false;
};

export const isMovieFavorite = (movieId) => {
  const favorites = getFavoriteMovieIds();
  return favorites.includes(movieId);
};

export const getFavoriteMovies = () => {
  const favoriteIds = getFavoriteMovieIds();
  return moviesData.filter((movie) => favoriteIds.includes(movie.id));
};
