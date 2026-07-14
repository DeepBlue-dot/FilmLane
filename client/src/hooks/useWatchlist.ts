import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

export interface WatchlistItem {
  id: string;
  tmdbId: number;
  mediaType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE';
  addedAt: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/users/me/watchlist-Items');
      if (response.data?.status === 'success') {
        setWatchlist(response.data.data);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const toggleWatchlist = async (tmdbId: number, mediaType: 'movie' | 'tv'): Promise<boolean> => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    const formattedType = mediaType === 'movie' ? 'MOVIE' : 'SERIES';
    const existing = watchlist.find(
      (item) => item.tmdbId === tmdbId && item.mediaType === formattedType
    );

    try {
      if (existing) {
        // Remove from watchlist
        await api.delete(`/users/me/watchlist-Items/${existing.id}`);
        setWatchlist((prev) => prev.filter((item) => item.id !== existing.id));
        return false;
      } else {
        // Add to watchlist
        const response = await api.post('/users/me/watchlist-Items', {
          tmdbId: tmdbId.toString(),
          mediaType: formattedType,
        });
        if (response.data?.status === 'success') {
          const newItem = response.data.data.newItem;
          setWatchlist((prev) => [...prev, newItem]);
          return true;
        }
      }
    } catch (err) {
      console.error('Watchlist toggle failed', err);
    }
    return false;
  };

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return {
    watchlist,
    watchlistIds: watchlist.map((item) => item.tmdbId),
    watchlistLoading: loading,
    watchlistError: error,
    toggleWatchlist,
    refetchWatchlist: fetchWatchlist,
  };
};
