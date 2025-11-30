'use client';

import { Movie, Series } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import styles from './ContentRow.module.css';

interface ContentRowProps {
    title: string;
    items: (Movie | Series)[];
    type: 'movie' | 'tv';
}

export default function ContentRow({ title, items, type }: ContentRowProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={styles.row}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.scrollContainer}>
                <div className={styles.itemsContainer}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <MovieCard item={item} type={type} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
