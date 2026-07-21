// omdbService.ts
import axios, { AxiosInstance } from 'axios';
import {
    DiscoverMoviesParams,
    DiscoverTvShowParams,
    Genre,
    MultiSearchResult,
    PaginatedResponse,
    TMDBCountries,
    TMDBLanguages,
    TMDBMedia,
    TMDBMovieCredits,
    TMDBMovieDetails,
    TMDBMovieResult,
    TMDBPersonResult,
    TMDBTVShowDetails,
    TMDBTvShowCredits,
    TMDBTVShowResult,
    TMDBVideos,
    TvEpisodeDetails,
    TvSeasonDetails
} from './interfaces.js';

export interface OMDBMovieDetail {
    Title: string;
    Year: string;
    Rated?: string;
    Released?: string;
    Runtime?: string;
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
    Plot?: string;
    Language?: string;
    Country?: string;
    Awards?: string;
    Poster?: string;
    Ratings?: { Source: string; Value: string }[];
    Metascore?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbID?: string;
    Type?: 'movie' | 'series' | 'episode';
    totalSeasons?: string;
    Response: 'True' | 'False';
    Error?: string;
    Production?: string;
}

export interface OMDBSearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface OMDBSearchResponse {
    Search?: OMDBSearchResult[];
    totalResults?: string;
    Response: 'True' | 'False';
    Error?: string;
}

export interface OMDBSeasonResponse {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes?: {
        Title: string;
        Released: string;
        Episode: string;
        imdbRating: string;
        imdbID: string;
    }[];
    Response: 'True' | 'False';
    Error?: string;
}

