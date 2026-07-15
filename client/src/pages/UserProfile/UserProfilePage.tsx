import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useWatchlist, WatchlistItem } from '../../hooks/useWatchlist.js';
import { MediaCard } from '../../components/features/MediaCard.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiUser3Line, RiHeartLine, RiHistoryLine, RiSettings4Line, RiLockPasswordLine, RiDeleteBin5Line, RiTimeLine } from 'react-icons/ri';

interface WatchlistDetailedItem extends WatchlistItem {
  media: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
  };
}

interface HistoryItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE';
  season?: number | null;
  episode?: number | null;
  watchedAt: string;
  media: {
    id?: number;
    title?: string;
    name?: string;
    vote_average?: number;
    backdrop_path?: string | null;
  };
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, checkAuthStatus, logout } = useAuth();
  const { watchlist, watchlistIds, toggleWatchlist } = useWatchlist();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  // Profile forms state
  const [username, setUsername] = useState(user?.username || '');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Watchlist detailed items state
  const [watchlistItems, setWatchlistItems] = useState<WatchlistDetailedItem[]>([]);
  const [watchlistItemsLoading, setWatchlistItemsLoading] = useState(false);

  // History state
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Sync username on user mount
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // 1. Fetch detailed TMDB media for each watchlist ID
  const fetchWatchlistDetails = useCallback(async () => {
    if (watchlist.length === 0) {
      setWatchlistItems([]);
      return;
    }
    setWatchlistItemsLoading(true);
    try {
      const detailed = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const isMovie = item.mediaType === 'MOVIE';
            const endpoint = isMovie ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
            const res = await api.get(endpoint);
            const media = res.data?.movie || res.data;
            return {
              ...item,
              media,
            } as WatchlistDetailedItem;
          } catch (err) {
            console.error('Failed to load watchlist details for ID: ' + item.tmdbId, err);
            return null;
          }
        })
      );
      setWatchlistItems(detailed.filter((item): item is WatchlistDetailedItem => item !== null));
    } catch (err) {
      console.error(err);
    } finally {
      setWatchlistItemsLoading(false);
    }
  }, [watchlist]);

  useEffect(() => {
    if (activeTab === 'watchlist') {
      fetchWatchlistDetails();
    }
  }, [activeTab, fetchWatchlistDetails]);

  // 2. Fetch and resolve watch history
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await api.get('/users/me/watch-history');
      const items = response.data?.data || [];
      
      // Resolve TMDB details for each history record
      const resolved = await Promise.all(
        items.map(async (item: Omit<HistoryItem, 'media'>) => {
          const isMovie = item.mediaType === 'MOVIE';
          try {
            const endpoint = isMovie ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
            const res = await api.get(endpoint);
            const media = res.data?.movie || res.data;
            return {
              ...item,
              media,
            } as HistoryItem;
          } catch (err) {
            console.error('Failed to load history details for ID: ' + item.tmdbId, err);
            return {
              ...item,
              media: {
                title: isMovie ? 'Unknown Movie' : 'Unknown TV Show',
                name: isMovie ? 'Unknown Movie' : 'Unknown TV Show',
                vote_average: 0,
              },
            } as HistoryItem;
          }
        })
      );
      setHistoryList(resolved);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, fetchHistory]);

  // 3. Handlers
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === user?.username) return;

    setUsernameLoading(true);
    setUsernameMsg(null);
    try {
      await api.put('/users/me', { username: username.trim() });
      setUsernameMsg({ type: 'success', text: 'Username updated successfully!' });
      await checkAuthStatus();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setUsernameMsg({
        type: 'error',
        text: axiosError.response?.data?.message || 'Failed to update username.',
      });
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !password || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (password.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await api.put('/users/me', {
        oldPassword,
        password,
        confirmPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setPasswordMsg({
        type: 'error',
        text: axiosError.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (itemId: string) => {
    try {
      await api.delete(`/users/me/watch-history/${itemId}`);
      setHistoryList((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete history item', err);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire watch history?')) return;
    try {
      await api.delete('/users/me/watch-history');
      setHistoryList([]);
    } catch (err) {
      console.error('Failed to clear watch history', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete your FilmLane account? This cannot be undone.")) return;
    try {
      await api.delete('/users/me');
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Account deletion failed", err);
    }
  };

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    const isAdded = await toggleWatchlist(id, type);
    if (!isAdded) {
      setWatchlistItems((prev) => prev.filter((item) => item.tmdbId !== id));
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Sidebar Profile Summary & Tabs */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="bg-gray-900/40 border border-gray-850 p-6 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="w-20 h-20 bg-indigo-600/20 border-2 border-indigo-500 rounded-full flex items-center justify-center text-indigo-400 font-extrabold text-3xl mx-auto shadow-inner">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white truncate">{user?.username}</h2>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="border-t border-gray-850 pt-3 text-xs text-gray-400">
              Joined FilmLane on: <span className="text-gray-200 font-medium">{formatDate(user?.createdAt)}</span>
            </div>
          </div>

          {/* Tab Selection List */}
          <div className="flex flex-row lg:flex-col bg-gray-900/20 border border-gray-850 rounded-2xl overflow-hidden shadow-md">
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white lg:border-l-4 lg:border-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
              }`}
            >
              <RiSettings4Line className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => handleTabChange('watchlist')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-indigo-600 text-white lg:border-l-4 lg:border-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
              }`}
            >
              <RiHeartLine className="w-4 h-4" />
              <span className="hidden sm:inline">My Watchlist</span>
              <span className="bg-indigo-950 text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold ml-auto hidden lg:inline">
                {watchlist.length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white lg:border-l-4 lg:border-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
              }`}
            >
              <RiHistoryLine className="w-4 h-4" />
              <span className="hidden sm:inline">Watch History</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="lg:col-span-3">
          {/* TAB 1: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-8 bg-gray-900/20 border border-gray-850 p-6 sm:p-8 rounded-2xl shadow-xl">
              {/* Form 1: Username Update */}
              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-gray-850 pb-2 flex items-center gap-2">
                  <RiUser3Line className="text-indigo-400 w-5 h-5" />
                  Account Settings
                </h3>

                {usernameMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium border ${
                      usernameMsg.type === 'success'
                        ? 'bg-green-950/20 border-green-800/30 text-green-400'
                        : 'bg-red-950/20 border-red-800/30 text-red-400'
                    }`}
                  >
                    {usernameMsg.text}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-850 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-sm transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={usernameLoading || username === user?.username || !username.trim()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {usernameLoading ? 'Saving...' : 'Save Username'}
                  </button>
                </div>
              </form>

              {/* Form 2: Password Update */}
              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4 border-t border-gray-850">
                <h3 className="text-lg font-bold text-white pb-1 flex items-center gap-2">
                  <RiLockPasswordLine className="text-indigo-400 w-5 h-5" />
                  Change Password
                </h3>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium border ${
                      passwordMsg.type === 'success'
                        ? 'bg-green-950/20 border-green-800/30 text-green-400'
                        : 'bg-red-950/20 border-red-800/30 text-red-400'
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-950 border border-gray-850 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-950 border border-gray-850 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-950 border border-gray-850 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordLoading || !oldPassword || !password || !confirmPassword}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Danger Zone: Delete Account */}
              <div className="pt-6 border-t border-gray-850 space-y-4 text-left">
                <h3 className="text-lg font-bold text-red-500 pb-1 flex items-center gap-2">
                  <RiDeleteBin5Line className="text-red-500 w-5 h-5" />
                  Danger Zone
                </h3>
                <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl space-y-3">
                  <p className="text-xs text-red-400">
                    Permanently delete your FilmLane account. All your personal watchlists and history logs will be removed immediately. This action is irreversible.
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3">
                <RiHeartLine className="text-indigo-400 w-6 h-6" />
                My Watchlist
              </h3>

              {watchlistItemsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : watchlistItems.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-900/10 border border-gray-850/50 rounded-2xl">
                  <p className="font-semibold text-gray-400">Your watchlist is empty</p>
                  <p className="text-xs mt-1">Start browsing movies and TV shows and click the heart button to save them here!</p>
                  <Link to="/home" className="inline-block mt-4 text-xs font-semibold text-indigo-400 hover:underline">
                    Browse Titles
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                  {watchlistItems.map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item.media}
                      type={item.mediaType === 'MOVIE' ? 'movie' : 'tv'}
                      isBookmarked={watchlistIds.includes(item.media.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WATCH HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <RiHistoryLine className="text-indigo-400 w-6 h-6" />
                  Watch History
                </h3>
                {historyList.length > 0 && !historyLoading && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-950/60 border border-red-900/30 hover:border-red-900/50 text-red-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    <RiDeleteBin5Line className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                )}
              </div>

              {historyLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-900/10 border border-gray-850 rounded-xl">
                      <Skeleton className="w-24 h-16 rounded-lg shrink-0" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyList.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-900/10 border border-gray-850/50 rounded-2xl">
                  <p className="font-semibold text-gray-400">No watch history found</p>
                  <p className="text-xs mt-1">Media you watch will be automatically saved here for quick resume.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyList.map((item) => {
                    const title = item.media.title || item.media.name || 'Untitled';
                    const isMovie = item.mediaType === 'MOVIE';
                    const detailPath = isMovie ? `/movies/${item.tmdbId}` : `/tv/${item.tmdbId}`;
                    const playPath = isMovie
                      ? `/movies/${item.tmdbId}/play`
                      : (item.season !== null && item.season !== undefined && item.episode !== null && item.episode !== undefined)
                        ? `/tv/${item.tmdbId}/season/${item.season}/episode/${item.episode}`
                        : `/tv/${item.tmdbId}`;
                    const thumbUrl = item.media.backdrop_path
                      ? `https://image.tmdb.org/t/p/w300${item.media.backdrop_path}`
                      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop';

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-4 bg-gray-900/20 border border-gray-850/60 rounded-xl hover:border-gray-800 hover:bg-gray-900/30 transition-all group">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-950 border border-gray-850">
                            <img src={thumbUrl} alt={title} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 text-left">
                            <Link to={detailPath} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors truncate block">
                              {title}
                            </Link>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="inline-block text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/30">
                                {isMovie ? 'Movie' : 'TV Show'}
                              </span>
                              {!isMovie && item.season !== null && item.season !== undefined && item.episode !== null && item.episode !== undefined && (
                                <span className="inline-block text-[10px] uppercase font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/30">
                                  S{item.season} E{item.episode}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 text-gray-500 text-xs">
                              <RiTimeLine className="w-3.5 h-3.5" />
                              <span>Watched on {formatDate(item.watchedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <Link
                            to={playPath}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all shadow-md cursor-pointer"
                          >
                            Resume
                          </Link>
                          <button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 bg-gray-950 border border-gray-850 hover:border-red-900/30 hover:bg-red-950/15 rounded-lg transition-colors cursor-pointer"
                            title="Remove from history"
                          >
                            <RiDeleteBin5Line className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
