import { MovieDetails, SeriesDetails } from './tmdb';

export interface SavedContent {
    id: number;
    type: 'movie' | 'series';
    data: MovieDetails | SeriesDetails;
    addedAt: string;
}

export interface SiteStats {
    totalMovies: number;
    totalSeries: number;
    totalViews: number;
    lastUpdated: string;
}

const STORAGE_KEYS = {
    CONTENT: 'streaming_site_content',
    STATS: 'streaming_site_stats',
    AUTH: 'streaming_site_auth',
};

// Content Management
export const storage = {
    // Get all saved content
    getAllContent: (): SavedContent[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.CONTENT);
        return data ? JSON.parse(data) : [];
    },

    // Add content
    addContent: (content: MovieDetails | SeriesDetails, type: 'movie' | 'series') => {
        const allContent = storage.getAllContent();
        const exists = allContent.find(item => item.id === content.id && item.type === type);

        if (!exists) {
            const newContent: SavedContent = {
                id: content.id,
                type,
                data: content,
                addedAt: new Date().toISOString(),
            };
            allContent.push(newContent);
            localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(allContent));
            storage.updateStats();
            return true;
        }
        return false;
    },

    // Remove content
    removeContent: (id: number, type: 'movie' | 'series') => {
        const allContent = storage.getAllContent();
        const filtered = allContent.filter(item => !(item.id === id && item.type === type));
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(filtered));
        storage.updateStats();
    },

    // Get content by type
    getContentByType: (type: 'movie' | 'series'): SavedContent[] => {
        return storage.getAllContent().filter(item => item.type === type);
    },

    // Get single content
    getContent: (id: number, type: 'movie' | 'series'): SavedContent | undefined => {
        return storage.getAllContent().find(item => item.id === id && item.type === type);
    },

    // Stats Management
    getStats: (): SiteStats => {
        if (typeof window === 'undefined') {
            return {
                totalMovies: 0,
                totalSeries: 0,
                totalViews: 0,
                lastUpdated: new Date().toISOString(),
            };
        }
        const data = localStorage.getItem(STORAGE_KEYS.STATS);
        if (data) {
            return JSON.parse(data);
        }
        return {
            totalMovies: 0,
            totalSeries: 0,
            totalViews: 0,
            lastUpdated: new Date().toISOString(),
        };
    },

    updateStats: () => {
        const allContent = storage.getAllContent();
        const stats: SiteStats = {
            totalMovies: allContent.filter(item => item.type === 'movie').length,
            totalSeries: allContent.filter(item => item.type === 'series').length,
            totalViews: storage.getStats().totalViews,
            lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    },

    incrementViews: () => {
        const stats = storage.getStats();
        stats.totalViews += 1;
        stats.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    },

    // Auth Management
    setAuth: (isAuthenticated: boolean) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isAuthenticated, timestamp: Date.now() }));
    },

    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        const data = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (!data) return false;
        const auth = JSON.parse(data);
        // Session expires after 24 hours
        const isExpired = Date.now() - auth.timestamp > 24 * 60 * 60 * 1000;
        return auth.isAuthenticated && !isExpired;
    },

    logout: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.AUTH);
    },
};
