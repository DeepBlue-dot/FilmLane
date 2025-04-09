import asyncHandler from "../services/asyncHandler.js";
import TMDBService from "../services/tmdbService.js";

export const getMovieDetails = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const movie = await tmdb.getMovieDetails(Number(req.params.movieId), { appendToResponse: req.query.appendToResponse })
        res.status(200).json({
            movie
        })
    }
)

export const getTvShowDetails = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const movie = await tmdb.getTVShowDetails(Number(req.params.series_id), { appendToResponse: req.query.appendToResponse })
        res.status(200).json({
            movie
        })
    }
)

export const getTvSeasonDetails = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const movie = await tmdb.getTVSeasonsDetails(Number(req.params.series_id), Number(req.params.season_number), { appendToResponse: req.query.appendToResponse })
        res.status(200).json({
            movie
        })
    }
)

export const getTvEpisodeDetails = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const movie = await tmdb.getTVEpisodesDetails(Number(req.params.series_id), Number(req.params.season_number), Number(req.params.episode_number), { appendToResponse: req.query.appendToResponse })
        res.status(200).json({
            movie
        })
    }
)


export const getMoviesGenreList = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const list = await tmdb.getMoviesGenreList()
        res.status(200).json(list)
    }
)

export const getMoviesGenreName = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const genre = await tmdb.getMoviesGenreName(Number(req.params.genreId))
        res.status(200).json(genre)
    }
)

export const getTvShowGenreList = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const list = await tmdb.getTVShowGenreList()
        res.status(200).json(list)
    }
)

export const getTvShowGenreName = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const genre = await tmdb.getTVShowGenreName(Number(req.params.genreId))
        res.status(200).json(genre)
    }
)

export const discoverMovies = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const moviesResponse = await tmdb.discoverMovies(req.query);
        res.status(200).json(moviesResponse)
    }
)

export const discoverTvShows = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const tvResponse = await tmdb.discoverTvShows(req.query);
        res.status(200).json(tvResponse)
    }
)

export const searchMovie = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const options = {
            query: req.query.query as string,
            page: Number(req.query.page) || 1,
            primary_release_year: req.query.primary_release_year as string,
            region: req.query.region as string,
            year: req.query.year as string,
        };

        const moviesResponse = await tmdb.searchMovie(options);
        res.status(200).json(moviesResponse)
    }
)

export const searchAll = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const options = {
            query: req.query.query as string,
            page: Number(req.query.page) || 1,
        };

        const allResponse = await tmdb.searchAll(options);
        res.status(200).json(allResponse)
    }
)

export const searchTVShows = asyncHandler(
    async (req, res, next) => {
        const tmdb = new TMDBService(`${req.query.language}`, Boolean(req.query.include_adult || false));
        const options = {
            query: req.query.query as string,
            page: Number(req.query.page) || 1,
            first_air_date_year: req.query.first_air_date_year as string,
            year: req.query.year as string,
        };

        const tvResponse = await tmdb.searchTVShows(options);
        res.status(200).json(tvResponse)
    }
)