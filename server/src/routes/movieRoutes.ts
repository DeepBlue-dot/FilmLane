import { Router } from "express";
import { getMovieDetails, getMoviesGenreList, getMoviesGenreName } from "../controllers/movieControllers.js";

const movieRoutes: Router= Router()

movieRoutes.get("/movie/:movieId", getMovieDetails)
movieRoutes.get("/genre/movie/list", getMoviesGenreList)
movieRoutes.get("/genre/movie/:genreId(\\d+)", getMoviesGenreName);

export default movieRoutes;