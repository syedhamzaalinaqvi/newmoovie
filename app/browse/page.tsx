'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { tmdb, Movie, Series, Genre } from '@/lib/tmdb';
import styles from './page.module.css';

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const [content, setContent] = useState<(Movie | Series)[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<'movie' | 'tv'>('movie');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const countries = [
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'IN', name: 'India' },
        { code: 'KR', name: 'South Korea' },
        { code: 'JP', name: 'Japan' },
        { code: 'FR', name: 'France' },
        { code: 'ES', name: 'Spain' },
        { code: 'DE', name: 'Germany' },
    ];

    // Initialize from URL params
    useEffect(() => {
        const type = searchParams.get('type') as 'movie' | 'tv';
        const search = searchParams.get('search');

        if (type && (type === 'movie' || type === 'tv')) {
            setSelectedType(type);
        }
        if (search) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genreList = selectedType === 'movie'
                    ? await tmdb.getMovieGenres()
                    : await tmdb.getTVGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, [selectedType]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                let results;

                if (searchQuery) {
                    const searchResults = selectedType === 'movie'
                        ? await tmdb.searchMovies(searchQuery)
                        : await tmdb.searchSeries(searchQuery);
                    results = searchResults.results;
                } else {
                    const params: any = {
                        page: 1,
                        sort_by: 'popularity.desc',
                    };

                    if (selectedGenre) params.with_genres = selectedGenre;
                    if (selectedCountry) params.with_origin_country = selectedCountry;

                    const data = selectedType === 'movie'
                        ? await tmdb.discoverMovies(params)
                        : await tmdb.discoverSeries(params);
                    results = data.results;
                }

                setContent(results);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [selectedType, selectedGenre, selectedCountry, searchQuery]);

    return (
        <div className={styles.page}>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Content'}
                    </h1>
                </div>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as 'movie' | 'tv')}
                            className={styles.select}
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">TV Series</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Genre</label>
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Country</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Countries</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                window.history.pushState({}, '', '/browse');
                            }}
                            className={styles.clearBtn}
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading content...</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {content.map((item) => (
                            <MovieCard key={item.id} item={item} type={selectedType} />
                        ))}
                    </div>
                )}

                {!loading && content.length === 0 && (
                    <div className={styles.empty}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <h3>No content found</h3>
                        <p>Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