class OMDBService {
    private apiKey: string;
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    constructor(options?: { apiKey?: string; baseUrl?: string }) {
        this.apiKey = options?.apiKey || process.env.OMDB_API_KEY || '1a30fa3a';
        this.baseUrl = options?.baseUrl || process.env.OMDB_BASE_URL || 'https://www.omdbapi.com/';

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            params: {
                apikey: this.apiKey,
            },
        });
    }

    private formatImdbId(id: number | string): string {
        const idStr = String(id);
        if (idStr.startsWith('tt')) {
            return idStr;
        }
        return `tt${idStr.padStart(7, '0')}`;
    }

    private parseNumericId(idStr?: string, fallback = 0): number {
        if (!idStr) return fallback;
        const digits = idStr.replace(/\D/g, '');
        return digits ? parseInt(digits, 10) : fallback;
    }

    private mapPoster(poster?: string): string | undefined {
        if (!poster || poster === 'N/A') return undefined;
        return poster;
    }

    private parseGenres(genreStr?: string): Genre[] {
        if (!genreStr || genreStr === 'N/A') return [];
        return genreStr.split(',').map((g, idx) => ({
            id: idx + 1,
            name: g.trim(),
        }));
    }

    async getByImdbIdOrTitle(params: { i?: string; t?: string; type?: string; plot?: string; y?: string }): Promise<OMDBMovieDetail | null> {
        try {
            const response = await this.axiosInstance.get<OMDBMovieDetail>('', {
                params: {
                    plot: 'full',
                    ...params,
                },
            });
            if (response.data.Response === 'True') {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async searchOMDB(params: { s: string; type?: string; page?: number; y?: string }): Promise<OMDBSearchResponse> {
        try {
            const response = await this.axiosInstance.get<OMDBSearchResponse>('', {
                params,
            });
            return response.data;
        } catch (error) {
            return { Response: 'False', Error: (error as Error).message };
        }
    }

    async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
        const imdbId = this.formatImdbId(movieId);
        let data = await this.getByImdbIdOrTitle({ i: imdbId, type: 'movie' });

        if (!data) {
            data = await this.getByImdbIdOrTitle({ i: imdbId });
        }

        const title = data?.Title || `Movie ${movieId}`;
        const poster = this.mapPoster(data?.Poster);
        const voteAverage = parseFloat(data?.imdbRating || '0') || 0;
        const voteCount = parseInt((data?.imdbVotes || '0').replace(/,/g, ''), 10) || 0;

        return {
            id: movieId,
            title,
            original_title: title,
            overview: data?.Plot && data.Plot !== 'N/A' ? data.Plot : 'No description available.',
            poster_path: poster,
            backdrop_path: poster,
            release_date: data?.Released && data.Released !== 'N/A' ? data.Released : (data?.Year || ''),
            runtime: parseInt((data?.Runtime || '0').replace(/\D/g, ''), 10) || 0,
            genres: this.parseGenres(data?.Genre),
            adult: false,
            budget: 0,
            homepage: '',
            imdb_id: data?.imdbID || imdbId,
            original_language: data?.Language ? data.Language.split(',')[0].toLowerCase().trim() : 'en',
            popularity: voteCount / 100,
            production_companies: data?.Production && data.Production !== 'N/A'
                ? [{ id: 1, name: data.Production, origin_country: 'US' }]
                : [],
            production_countries: data?.Country
                ? data.Country.split(',').map((c) => ({ iso_3166_1: c.trim().slice(0, 2).toUpperCase(), name: c.trim() }))
                : [],
            revenue: 0,
            spoken_languages: data?.Language
                ? data.Language.split(',').map((l) => ({ iso_639_1: l.trim().slice(0, 2).toLowerCase(), name: l.trim() }))
                : [],
            status: 'Released',
            tagline: data?.Awards && data.Awards !== 'N/A' ? data.Awards : undefined,
            video: false,
            vote_average: voteAverage,
            vote_count: voteCount,
        };
    }

    async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
        const imdbId = this.formatImdbId(tvId);
        let data = await this.getByImdbIdOrTitle({ i: imdbId, type: 'series' });

        if (!data) {
            data = await this.getByImdbIdOrTitle({ i: imdbId });
        }

        const name = data?.Title || `Series ${tvId}`;
        const poster = this.mapPoster(data?.Poster);
        const voteAverage = parseFloat(data?.imdbRating || '0') || 0;
        const voteCount = parseInt((data?.imdbVotes || '0').replace(/,/g, ''), 10) || 0;
        const totalSeasons = parseInt(data?.totalSeasons || '1', 10) || 1;

        const seasons = Array.from({ length: totalSeasons }, (_, index) => ({
            air_date: data?.Released || '',
            episode_count: 10,
            id: index + 1,
            name: `Season ${index + 1}`,
            overview: `Season ${index + 1} of ${name}`,
            poster_path: poster || '',
            season_number: index + 1,
            vote_average: voteAverage,
        }));

        return {
            adult: false,
            backdrop_path: poster || null,
            created_by: data?.Director && data.Director !== 'N/A'
                ? [{ id: 1, credit_id: '1', name: data.Director, gender: 0, profile_path: '' }]
                : [],
            episode_run_time: data?.Runtime ? [parseInt(data.Runtime.replace(/\D/g, ''), 10) || 0] : [],
            first_air_date: data?.Released && data.Released !== 'N/A' ? data.Released : (data?.Year || ''),
            genres: this.parseGenres(data?.Genre),
            homepage: '',
            id: tvId,
            in_production: false,
            languages: data?.Language ? data.Language.split(',').map((l) => l.trim()) : ['en'],
            last_air_date: '',
            last_episode_to_air: null,
            next_episode_to_air: null,
            networks: [],
            number_of_episodes: totalSeasons * 10,
            number_of_seasons: totalSeasons,
            origin_country: data?.Country ? data.Country.split(',').map((c) => c.trim()) : ['US'],
            original_language: data?.Language ? data.Language.split(',')[0].toLowerCase().trim() : 'en',
            original_name: name,
            overview: data?.Plot && data.Plot !== 'N/A' ? data.Plot : 'No description available.',
            popularity: voteCount / 100,
            poster_path: poster || null,
            production_companies: [],
            production_countries: [],
            seasons,
            spoken_languages: data?.Language
                ? data.Language.split(',').map((l) => ({ english_name: l.trim(), iso_639_1: l.trim().slice(0, 2).toLowerCase(), name: l.trim() }))
                : [],
            status: 'Ended',
            tagline: data?.Awards && data.Awards !== 'N/A' ? data.Awards : null,
            type: 'Scripted',
            vote_average: voteAverage,
            vote_count: voteCount,
        };
    }

    async searchMovie(options: { query: string; page: number; year?: string }): Promise<PaginatedResponse<TMDBMovieResult>> {
        const query = options.query || 'movie';
        const res = await this.searchOMDB({ s: query, type: 'movie', page: options.page || 1, y: options.year });
        const items = res.Search || [];
        const totalResults = parseInt(res.totalResults || '0', 10) || items.length;

        const results: TMDBMovieResult[] = items.map((item) => {
            const id = this.parseNumericId(item.imdbID);
            const poster = this.mapPoster(item.Poster);
            return {
                adult: false,
                backdrop_path: poster || null,
                genre_ids: [],
                id,
                original_language: 'en',
                original_title: item.Title,
                overview: `Released in ${item.Year}`,
                popularity: 10,
                poster_path: poster || null,
                release_date: item.Year,
                title: item.Title,
                video: false,
                vote_average: 7.5,
                vote_count: 100,
                media_type: 'movie',
            };
        });

        return {
            page: options.page || 1,
            results,
            total_pages: Math.ceil(totalResults / 10) || 1,
            total_results: totalResults,
        };
    }

    async searchTVShows(options: { query: string; page: number; year?: string }): Promise<PaginatedResponse<TMDBTVShowResult>> {
        const query = options.query || 'series';
        const res = await this.searchOMDB({ s: query, type: 'series', page: options.page || 1, y: options.year });
        const items = res.Search || [];
        const totalResults = parseInt(res.totalResults || '0', 10) || items.length;

        const results: TMDBTVShowResult[] = items.map((item) => {
            const id = this.parseNumericId(item.imdbID);
            const poster = this.mapPoster(item.Poster);
            return {
                backdrop_path: poster || null,
                first_air_date: item.Year,
                genre_ids: [],
                id,
                name: item.Title,
                origin_country: ['US'],
                original_language: 'en',
                original_name: item.Title,
                overview: `Released in ${item.Year}`,
                popularity: 10,
                poster_path: poster || null,
                vote_average: 7.5,
                vote_count: 100,
            };
        });

        return {
            page: options.page || 1,
            results,
            total_pages: Math.ceil(totalResults / 10) || 1,
            total_results: totalResults,
        };
    }

    async searchAll(options: { query: string; page: number }): Promise<PaginatedResponse<MultiSearchResult>> {
        const query = options.query || 'all';
        const res = await this.searchOMDB({ s: query, page: options.page || 1 });
        const items = res.Search || [];
        const totalResults = parseInt(res.totalResults || '0', 10) || items.length;

        const results: MultiSearchResult[] = items.map((item) => {
            const id = this.parseNumericId(item.imdbID);
            const poster = this.mapPoster(item.Poster);
            if (item.Type === 'series') {
                return {
                    backdrop_path: poster || null,
                    first_air_date: item.Year,
                    genre_ids: [],
                    id,
                    name: item.Title,
                    origin_country: ['US'],
                    original_language: 'en',
                    original_name: item.Title,
                    overview: `Released in ${item.Year}`,
                    popularity: 10,
                    poster_path: poster || null,
                    vote_average: 7.5,
                    vote_count: 100,
                    media_type: 'tv',
                } as TMDBTVShowResult & { media_type: string };
            }
            return {
                adult: false,
                backdrop_path: poster || null,
                genre_ids: [],
                id,
                original_language: 'en',
                original_title: item.Title,
                overview: `Released in ${item.Year}`,
                popularity: 10,
                poster_path: poster || null,
                release_date: item.Year,
                title: item.Title,
                video: false,
                vote_average: 7.5,
                vote_count: 100,
                media_type: 'movie',
            } as TMDBMovieResult & { media_type: string };
        });

        return {
            page: options.page || 1,
            results,
            total_pages: Math.ceil(totalResults / 10) || 1,
            total_results: totalResults,
        };
    }

    async discoverMovies(params: DiscoverMoviesParams): Promise<PaginatedResponse<TMDBMovieResult>> {
        const searchKeyword = params.withKeywords || 'top';
        return this.searchMovie({ query: searchKeyword, page: params.page || 1 });
    }

    async discoverTvShows(params: DiscoverTvShowParams): Promise<PaginatedResponse<TMDBTVShowResult>> {
        const searchKeyword = params.with_keywords || 'popular';
        return this.searchTVShows({ query: searchKeyword, page: params.page || 1 });
    }

    async getTrending(mediaType: 'all' | 'movie' | 'tv', timeWindow: 'day' | 'week', page = 1): Promise<any> {
        if (mediaType === 'tv') {
            return this.searchTVShows({ query: 'popular', page });
        }
        if (mediaType === 'movie') {
            return this.searchMovie({ query: 'action', page });
        }
        return this.searchAll({ query: 'hero', page });
    }

    async getUpcomingMovies(page = 1): Promise<any> {
        return this.searchMovie({ query: '2025', page });
    }

    async getNowPlayingMovies(page = 1): Promise<any> {
        return this.searchMovie({ query: '2024', page });
    }

    async getPopularTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        return this.searchTVShows({ query: 'popular', page });
    }

    async getTopRatedTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        return this.searchTVShows({ query: 'top', page });
    }

    async getTVSimilar(tvId: number, page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        return this.searchTVShows({ query: 'drama', page });
    }

    async getTVRecommendations(tvId: number, page = 1): Promise<PaginatedResponse<TMDBTVShowResult>> {
        return this.searchTVShows({ query: 'popular', page });
    }

    async getSimilarMovies(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        return this.searchMovie({ query: 'adventure', page });
    }

    async getMovieRecommendations(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieResult>> {
        return this.searchMovie({ query: 'popular', page });
    }

    async getMovieCredits(movieId: number): Promise<TMDBMovieCredits> {
        const imdbId = this.formatImdbId(movieId);
        const data = await this.getByImdbIdOrTitle({ i: imdbId });
        const actors = (data?.Actors || '').split(',').map((name, idx) => ({
            adult: false,
            gender: 0,
            id: idx + 1,
            known_for_department: 'Acting',
            name: name.trim(),
            original_name: name.trim(),
            popularity: 5,
            profile_path: '',
            cast_id: idx + 1,
            character: 'Role',
            credit_id: `cast_${idx}`,
            order: idx,
        }));
        const directors = (data?.Director || '').split(',').map((name, idx) => ({
            adult: false,
            gender: 0,
            id: 100 + idx,
            known_for_department: 'Directing',
            name: name.trim(),
            original_name: name.trim(),
            popularity: 5,
            profile_path: '',
            credit_id: `crew_${idx}`,
            department: 'Directing',
            job: 'Director',
        }));

        return {
            id: movieId,
            cast: actors,
            crew: directors,
        };
    }

    async getTvShowsCredits(series_id: number): Promise<TMDBTvShowCredits> {
        const imdbId = this.formatImdbId(series_id);
        const data = await this.getByImdbIdOrTitle({ i: imdbId });
        const actors = (data?.Actors || '').split(',').map((name, idx) => ({
            adult: false,
            gender: 0,
            id: idx + 1,
            known_for_department: 'Acting',
            name: name.trim(),
            original_name: name.trim(),
            popularity: 5,
            profile_path: '',
            roles: [{ credit_id: `role_${idx}`, character: 'Role', episode_count: 10, total_episode_count: 10, order: idx }],
        }));

        return {
            cast: actors,
            crew: [],
        };
    }

    async getMovieImages(movieId: number): Promise<TMDBMedia> {
        const imdbId = this.formatImdbId(movieId);
        const data = await this.getByImdbIdOrTitle({ i: imdbId });
        const poster = this.mapPoster(data?.Poster);
        return {
            id: movieId,
            backdrops: poster ? [{ aspect_ratio: 1.77, height: 1080, iso_639_1: 'en', file_path: poster, vote_average: 8, vote_count: 10, width: 1920 }] : [],
            logos: [],
            posters: poster ? [{ aspect_ratio: 0.66, height: 1000, iso_639_1: 'en', file_path: poster, vote_average: 8, vote_count: 10, width: 666 }] : [],
        };
    }

    async getMovieVideos(movieId: number): Promise<TMDBVideos> {
        return {
            id: movieId,
            results: [],
        };
    }

    async getTVSeasonsDetails(series_id: number, season_number: number): Promise<TvSeasonDetails> {
        const imdbId = this.formatImdbId(series_id);
        try {
            const res = await this.axiosInstance.get<OMDBSeasonResponse>('', {
                params: {
                    i: imdbId,
                    Season: season_number,
                },
            });

            const episodes = (res.data.Episodes || []).map((ep) => ({
                id: this.parseNumericId(ep.imdbID),
                name: ep.Title,
                overview: `Air Date: ${ep.Released}`,
                vote_average: parseFloat(ep.imdbRating || '0') || 0,
                vote_count: 50,
                air_date: ep.Released,
                episode_number: parseInt(ep.Episode || '1', 10) || 1,
                production_code: ep.imdbID,
                runtime: 45,
                season_number,
                show_id: series_id,
                still_path: '',
            }));

            return {
                id: season_number,
                air_date: '',
                episodes,
                crew: [],
                guest_stars: [],
            };
        } catch {
            return {
                id: season_number,
                air_date: '',
                episodes: [],
                crew: [],
                guest_stars: [],
            };
        }
    }

    async getTVEpisodesDetails(series_id: number, season_number: number, episode_number: number): Promise<TvEpisodeDetails> {
        const imdbId = this.formatImdbId(series_id);
        try {
            const data = await this.getByImdbIdOrTitle({ i: imdbId });
            return {
                air_date: data?.Released || '',
                crew: [],
                guest_stars: [],
                name: `Episode ${episode_number}`,
                overview: data?.Plot && data.Plot !== 'N/A' ? data.Plot : '',
                id: episode_number,
                production_code: '',
                runtime: parseInt((data?.Runtime || '0').replace(/\D/g, ''), 10) || 45,
                season_number,
                still_path: this.mapPoster(data?.Poster) || '',
                vote_average: parseFloat(data?.imdbRating || '0') || 0,
                vote_count: parseInt((data?.imdbVotes || '0').replace(/,/g, ''), 10) || 0,
            };
        } catch {
            return {
                air_date: '',
                crew: [],
                guest_stars: [],
                name: `Episode ${episode_number}`,
                overview: '',
                id: episode_number,
                production_code: '',
                runtime: 45,
                season_number,
                still_path: '',
                vote_average: 0,
                vote_count: 0,
            };
        }
    }

    async getMoviesGenreList(): Promise<{ genres: Genre[] }> {
        return {
            genres: [
                { id: 28, name: 'Action' },
                { id: 12, name: 'Adventure' },
                { id: 16, name: 'Animation' },
                { id: 35, name: 'Comedy' },
                { id: 80, name: 'Crime' },
                { id: 99, name: 'Documentary' },
                { id: 18, name: 'Drama' },
                { id: 10751, name: 'Family' },
                { id: 14, name: 'Fantasy' },
                { id: 36, name: 'History' },
                { id: 27, name: 'Horror' },
                { id: 10402, name: 'Music' },
                { id: 9648, name: 'Mystery' },
                { id: 10749, name: 'Romance' },
                { id: 878, name: 'Science Fiction' },
                { id: 10770, name: 'TV Movie' },
                { id: 53, name: 'Thriller' },
                { id: 10752, name: 'War' },
                { id: 37, name: 'Western' },
            ],
        };
    }

    async getTVShowGenreList(): Promise<Genre[]> {
        const list = await this.getMoviesGenreList();
        return list.genres;
    }

    async getMoviesGenreName(id: number): Promise<Genre | null> {
        const list = await this.getMoviesGenreList();
        return list.genres.find((g) => g.id === id) || null;
    }

    async getTVShowGenreName(id: number): Promise<Genre | null> {
        return this.getMoviesGenreName(id);
    }

    async getCountriesList(): Promise<TMDBCountries[]> {
        return [
            { iso_3166_1: 'US', english_name: 'United States of America', native_name: 'United States' },
            { iso_3166_1: 'GB', english_name: 'United Kingdom', native_name: 'United Kingdom' },
        ];
    }

    async getLanguagesList(): Promise<TMDBLanguages[]> {
        return [
            { iso_639_1: 'en', english_name: 'English', name: 'English' },
        ];
    }

    async searchPerson(options: { query: string; page?: number }): Promise<PaginatedResponse<TMDBPersonResult>> {
        return {
            page: options.page || 1,
            results: [],
            total_pages: 1,
            total_results: 0,
        };
    }

    async getPersonDetails(personId: number): Promise<TMDBPersonResult> {
        return {
            id: personId,
            name: `Person ${personId}`,
            profile_path: null,
            known_for: [],
            popularity: 0,
        };
    }
}

export default OMDBService;
