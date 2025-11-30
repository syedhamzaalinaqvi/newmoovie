'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>Stream</span>
                        <span className={styles.logoAccent}>Flix</span>
                    </Link>

                    <div className={styles.navLinks}>
                        <Link href="/" className={styles.navLink}>Home</Link>
                        <Link href="/browse?type=movie" className={styles.navLink}>Movies</Link>
                        <Link href="/browse?type=tv" className={styles.navLink}>TV Series</Link>
                        <Link href="/browse" className={styles.navLink}>Browse</Link>
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ''}`}>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search movies, series..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchOpen(true)}
                                onBlur={() => !searchQuery && setSearchOpen(false)}
                                className={styles.searchInput}
                            />
                        </form>
                        <svg
                            className={styles.searchIcon}
                            onClick={() => setSearchOpen(!searchOpen)}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    <Link href="/admin" className={styles.adminLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 5a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 13a8 8 0 0 1-6.66-3.58c.05-2 4-3.1 6.66-3.1s6.61 1.1 6.66 3.1A8 8 0 0 1 12 20z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
