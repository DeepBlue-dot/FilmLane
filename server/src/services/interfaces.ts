export interface TMDBMovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date: string;
    runtime: number;
    genres: Genre[];
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
    credits?: TMDBMovieCredits;
    external_ids?: TMDBExternalIDs;
    keywords?: TMDBKeywords;
    recommendations?: PaginatedResponse<TMDBMovieResult>;
    release_dates?: TMDBReleaseDate;
    similar?: PaginatedResponse<TMDBMovieResult>;
    videos?: TMDBVideos;
}

export interface TMDBKeywords {
    id?: number;
    keyword: { id: number; name: string }[]
}


export interface TMDBExternalIDs {
    id?: number;
    imdb_id: string;
    wikidata_id: string;
    facebook_id: string;
    instagram_id: string;
    twitter_id: string;
}

export interface TMDBMovieCredits {
    id?: number; // Defaults to 0
    cast: CastMember[];
    crew: CrewMember[];
}

export interface TMDBMovieResult {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}


export interface TMDBMovieCredits {
    id?: number; // Defaults to 0
    cast: CastMember[];
    crew: CrewMember[];
}

export interface CastMember {
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
    cast_id: number; // Defaults to 0
    character: string;
    credit_id: string;
    order: number; // Defaults to 0
}

export interface CrewMember {
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
}

export interface TMDBMedia {
    backdrops: ImageItem[];
    id: number; // Defaults to 0
    logos: ImageItem[];
    posters: ImageItem[];
}

interface ImageItem {
    aspect_ratio: number; // Defaults to 0
    height: number;       // Defaults to 0
    iso_639_1: string;
    file_path: string;
    vote_average: number; // Defaults to 0
    vote_count: number;   // Defaults to 0
    width: number;        // Defaults to 0
}


export interface TMDBVideos {
    id?: number;
    results: {
        id: string;
        iso_639_1: string;
        iso_3166_1: string;
        name: string;
        site: string;
        size: number;
        type: string;
        official: boolean;
        published_at: string;
    }[];
}

export interface TMDBTVShowDetails {
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

export interface TMDBReleaseDate {
    id?: number; // Defaults to 0
    results: CountryReleaseDates[];
}

interface CountryReleaseDates {
    iso_3166_1: string;
    release_dates: ReleaseDate[];
}

interface ReleaseDate {
    certification: string;
    descriptors: any[]; // Assuming an array of unspecified items (e.g., strings or objects)
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
}


export interface Genre {
    id: number;
    name: string
}

export type PaginatedResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

export interface DiscoverMoviesParams {
    certification?: string;
    certificationGte?: string;
    certificationLte?: string;
    certificationCountry?: string;
    includeAdult?: boolean;
    includeVideo?: boolean;
    language?: string;
    page?: number;
    primaryReleaseYear?: number;
    primaryReleaseDateGte?: string;
    primaryReleaseDateLte?: string;
    region?: string;
    releaseDateGte?: string;
    releaseDateLte?: string;
    sortBy?: string;
    voteAverageGte?: number;
    voteAverageLte?: number;
    voteCountGte?: number;
    voteCountLte?: number;
    watchRegion?: string;
    withCast?: string;
    withCompanies?: string;
    withCrew?: string;
    withGenres?: string;
    withKeywords?: string;
    withOriginCountry?: string;
    withOriginalLanguage?: string;
    withPeople?: string;
    withReleaseType?: number;
    withRuntimeGte?: number;
    withRuntimeLte?: number;
    withWatchMonetizationTypes?: string;
    withWatchProviders?: string;
    withoutCompanies?: string;
    withoutGenres?: string;
    withoutKeywords?: string;
    withoutWatchProviders?: string;
    year?: number;
}

export const paramMappings: Record<string, string> = {
    certificationGte: 'certification.gte',
    certificationLte: 'certification.lte',
    certificationCountry: 'certification_country',
    includeAdult: 'include_adult',
    includeVideo: 'include_video',
    primaryReleaseYear: 'primary_release_year',
    primaryReleaseDateGte: 'primary_release_date.gte',
    primaryReleaseDateLte: 'primary_release_date.lte',
    releaseDateGte: 'release_date.gte',
    releaseDateLte: 'release_date.lte',
    sortBy: 'sort_by',
    voteAverageGte: 'vote_average.gte',
    voteAverageLte: 'vote_average.lte',
    voteCountGte: 'vote_count.gte',
    voteCountLte: 'vote_count.lte',
    watchRegion: 'watch_region',
    withCast: 'with_cast',
    withCompanies: 'with_companies',
    withCrew: 'with_crew',
    withGenres: 'with_genres',
    withKeywords: 'with_keywords',
    withOriginCountry: 'with_origin_country',
    withOriginalLanguage: 'with_original_language',
    withPeople: 'with_people',
    withReleaseType: 'with_release_type',
    withRuntimeGte: 'with_runtime.gte',
    withRuntimeLte: 'with_runtime.lte',
    withWatchMonetizationTypes: 'with_watch_monetization_types',
    withWatchProviders: 'with_watch_providers',
    withoutCompanies: 'without_companies',
    withoutGenres: 'without_genres',
    withoutKeywords: 'without_keywords',
    withoutWatchProviders: 'without_watch_providers',
};


