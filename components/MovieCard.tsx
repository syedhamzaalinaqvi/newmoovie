'use client';

import { Movie, Series, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import styles from './MovieCard.module.css';

interface MovieCardProps {
    item: Movie | Series;
    type: 'movie' | 'tv';
}

export default function MovieCard({ item, type }: MovieCardProps) {
    const title = 'title' in item ? item.title : item.name;
    const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const posterUrl = item.poster_path
        ? `${TMDB_IMAGE_BASE}/w500${item.poster_path}`
        : '/placeholder.jpg';

    const detailUrl = type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

    return (
        <a href={detailUrl} className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={posterUrl} alt={title} className={styles.poster} />
                <div className={styles.overlay}>
                    <div className={styles.playButton}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className={styles.info}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.meta}>
                    <span className={styles.year}>{year}</span>
                    <span className={styles.rating}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {item.vote_average.toFixed(1)}
                    </span>
                </div>
            </div>
        </a>
    );
}
