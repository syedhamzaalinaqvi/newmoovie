'use client';

import { SiteStats } from '@/lib/storage';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
    stats: SiteStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: 'Total Movies',
            value: stats.totalMovies,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                </svg>
            ),
            color: '#e50914',
        },
        {
            title: 'Total Series',
            value: stats.totalSeries,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
            ),
            color: '#f5c518',
        },
        {
            title: 'Total Views',
            value: stats.totalViews,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            color: '#46d369',
        },
        {
            title: 'Total Content',
            value: stats.totalMovies + stats.totalSeries,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
            color: '#9c27b0',
        },
    ];

    return (
        <div className={styles.grid}>
            {cards.map((card, index) => (
                <div key={index} className={styles.card} style={{ '--card-color': card.color } as any}>
                    <div className={styles.icon}>{card.icon}</div>
                    <div className={styles.info}>
                        <div className={styles.value}>{card.value.toLocaleString()}</div>
                        <div className={styles.title}>{card.title}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
