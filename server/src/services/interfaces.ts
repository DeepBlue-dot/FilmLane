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
    media_type?: string
}

export interface TvSeasonDetails {
    _id: string;
    air_date: string;
    episodes: Episode[];
    crew: CrewMember[];
    guest_stars: GuestStar[];
}

export interface CrewMember {
    department: string;
    job: string;
    credit_id: string;
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
}

export interface GuestStar {
    character: string;
    credit_id: string;
    order: number; // Defaults to 0
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
}

export interface TMDBTVShowResult {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number; // Defaults to 0
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number; // Defaults to 0
    poster_path: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
}



export interface TMDBMovieCredits {
    id?: number; // Defaults to 0
    cast: MovieCastMember[];
    crew: MovieCrewMember[];
}

export interface MovieCastMember {
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

export interface MovieCrewMember {
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

export interface TMDBTvShowCredits {
    cast: TvShowCastMember[];
    crew: TvShowCrewMember[];
}

// Interface for cast members
export interface TvShowCastMember {
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
    roles: Role[];
}

// Interface for roles in the cast array
export interface Role {
    credit_id: string;
    character: string;
    episode_count: number; // Defaults to 0
    total_episode_count: number; // Defaults to 0
    order: number; // Defaults to 0
}

// Interface for crew members
export interface TvShowCrewMember {
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
    jobs: Job[];
}

// Interface for jobs in the crew array
export interface Job {
    credit_id: string;
    job: string;
    episode_count: number; // Defaults to 0
    department: string;
    total_episode_count: number; // Defaults to 0
    id: number; // Defaults to 0
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

// Main interface representing a TV show (or similar media)
export interface TMDBTVShowDetails {
    adult: boolean; // Defaults to true
    backdrop_path: string;
    created_by: CreatedBy[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number; // Defaults to 0
    in_production: boolean; // Defaults to true
    languages: string[];
    last_air_date: string;
    last_episode_to_air: Episode;
    next_episode_to_air: string;
    networks: Network[];
    number_of_episodes: number; // Defaults to 0
    number_of_seasons: number; // Defaults to 0
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number; // Defaults to 0
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons: Season[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    type: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
    aggregate_credits?: TMDBTvShowCredits;
}

// Sub-interface for a "created_by" object
export interface CreatedBy {
    id: number; // Defaults to 0
    credit_id: string;
    name: string;
    gender: number; // Defaults to 0
    profile_path: string;
}

// Sub-interface for an episode (e.g., last_episode_to_air)
export interface Episode {
    id: number; // Defaults to 0
    name: string;
    overview: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
    air_date: string;
    episode_number: number; // Defaults to 0
    production_code: string;
    runtime: number; // Defaults to 0
    season_number: number; // Defaults to 0
    show_id: number; // Defaults to 0
    still_path: string;
}

// Sub-interface for a network
export interface Network {
    id: number; // Defaults to 0
    logo_path: string;
    name: string;
    origin_country: string;
}

// Sub-interface for a production company
export interface ProductionCompany {
    id: number; // Defaults to 0
    logo_path: string;
    name: string;
    origin_country: string;
}

// Sub-interface for a production country
export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

// Sub-interface for a season
export interface Season {
    air_date: string;
    episode_count: number; // Defaults to 0
    id: number; // Defaults to 0
    name: string;
    overview: string;
    poster_path: string;
    season_number: number; // Defaults to 0
    vote_average: number; // Defaults to 0
}

// Sub-interface for a spoken language
export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface TvEpisodeDetails {
    air_date: string;
    crew: EpisodeCrewMember[];
    guest_stars: EpisodeGuestStar[];
    name: string;
    overview: string;
    id: number; // Defaults to 0
    production_code: string;
    runtime: number; // Defaults to 0
    season_number: number; // Defaults to 0
    still_path: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
}

export interface EpisodeCrewMember {
    department: string;
    job: string;
    credit_id: string;
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
    episode_number: number; // Defaults to 0
}

export interface EpisodeGuestStar {
    character: string;
    credit_id: string;
    order: number; // Defaults to 0
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
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

export interface DiscoverTvShowParams {
    air_date_gte?: string;
    air_date_lte?: string;
    first_air_date_year?: number;
    first_air_date_gte?: string;
    first_air_date_lte?: string;
    include_adult?: boolean;
    include_null_first_air_dates?: boolean;
    language?: string;
    page?: number;
    screened_theatrically?: boolean;
    sort_by?: string;
    timezone?: string;
    vote_average_gte?: number;
    vote_average_lte?: number;
    vote_count_gte?: number;
    vote_count_lte?: number;
    watch_region?: string;
    with_companies?: string;
    with_genres?: string;
    with_keywords?: string;
    with_networks?: string;
    with_origin_country?: string;
    with_original_language?: string;
    with_runtime_gte?: number;
    with_runtime_lte?: number;
    with_status?: string;
    with_watch_monetization_types?: string;
    with_watch_providers?: string;
    without_companies?: string;
    without_genres?: string;
    without_keywords?: string;
    without_watch_providers?: string;
    with_type?: string;
}

// Mapping from camelCase keys to API-specific parameter names
export const paramMappingsTv: Record<string, string> = {
    air_date_gte: 'air_date.gte',
    air_date_lte: 'air_date.lte',
    first_air_date_year: 'first_air_date_year',
    first_air_date_gte: 'first_air_date.gte',
    first_air_date_lte: 'first_air_date.lte',
    include_adult: 'include_adult',
    include_null_first_air_dates: 'include_null_first_air_dates',
    language: 'language',
    page: 'page',
    screened_theatrically: 'screened_theatrically',
    sort_by: 'sort_by',
    timezone: 'timezone',
    vote_average_gte: 'vote_average.gte',
    vote_average_lte: 'vote_average.lte',
    vote_count_gte: 'vote_count.gte',
    vote_count_lte: 'vote_count.lte',
    watch_region: 'watch_region',
    with_companies: 'with_companies',
    with_genres: 'with_genres',
    with_keywords: 'with_keywords',
    with_networks: 'with_networks',
    with_origin_country: 'with_origin_country',
    with_original_language: 'with_original_language',
    with_runtime_gte: 'with_runtime.gte',
    with_runtime_lte: 'with_runtime.lte',
    with_status: 'with_status',
    with_watch_monetization_types: 'with_watch_monetization_types',
    with_watch_providers: 'with_watch_providers',
    without_companies: 'without_companies',
    without_genres: 'without_genres',
    without_keywords: 'without_keywords',
    without_watch_providers: 'without_watch_providers',
    with_type: 'with_type',
};

