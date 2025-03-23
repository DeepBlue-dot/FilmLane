import asyncHandler from "../services/asyncHandler.js";
import TMDBService from "../services/tmdbService.js";

export const getMovieDetails = asyncHandler (
    async (req, res, next) => {
        const tmdb = new TMDBService();
        const movie = await tmdb.getMovieDetails(Number(req.params.movieId), {appendToResponse: req.query.appendToResponse})
        res.status(200).json({
            movie
        })
    }
)

export const getMoviesGenreList = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService();
        const list = await tmdb.getMoviesGenreList()
        res.status(200).json(list)
    }
)

export const getMoviesGenreName = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService();
        const genre = await tmdb.getMoviesGenreName(Number(req.params.genreId))
        res.status(200).json(genre)
    }
)