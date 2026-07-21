// tmdb.service.ts
import axios, { AxiosInstance } from 'axios';
import { DiscoverMoviesParams, DiscoverTvShowParams, Genre, PaginatedResponse, paramMappings, TMDBMedia, TMDBMovieCredits, TMDBMovieDetails, TMDBMovieResult, TMDBTvShowCredits, TMDBTVShowDetails, TMDBVideos, TMDBTVShowResult, paramMappingsTv, TvSeasonDetails, TvEpisodeDetails, TMDBCountries, TMDBLanguages, MultiSearchResult, TMDBPersonResult } from './interfaces.js';
import OMDBService from './omdbService.js';

class TMDBService {
    private apiKey: string;
    private baseUrl: string;
    private axiosInstance: AxiosInstance;
    private authMode: 'bearer' | 'query';
    private omdbService: OMDBService;

    constructor(options?: {
        language?: string;
        include_adult?: boolean;
        apiKey?: string;
        authMode?: 'bearer' | 'query';
        axiosInstance?: AxiosInstance;
        baseUrl?: string;
    }) {
        const language = options?.language ?? 'en-US';
        const include_adult = options?.include_adult ?? false;
        this.apiKey = options?.apiKey || process.env.TMDB_API_KEY || '';
        this.baseUrl = options?.baseUrl || process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
        this.authMode = options?.authMode || (process.env.TMDB_API_AUTH_MODE as any) || 'bearer';
        this.omdbService = new OMDBService();

        const defaultParams: Record<string, any> = {
            language,
            include_adult,
        };

        if (this.authMode === 'query') {
            defaultParams.api_key = this.apiKey;
        }

        const defaultHeaders: Record<string, string> = {};
        if (this.authMode === 'bearer' && this.apiKey) {
            defaultHeaders.Authorization = `Bearer ${this.apiKey}`;
        }

        if (options?.axiosInstance) {
            this.axiosInstance = options.axiosInstance;
        } else {
            this.axiosInstance = axios.create({
                baseURL: this.baseUrl,
                headers: defaultHeaders,
                params: defaultParams,
            });
        }
    }

    private async paginate24<T>(
        page: number,
        fetchPage: (tmdbPage: number) => Promise<PaginatedResponse<T>>
    ): Promise<PaginatedResponse<T>> {
        const targetPage = Math.max(1, page || 1);
        const pageSize = 24;
        const tmdbPageSize = 20;

        const startIdx = (targetPage - 1) * pageSize;
        const endIdx = targetPage * pageSize;

        const firstTmdbPage = Math.min(500, Math.floor(startIdx / tmdbPageSize) + 1);
        const lastTmdbPage = Math.min(500, Math.floor((endIdx - 1) / tmdbPageSize) + 1);

        const [res1, res2] = await Promise.all([
            fetchPage(firstTmdbPage),
            lastTmdbPage !== firstTmdbPage ? fetchPage(lastTmdbPage) : Promise.resolve(null)
        ]);

        const results1 = res1.results || [];
        const results2 = res2 ? (res2.results || []) : [];
        const mergedResults = [...results1, ...results2];

        const tmdbStartIdx = (firstTmdbPage - 1) * tmdbPageSize;
        const sliceStart = startIdx - tmdbStartIdx;
        const sliceEnd = endIdx - tmdbStartIdx;

        const slicedResults = mergedResults.slice(sliceStart, sliceEnd);
        const totalResults = res1.total_results || results1.length;
        
        // Cap total pages to what TMDB can support (max 500 pages of size 20)
        const tmdbMaxPage = 500;
        const maxPages24 = Math.floor((tmdbMaxPage * tmdbPageSize) / pageSize); // 416
        const totalPages = Math.min(maxPages24, Math.ceil(totalResults / pageSize));

        return {
            page: targetPage,
            results: slicedResults,
            total_pages: totalPages,
            total_results: totalResults
        };
    }

