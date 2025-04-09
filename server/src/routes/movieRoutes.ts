import { Router } from "express";
import { discoverMovies, discoverTvShows, getMovieDetails, getMoviesGenreList, getMoviesGenreName, getTvEpisodeDetails, getTvSeasonDetails, getTvShowDetails, getTvShowGenreList, getTvShowGenreName, searchAll, searchMovie, searchTVShows } from "../controllers/movieControllers.js";

const movieRoutes: Router= Router()

movieRoutes.get("/movie/:movieId", getMovieDetails)
movieRoutes.get("/tv/:series_id", getTvShowDetails)
movieRoutes.get("/tv/:series_id/season/:season_number", getTvSeasonDetails)
movieRoutes.get("/tv/:series_id/season/:season_number/episode/:episode_number", getTvEpisodeDetails)
movieRoutes.get("/genre/movie/list", getMoviesGenreList)
movieRoutes.get("/genre/movie/:genreId(\\d+)", getMoviesGenreName);
movieRoutes.get("/genre/tv/list", getTvShowGenreList)
movieRoutes.get("/genre/tv/:genreId(\\d+)", getTvShowGenreName);
movieRoutes.get("/discover/movie", discoverMovies)
movieRoutes.get("/discover/tv", discoverTvShows)
movieRoutes.get("/search/movie", searchMovie)
movieRoutes.get("/search/tv", searchTVShows)
movieRoutes.get("/search/multi", searchAll)

export default movieRoutes;