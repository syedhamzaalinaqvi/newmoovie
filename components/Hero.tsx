'use client';

import { useEffect, useState } from 'react';
import { tmdb, Movie, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import styles from './Hero.module.css';

export default function Hero() {
    const [featured, setFeatured] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const trending = await tmdb.getTrending('movie', 'week');
                if (trending && trending.length > 0) {
                    setFeatured(trending[0]);
                }
            } catch (error) {
                console.error('Error fetching featured content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading || !featured) {
        return (
            <div className={styles.hero}>
                <div className={styles.skeleton}></div>
            </div>
        );
    }

    const backgroundImage = featured.backdrop_path
        ? `${TMDB_IMAGE_BASE}/original${featured.backdrop_path}`
        : '';

    return (
        <div className={styles.hero}>
            <div
                className={styles.background}
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className={styles.overlay} />

            <div className={styles.content}>
                <h1 className={styles.title}>{featured.title}</h1>

                <div className={styles.meta}>
                    <span className={styles.rating}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {featured.vote_average.toFixed(1)}
                    </span>
                    <span className={styles.year}>
                        {featured.release_date ? new Date(featured.release_date).getFullYear() : 'N/A'}
                    </span>
                    <span className={styles.language}>{featured.original_language.toUpperCase()}</span>
                </div>

                <p className={styles.overview}>
                    {featured.overview.length > 200
                        ? `${featured.overview.substring(0, 200)}...`
                        : featured.overview}
                </p>

                <div className={styles.actions}>
                    <a href={`/movie/${featured.id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Now
                    </a>
                    <a href={`/movie/${featured.id}`} className={`${styles.btn} ${styles.btnSecondary}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        More Info
                    </a>
                </div>
            </div>
        </div>
    );
}