    async getCountriesList(): Promise<TMDBCountries[]> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/configuration/countries`);
            return response.data;
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch countries from TMDB, using OMDb fallback');
            return this.omdbService.getCountriesList();
        }
    }

    async getLanguagesList(): Promise<TMDBLanguages[]> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/configuration/languages`);
            return response.data;
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch languages from TMDB, using OMDb fallback');
            return this.omdbService.getLanguagesList();
        }
    }

    // Movie Endpoints
    async getMoviesGenreList(): Promise<{ genres: Genre[] }> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/genre/movie/list`);
            return response.data;
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch movie genres from TMDB, using OMDb fallback');
            return this.omdbService.getMoviesGenreList();
        }
    }

    async getMoviesGenreName(id: number): Promise<Genre | null> {
        const list = await this.getMoviesGenreList();
        const genre = list.genres.find((g: Genre) => g.id === id);
        return genre ? genre : null;
    }

    async getMovieDetails(movieId: number, options?: { appendToResponse?: any }): Promise<TMDBMovieDetails> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/movie/${movieId}`, {
                params: {
                    append_to_response: options?.appendToResponse,
                },
            });
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch movie details for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getMovieDetails(movieId);
        }
    }

    async getSimilarMovies(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/movie/${movieId}/similar`, {
                    params: { page: p },
                });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch similar movies for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getSimilarMovies(movieId, page);
        }
    }

    async getMovieRecommendations(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/movie/${movieId}/recommendations`, {
                    params: { page: p },
                });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch recommendations for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getMovieRecommendations(movieId, page);
        }
    }

    async getMovieCredits(movieId: number): Promise<TMDBMovieCredits> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/movie/${movieId}/credits`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch movie credits for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getMovieCredits(movieId);
        }
    }

    async getMovieImages(movieId: number): Promise<TMDBMedia> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/movie/${movieId}/images`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch movie images for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getMovieImages(movieId);
        }
    }

    async getMovieVideos(movieId: number): Promise<TMDBVideos> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/movie/${movieId}/videos`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch movie videos for ${movieId} from TMDB, using OMDb fallback`);
            return this.omdbService.getMovieVideos(movieId);
        }
    }

    async discoverMovies(params: DiscoverMoviesParams): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const transformedParams: Record<string, any> = {};

            for (const key in params) {
                if (key === 'page') continue;
                const mappedKey = paramMappings[key] || key;
                transformedParams[mappedKey] = params[key as keyof DiscoverMoviesParams];
            }

            return this.paginate24(Number(params.page) || 1, async (p) => {
                const response = await this.axiosInstance.get('/discover/movie', {
                    params: { ...transformedParams, page: p }
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to discover movies from TMDB, using OMDb fallback');
            return this.omdbService.discoverMovies(params);
        }
    }

    async searchMovie(options: { query: string, page: number, primary_release_year?: string, region?: string, year?: string }): Promise<PaginatedResponse<TMDBMovieResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const { page, ...otherOptions } = options;
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/search/movie`, { params: { ...otherOptions, page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to search movies (${options.query}) from TMDB, using OMDb fallback`);
            return this.omdbService.searchMovie(options);
        }
    }

    async searchAll(options: { query: string, page: number }): Promise<PaginatedResponse<MultiSearchResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const { page, ...otherOptions } = options;
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/search/multi`, { params: { ...otherOptions, page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed multi-search (${options.query}) from TMDB, using OMDb fallback`);
            return this.omdbService.searchAll(options);
        }
    }

    async searchPerson(options: { query: string, page?: number }): Promise<PaginatedResponse<TMDBPersonResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const { page, ...otherOptions } = options;
            return this.paginate24(page || 1, async (p) => {
                const response = await this.axiosInstance.get(`/search/person`, { params: { ...otherOptions, page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to search person (${options.query}) from TMDB, using OMDb fallback`);
            return this.omdbService.searchPerson(options);
        }
    }

    async searchTVShows(options: { query: string, page: number, first_air_date_year?: string, year?: string }): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const { page, ...otherOptions } = options;
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/search/tv`, { params: { ...otherOptions, page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to search TV shows (${options.query}) from TMDB, using OMDb fallback`);
            return this.omdbService.searchTVShows(options);
        }
    }

    // TV Show Endpoints
    async getTVShowGenreList(): Promise<Genre[]> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/genre/tv/list`);
            return response.data.genres;
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch TV genres from TMDB, using OMDb fallback');
            return this.omdbService.getTVShowGenreList();
        }
    }

    async getTVShowGenreName(id: number): Promise<Genre | null> {
        const list = await this.getTVShowGenreList();
        const genre = list.find((g: Genre) => g.id === id);
        return genre ? genre : null;
    }

    async getTVShowDetails(tvId: number, options?: { appendToResponse?: any }): Promise<TMDBTVShowDetails> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            let appendToResponse = options?.appendToResponse;
            if (appendToResponse) {
                if (!appendToResponse.includes('external_ids')) {
                    appendToResponse += ',external_ids';
                }
            } else {
                appendToResponse = 'external_ids';
            }

            const response = await this.axiosInstance.get(`/tv/${tvId}`, {
                params: {
                    append_to_response: appendToResponse
                }
            });

            const data = response.data;
            if (data && data.external_ids && data.external_ids.imdb_id) {
                data.imdb_id = data.external_ids.imdb_id;
            }
            return data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch TV show details for ${tvId} from TMDB, using OMDb fallback`);
            const fallbackData = await this.omdbService.getTVShowDetails(tvId);
            if (fallbackData) {
                fallbackData.imdb_id = this.omdbService['formatImdbId'](tvId);
            }
            return fallbackData;
        }
    }

    async getPopularTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get('/tv/popular', {
                    params: { page: p },
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch popular TV shows from TMDB, using OMDb fallback');
            return this.omdbService.getPopularTVShows(page);
        }
    }

    async getTVSimilar(tvId: number, page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/tv/${tvId}/similar`, { params: { page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch similar TV shows for ${tvId} from TMDB, using OMDb fallback`);
            return this.omdbService.getTVSimilar(tvId, page);
        }
    }

    async getTVRecommendations(tvId: number, page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/tv/${tvId}/recommendations`, { params: { page: p } });
                return response.data;
            });
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch TV recommendations for ${tvId} from TMDB, using OMDb fallback`);
            return this.omdbService.getTVRecommendations(tvId, page);
        }
    }

    async getPersonDetails(personId: number): Promise<TMDBPersonResult> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/person/${personId}`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch person details for ${personId} from TMDB, using OMDb fallback`);
            return this.omdbService.getPersonDetails(personId);
        }
    }

    async getTopRatedTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get('/tv/top_rated', {
                    params: { page: p },
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch top rated TV shows from TMDB, using OMDb fallback');
            return this.omdbService.getTopRatedTVShows(page);
        }
    }

    async getTvShowsAggregateCredits(series_id: number): Promise<TMDBTvShowCredits> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/tv/${series_id}/aggregate_credits`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch aggregate credits for ${series_id} from TMDB, using OMDb fallback`);
            return this.omdbService.getTvShowsCredits(series_id);
        }
    }

    async getTvShowsCredits(series_id: number): Promise<TMDBTvShowCredits> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/tv/${series_id}/credits`);
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch credits for ${series_id} from TMDB, using OMDb fallback`);
            return this.omdbService.getTvShowsCredits(series_id);
        }
    }

    async discoverTvShows(params: DiscoverTvShowParams): Promise<PaginatedResponse<TMDBTVShowResult>> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const transformedParams: Record<string, any> = {};

            for (const key in params) {
                if (key === 'page') continue;
                const mappedKey = paramMappingsTv[key] || key;
                transformedParams[mappedKey] = params[key as keyof DiscoverTvShowParams];
            }

            return this.paginate24(Number(params.page) || 1, async (p) => {
                const response = await this.axiosInstance.get('/discover/tv', {
                    params: { ...transformedParams, page: p },
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to discover TV shows from TMDB, using OMDb fallback');
            return this.omdbService.discoverTvShows(params);
        }
    }

    async getTVSeasonsDetails(series_id: number, season_number: number, options?: { appendToResponse?: any }): Promise<TvSeasonDetails> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/tv/${series_id}/season/${season_number}`, {
                params: {
                    append_to_response: options?.appendToResponse
                }
            });
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch season details for ${series_id} S${season_number} from TMDB, using OMDb fallback`);
            return this.omdbService.getTVSeasonsDetails(series_id, season_number);
        }
    }

    async getTVEpisodesDetails(series_id: number, season_number: number, episode_number: number, options?: { appendToResponse?: any }): Promise<TvEpisodeDetails> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            const response = await this.axiosInstance.get(`/tv/${series_id}/season/${season_number}/episode/${episode_number}`, {
                params: {
                    append_to_response: options?.appendToResponse
                }
            });
            return response.data;
        } catch (error) {
            console.warn(`[TMDBService] Failed to fetch episode details for ${series_id} S${season_number}E${episode_number} from TMDB, using OMDb fallback`);
            return this.omdbService.getTVEpisodesDetails(series_id, season_number, episode_number);
        }
    }

    async getTrending(mediaType: 'all' | 'movie' | 'tv', timeWindow: 'day' | 'week', page = 1): Promise<any> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/trending/${mediaType}/${timeWindow}`, {
                    params: { page: p }
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch trending from TMDB, using OMDb fallback');
            return this.omdbService.getTrending(mediaType, timeWindow, page);
        }
    }

    async getUpcomingMovies(page = 1): Promise<any> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/movie/upcoming`, {
                    params: { page: p }
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch upcoming movies from TMDB, using OMDb fallback');
            return this.omdbService.getUpcomingMovies(page);
        }
    }

    async getNowPlayingMovies(page = 1): Promise<any> {
        try {
            if (!this.apiKey) throw new Error('No TMDB key');
            return this.paginate24(page, async (p) => {
                const response = await this.axiosInstance.get(`/movie/now_playing`, {
                    params: { page: p }
                });
                return response.data;
            });
        } catch (error) {
            console.warn('[TMDBService] Failed to fetch now playing movies from TMDB, using OMDb fallback');
            return this.omdbService.getNowPlayingMovies(page);
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