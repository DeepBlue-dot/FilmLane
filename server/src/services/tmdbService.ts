// tmdb.service.ts
import axios, { AxiosInstance } from 'axios';

// Type Definitions
interface TMDBMovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date: string;
    runtime: number;
    genres: { id: number; name: string }[];
    adult: boolean;
    belongs_to_collection?: {
        id: number;
        name: string;
        poster_path?: string;
        backdrop_path?: string;
    };
    budget: number;
    homepage?: string;
    imdb_id?: string;
    original_language: string;
    original_title: string;
    popularity: number;
    production_companies: {
        id: number;
        name: string;
        logo_path?: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    revenue: number;
    spoken_languages: {
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline?: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface TMDBMovieCredits {
    id: number;
    cast: {
        id: number;
        name: string;
        character: string;
        profile_path?: string;
    }[];
    crew: {
        id: number;
        name: string;
        job: string;
        department: string;
    }[];
}

interface TMDBRecommendations {
    page: number;
    results: TMDBMovieDetails[];
    total_pages: number;
    total_results: number;
}

interface TMDBMedia {
    backdrops: {
        file_path: string;
        width: number;
        height: number;
    }[];
    posters: {
        file_path: string;
        width: number;
        height: number;
    }[];
}

interface TMDBVideos {
    id: number;
    results: {
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
    }[];
}

interface TMDBTVShowDetails {
    id: number;
    name: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
    first_air_date: string;
    last_air_date: string;
    number_of_episodes: number;
    number_of_seasons: number;
    genres: { id: number; name: string }[];
}

type PaginatedResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

class TMDBService {
    private apiKey: string;
    private baseUrl: string;
    private language: string;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.apiKey = process.env.TMDB_API_KEY || '';
        this.baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
        this.language = process.env.TMDB_DEFAULT_LANGUAGE || 'en-US';

        if (!this.apiKey) {
            throw new Error('TMDB_API_KEY environment variable is required');
        }

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            params: {
                api_key: this.apiKey,
                language: this.language,
            },
        });
    }

    // Movie Endpoints

    async getMovieDetails(movieId: number, options?: { appendToResponse?: string }): Promise<TMDBMovieDetails> {
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

    async getMovieRecommendations(movieId: number, page = 1): Promise<PaginatedResponse<TMDBMovieDetails>> {
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

    // TV Show Endpoints

    async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
        try {
            const response = await this.axiosInstance.get(`/tv/${tvId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async searchTVShows(query: string, page = 1): Promise<PaginatedResponse<TMDBTVShowDetails>> {
        if (!query) throw new Error('Search query is required');

        try {
            const response = await this.axiosInstance.get('/search/tv', {
                params: { query, page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getPopularTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowDetails>> {
        try {
            const response = await this.axiosInstance.get('/tv/popular', {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTopRatedTVShows(page = 1): Promise<PaginatedResponse<TMDBTVShowDetails>> {
        try {
            const response = await this.axiosInstance.get('/tv/top_rated', {
                params: { page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Shared Methods

    async searchMovies(query: string, page = 1): Promise<PaginatedResponse<TMDBMovieDetails>> {
        if (!query) throw new Error('Search query is required');

        try {
            const response = await this.axiosInstance.get('/search/movie', {
                params: { query, page },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getGenres(): Promise<{ genres: { id: number; name: string }[] }> {
        try {
            const response = await this.axiosInstance.get('/genre/movie/list');
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