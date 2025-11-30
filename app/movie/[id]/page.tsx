'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import { tmdb, MovieDetails, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import { storage } from '@/lib/storage';
import styles from './page.module.css';

export default function MovieDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await tmdb.getMovieDetails(id);
                setMovie(data);
                storage.incrementViews();
            } catch (error) {
                console.error('Error fetching movie:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.error}>
                    <h2>Movie not found</h2>
                </div>
            </div>
        );
    }

    const backdropUrl = movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}`
        : '';
    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`
        : '';
    const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    return (
        <div className={styles.page}>
            <Navbar />

            <div className={styles.hero} style={{ backgroundImage: `url(${backdropUrl})` }}>
                <div className={styles.overlay} />
            </div>

            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.poster}>
                        <img src={posterUrl} alt={movie.title} />
                    </div>

                    <div className={styles.info}>
                        <h1 className={styles.title}>{movie.title}</h1>

                        <div className={styles.meta}>
                            <span className={styles.rating}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                {movie.vote_average.toFixed(1)} / 10
                            </span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>{movie.runtime} min</span>
                            <span>{movie.original_language.toUpperCase()}</span>
                        </div>

                        <div className={styles.genres}>
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className={styles.genre}>
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className={styles.overview}>{movie.overview}</p>

                        {movie.production_countries && movie.production_countries.length > 0 && (
                            <div className={styles.countries}>
                                <strong>Countries:</strong>{' '}
                                {movie.production_countries.map(c => c.name).join(', ')}
                            </div>
                        )}

                        {trailer && (
                            <a
                                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.trailerBtn}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Trailer
                            </a>
                        )}
                    </div>
                </div>

                {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
                    <div className={styles.cast}>
                        <h2>Cast</h2>
                        <div className={styles.castGrid}>
                            {movie.credits.cast.slice(0, 10).map((actor) => (
                                <div key={actor.id} className={styles.castCard}>
                                    <div className={styles.castImage}>
                                        {actor.profile_path ? (
                                            <img
                                                src={`${TMDB_IMAGE_BASE}/w200${actor.profile_path}`}
                                                alt={actor.name}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.castInfo}>
                                        <div className={styles.castName}>{actor.name}</div>
                                        <div className={styles.castCharacter}>{actor.character}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {movie.similar && movie.similar.results && movie.similar.results.length > 0 && (
                    <div className={styles.similar}>
                        <ContentRow title="Similar Movies" items={movie.similar.results} type="movie" />
                    </div>
                )}
            </div>
        </div>
    );
}
