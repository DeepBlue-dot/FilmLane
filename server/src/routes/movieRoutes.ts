import { Router } from "express";
import { discoverMovies, discoverTvShows, getCountriesList, getLanguagesList, getMovieDetails, getMoviesGenreList, getMoviesGenreName, getTvEpisodeDetails, getTvSeasonDetails, getTvShowDetails, getTvShowGenreList, getTvShowGenreName, searchAll, searchMovie, searchTVShows, getTVSimilar, getTVRecommendations, searchPerson, getPersonDetails, getTrendingMedia, getUpcoming, getNowPlaying } from "../controllers/movieControllers.js";

const movieRoutes: Router= Router()

movieRoutes.get("/movie/upcoming", getUpcoming)
movieRoutes.get("/movie/now-playing", getNowPlaying)
movieRoutes.get("/trending/:media_type/:time_window", getTrendingMedia)

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
movieRoutes.get("/countries", getCountriesList)
movieRoutes.get("/Languages", getLanguagesList)

// TV similar and recommendations
movieRoutes.get("/tv/:series_id/similar", getTVSimilar)
movieRoutes.get("/tv/:series_id/recommendations", getTVRecommendations)

// Person endpoints
movieRoutes.get("/person/:id", getPersonDetails)
movieRoutes.get("/search/person", searchPerson)

export default movieRoutes;