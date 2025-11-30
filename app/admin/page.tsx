'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/admin/LoginForm';
import StatsCards from '@/components/admin/StatsCards';
import { storage, SavedContent } from '@/lib/storage';
import styles from './page.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(storage.getStats());
    const [content, setContent] = useState<SavedContent[]>([]);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = storage.isAuthenticated();
            setIsAuthenticated(authenticated);
            setLoading(false);

            if (authenticated) {
                loadData();
            }
        };

        checkAuth();
    }, []);

    const loadData = () => {
        setStats(storage.getStats());
        setContent(storage.getAllContent());
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        loadData();
    };

    const handleLogout = () => {
        storage.logout();
        setIsAuthenticated(false);
    };

    const handleDelete = (id: number, type: 'movie' | 'series') => {
        if (confirm('Are you sure you want to delete this content?')) {
            storage.removeContent(id, type);
            loadData();
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
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.logo}>
                            <span className={styles.logoText}>Stream</span>
                            <span className={styles.logoAccent}>Flix</span>
                            <span className={styles.adminBadge}>Admin</span>
                        </h1>
                        <p className={styles.subtitle}>Content Management Dashboard</p>
                    </div>
                    <div className={styles.headerActions}>
                        <Link href="/" className={styles.homeBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Home
                        </Link>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                <StatsCards stats={stats} />

                <div className={styles.actions}>
                    <Link href="/admin/add" className={styles.addBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add New Content
                    </Link>
                </div>

                <div className={styles.contentSection}>
                    <h2 className={styles.sectionTitle}>Managed Content</h2>

                    {content.length === 0 ? (
                        <div className={styles.empty}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                                <polyline points="17 2 12 7 7 2" />
                            </svg>
                            <h3>No content added yet</h3>
                            <p>Start by adding movies or series from TMDB</p>
                            <Link href="/admin/add" className={styles.emptyBtn}>
                                Add Content
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.contentGrid}>
                            {content.map((item) => {
                                const title = item.type === 'movie'
                                    ? (item.data as any).title
                                    : (item.data as any).name;
                                const posterPath = item.data.poster_path;
                                const posterUrl = posterPath
                                    ? `https://image.tmdb.org/t/p/w200${posterPath}`
                                    : '/placeholder.jpg';

                                return (
                                    <div key={`${item.type}-${item.id}`} className={styles.contentCard}>
                                        <img src={posterUrl} alt={title} className={styles.contentPoster} />
                                        <div className={styles.contentInfo}>
                                            <h3 className={styles.contentTitle}>{title}</h3>
                                            <div className={styles.contentMeta}>
                                                <span className={styles.contentType}>
                                                    {item.type === 'movie' ? 'Movie' : 'Series'}
                                                </span>
                                                <span className={styles.contentRating}>
                                                    ⭐ {item.data.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className={styles.contentActions}>
                                                <a
                                                    href={`/${item.type}/${item.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.viewBtn}
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.type)}
                                                    className={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
