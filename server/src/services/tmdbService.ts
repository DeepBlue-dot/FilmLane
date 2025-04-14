// tmdb.service.ts
import axios, { AxiosInstance } from 'axios';
import { DiscoverMoviesParams, DiscoverTvShowParams, Genre, PaginatedResponse, paramMappings, TMDBMedia, TMDBMovieCredits, TMDBMovieDetails, TMDBMovieResult, TMDBTvShowCredits, TMDBTVShowDetails, TMDBVideos, TMDBTVShowResult, paramMappingsTv, TvSeasonDetails, TvEpisodeDetails, TMDBCountries, TMDBLanguages } from './interfaces.js';



class TMDBService {
    private apiKey: string;
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    constructor(language = "en-US", include_adult = false) {
        this.apiKey = process.env.TMDB_API_KEY || '';
        this.baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

        if (!this.apiKey) {
            throw new Error('TMDB_API_KEY environment variable is required');
        }

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            params: {
                language,
                include_adult
            },
        });

    }

    async getCountriesList(): Promise<TMDBCountries[]> {
        try {
            const response = await this.axiosInstance.get(`/configuration/countries`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getLanguagesList(): Promise<TMDBLanguages[]> {
        try {
            const response = await this.axiosInstance.get(`/configuration/languages`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Movie Endpoints
    async getMoviesGenreList(): Promise<{ genres: Genre[] }> {
        try {
            const response = await this.axiosInstance.get(`/genre/movie/list`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMoviesGenreName(id: number): Promise<Genre | null> {
        const list = await this.getMoviesGenreList()
        const genre = list.genres.find((g: Genre) => g.id === id);
        return genre ? genre : null;
    }

    async getMovieDetails(movieId: number, options?: { appendToResponse?: any }): Promise<TMDBMovieDetails> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}`, {
                params: {
                    append_to_response: options?.appendToResponse,
                },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getSimilarMovies(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}/similar`, {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMovieRecommendations(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}/recommendations`, {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMovieCredits(movieId: number): Promise<TMDBMovieCredits> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}/credits`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMovieImages(movieId: number): Promise<TMDBMedia> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}/images`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getMovieVideos(movieId: number): Promise<TMDBVideos> {
        try {
            const response = await this.axiosInstance.get(`/movie/${movieId}/videos`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async discoverMovies(params: DiscoverMoviesParams): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            const transformedParams: Record<string, any> = {};

            // Transform camelCase params to API-expected format
            for (const key in params) {
                const mappedKey = paramMappings[key] || key;
                transformedParams[mappedKey] = params[key as keyof DiscoverMoviesParams];
            }

            const response = await this.axiosInstance.get('/discover/movie', {
                params: transformedParams
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async searchMovie(options: { query: string, page: number, primary_release_year?: string, region?: string, year?: string }): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            const response = await this.axiosInstance.get(`/search/movie`, { params: { ...options } })
            return response.data

        } catch (error) {
            this.handleError(error)
        }
    }


    async searchAll(options: { query: string, page: number }): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            const response = await this.axiosInstance.get(`/search/multi`, { params: { ...options } })
            return response.data

        } catch (error) {
            this.handleError(error)
        }
    }

    async searchTVShows(options: { query: string, page: number, first_air_date_year?: string, year?: string }): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            const response = await this.axiosInstance.get(`/search/tv`, { params: { ...options } })
            return response.data

        } catch (error) {
            this.handleError(error)
        }
    }
    // TV Show Endpoints

    async getTVShowGenreList(): Promise<Genre[]> {
        try {
            const response = await this.axiosInstance.get(`/genre/tv/list`);
            return response.data.genres;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTVShowGenreName(id: number): Promise<string | null> {
        const list = await this.getTVShowGenreList()
        const genre = list.find((g: Genre) => g.id === id);
        return genre ? genre.name : null;
    }

    async getTVShowDetails(tvId: number, options?: { appendToResponse?: any }): Promise<TMDBTVShowDetails> {
        try {
            const response = await this.axiosInstance.get(`/tv/${tvId}`, {
                params: {
                    append_to_response: options?.appendToResponse
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getPopularTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            const response = await this.axiosInstance.get('/tv/popular', {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTopRatedTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            const response = await this.axiosInstance.get('/tv/top_rated', {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTvShowsAggregateCredits(series_id: number): Promise<TMDBTvShowCredits> {
        try {
            const response = await this.axiosInstance.get(`/tv/${series_id}/aggregate_credits`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTvShowsCredits(series_id: number): Promise<TMDBTvShowCredits> {
        try {
            const response = await this.axiosInstance.get(`/tv/${series_id}/credits`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async discoverTvShows(params: DiscoverTvShowParams): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            const transformedParams: Record<string, any> = {};

            // Map the parameters from camelCase to the API-expected keys
            for (const key in params) {
                const mappedKey = paramMappingsTv[key] || key;
                transformedParams[mappedKey] = params[key as keyof DiscoverTvShowParams];
            }

            // Make the request to the /discover/tv endpoint with the transformed parameters.
            const response = await this.axiosInstance.get('/discover/tv', {
                params: transformedParams,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTVSeasonsDetails(series_id: number, season_number: number, options?: { appendToResponse?: any }): Promise<TvSeasonDetails> {
        try {
            const response = await this.axiosInstance.get(`/tv/${series_id}/season/${season_number}`, {
                params: {
                    append_to_response: options?.appendToResponse
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTVEpisodesDetails(series_id: number, season_number: number, episode_number: number, options?: { appendToResponse?: any }): Promise<TvEpisodeDetails> {
        try {
            const response = await this.axiosInstance.get(`/tv/${series_id}/season/${season_number}/episode/${episode_number}`, {
                params: {
                    append_to_response: options?.appendToResponse
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }



    private handleError(error: any): never {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.status_message || 'TMDB API Error';
            throw new Error(`TMDB Error ${status}: ${message}`);
        }
        throw new Error(`TMDB Service Error: ${error.message}`);
    }
}

export default TMDBService;