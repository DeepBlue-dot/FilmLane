export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
  media_type?: string;
  imdb_id?: string;
}

export interface VideoResult {
  id: string;
  key: string;
  site: string;
  type: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface MediaDetails extends MediaItem {
  genres: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string | null;
  seasons?: Season[];
  videos?: {
    results: VideoResult[];
  };
  credits?: {
    cast: any[];
    crew: any[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  budget?: number;
  revenue?: number;
  spoken_languages?: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status?: string;
  networks?: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  episode_run_time?: number[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path?: string | null;
  air_date?: string;
  episode_number: number;
  season_number: number;
  vote_average?: number;
}

