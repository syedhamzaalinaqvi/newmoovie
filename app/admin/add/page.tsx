'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tmdb, Movie, Series, MovieDetails, SeriesDetails, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import { storage } from '@/lib/storage';
import styles from './page.module.css';

export default function AddContentPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');
    const [searchResults, setSearchResults] = useState<(Movie | Series)[]>([]);
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState<number | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = storage.isAuthenticated();
            setIsAuthenticated(authenticated);
            setLoading(false);

            if (!authenticated) {
                router.push('/admin');
            }
        };

        checkAuth();
    }, [router]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const results = searchType === 'movie'
                ? await tmdb.searchMovies(searchQuery)
                : await tmdb.searchSeries(searchQuery);
            setSearchResults(results.results || []);
        } catch (error) {
            console.error('Error searching:', error);
            alert('Error searching TMDB. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const handleAdd = async (id: number) => {
        setAdding(id);
        try {
            let details: MovieDetails | SeriesDetails;

            if (searchType === 'movie') {
                details = await tmdb.getMovieDetails(id);
            } else {
                details = await tmdb.getSeriesDetails(id);
            }

            const success = storage.addContent(details, searchType);

            if (success) {
                alert(`Successfully added ${searchType === 'movie' ? 'movie' : 'series'}!`);
            } else {
                alert('This content has already been added.');
            }
        } catch (error) {
            console.error('Error adding content:', error);
            alert('Error adding content. Please try again.');
        } finally {
            setAdding(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>Add Content from TMDB</h1>
                        <p className={styles.subtitle}>Search and add movies or TV series automatically</p>
                    </div>
                    <Link href="/admin" className={styles.backBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputs}>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value as 'movie' | 'tv')}
                                className={styles.typeSelect}
                            >
                                <option value="movie">Movies</option>
                                <option value="tv">TV Series</option>
                            </select>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search for ${searchType === 'movie' ? 'movies' : 'TV series'}...`}
                                className={styles.searchInput}
                            />

                            <button type="submit" className={styles.searchBtn} disabled={searching}>
                                {searching ? (
                                    <>
                                        <div className={styles.btnSpinner}></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.35-4.35" />
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {searchResults.length > 0 && (
                    <div className={styles.results}>
                        <h2 className={styles.resultsTitle}>
                            Search Results ({searchResults.length})
                        </h2>
                        <div className={styles.resultsGrid}>
                            {searchResults.map((item) => {
                                const title = 'title' in item ? item.title : item.name;
                                const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
                                const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
                                const posterUrl = item.poster_path
                                    ? `${TMDB_IMAGE_BASE}/w300${item.poster_path}`
                                    : '/placeholder.jpg';

                                return (
                                    <div key={item.id} className={styles.resultCard}>
                                        <img src={posterUrl} alt={title} className={styles.resultPoster} />
                                        <div className={styles.resultInfo}>
                                            <h3 className={styles.resultTitle}>{title}</h3>
                                            <div className={styles.resultMeta}>
                                                <span>{year}</span>
                                                <span className={styles.resultRating}>
                                                    ⭐ {item.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                            <p className={styles.resultOverview}>
                                                {item.overview.length > 150
                                                    ? `${item.overview.substring(0, 150)}...`
                                                    : item.overview}
                                            </p>
                                            <button
                                                onClick={() => handleAdd(item.id)}
                                                className={styles.addBtn}
                                                disabled={adding === item.id}
                                            >
                                                {adding === item.id ? (
                                                    <>
                                                        <div className={styles.btnSpinner}></div>
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="12" y1="5" x2="12" y2="19" />
                                                            <line x1="5" y1="12" x2="19" y2="12" />
                                                        </svg>
                                                        Add to Site
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!searching && searchQuery && searchResults.length === 0 && (
                    <div className={styles.empty}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <h3>No results found</h3>
                        <p>Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    );
}
