import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    original_language: string;
    popularity: number;
}

export interface Series {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    first_air_date: string;
    vote_average: number;
    genre_ids: number[];
    original_language: string;
    popularity: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: Genre[];
    production_countries: { iso_3166_1: string; name: string }[];
    credits?: {
        cast: Array<{ id: number; name: string; character: string; profile_path: string }>;
    };
    videos?: {
        results: Array<{ key: string; type: string; site: string }>;
    };
    similar?: {
        results: Movie[];
    };
}

export interface SeriesDetails extends Series {
    number_of_seasons: number;
    number_of_episodes: number;
    genres: Genre[];
    production_countries: { iso_3166_1: string; name: string }[];
    credits?: {
        cast: Array<{ id: number; name: string; character: string; profile_path: string }>;
    };
    videos?: {
        results: Array<{ key: string; type: string; site: string }>;
    };
    similar?: {
        results: Series[];
    };
}

const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

export const tmdb = {
    // Get trending content
    getTrending: async (mediaType: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'week') => {
        const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
        return response.data.results;
    },

    // Get popular movies
    getPopularMovies: async (page = 1) => {
        const response = await tmdbApi.get('/movie/popular', { params: { page } });
        return response.data.results;
    },

    // Get popular TV series
    getPopularSeries: async (page = 1) => {
        const response = await tmdbApi.get('/tv/popular', { params: { page } });
        return response.data.results;
    },

    // Get top rated movies
    getTopRatedMovies: async (page = 1) => {
        const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
        return response.data.results;
    },

    // Get top rated TV series
    getTopRatedSeries: async (page = 1) => {
        const response = await tmdbApi.get('/tv/top_rated', { params: { page } });
        return response.data.results;
    },

    // Get movie genres
    getMovieGenres: async (): Promise<Genre[]> => {
        const response = await tmdbApi.get('/genre/movie/list');
        return response.data.genres;
    },

    // Get TV genres
    getTVGenres: async (): Promise<Genre[]> => {
        const response = await tmdbApi.get('/genre/tv/list');
        return response.data.genres;
    },

    // Discover movies with filters
    discoverMovies: async (params: {
        page?: number;
        with_genres?: string;
        with_origin_country?: string;
        sort_by?: string;
    }) => {
        const response = await tmdbApi.get('/discover/movie', { params });
        return response.data;
    },

    // Discover TV series with filters
    discoverSeries: async (params: {
        page?: number;
        with_genres?: string;
        with_origin_country?: string;
        sort_by?: string;
    }) => {
        const response = await tmdbApi.get('/discover/tv', { params });
        return response.data;
    },

    // Get movie details
    getMovieDetails: async (id: number): Promise<MovieDetails> => {
        const response = await tmdbApi.get(`/movie/${id}`, {
            params: {
                append_to_response: 'credits,videos,similar',
            },
        });
        return response.data;
    },

    // Get TV series details
    getSeriesDetails: async (id: number): Promise<SeriesDetails> => {
        const response = await tmdbApi.get(`/tv/${id}`, {
            params: {
                append_to_response: 'credits,videos,similar',
            },
        });
        return response.data;
    },

    // Search movies
    searchMovies: async (query: string, page = 1) => {
        const response = await tmdbApi.get('/search/movie', {
            params: { query, page },
        });
        return response.data;
    },

    // Search TV series
    searchSeries: async (query: string, page = 1) => {
        const response = await tmdbApi.get('/search/tv', {
            params: { query, page },
        });
        return response.data;
    },

    // Search multi (movies and TV)
    searchMulti: async (query: string, page = 1) => {
        const response = await tmdbApi.get('/search/multi', {
            params: { query, page },
        });
        return response.data;
    },

    // Get image URL
    getImageUrl: (path: string, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
        if (!path) return '/placeholder.jpg';
        return `${TMDB_IMAGE_BASE}/${size}${path}`;
    },
};
