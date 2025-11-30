'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import { tmdb, Movie, Series } from '@/lib/tmdb';
import styles from './page.module.css';

export default function Home() {
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [trendingSeries, setTrendingSeries] = useState<Series[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [trending, series, popular, topRated] = await Promise.all([
                    tmdb.getTrending('movie', 'week'),
                    tmdb.getTrending('tv', 'week'),
                    tmdb.getPopularMovies(),
                    tmdb.getTopRatedMovies(),
                ]);

                setTrendingMovies(trending);
                setTrendingSeries(series);
                setPopularMovies(popular);
                setTopRatedMovies(topRated);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className={styles.page}>
            <Navbar />
            <Hero />

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading amazing content...</p>
                    </div>
                ) : (
                    <>
                        <ContentRow title="Trending Movies" items={trendingMovies} type="movie" />
                        <ContentRow title="Trending TV Series" items={trendingSeries} type="tv" />
                        <ContentRow title="Popular Movies" items={popularMovies} type="movie" />
                        <ContentRow title="Top Rated" items={topRatedMovies} type="movie" />
                    </>
                )}
            </div>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>
                        <span className={styles.logoText}>Stream</span>
                        <span className={styles.logoAccent}>Flix</span>
                    </div>
                    <p className={styles.footerText}>
                        Your premium destination for movies and TV series
                    </p>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} StreamFlix. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
