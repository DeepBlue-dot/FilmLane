import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../services/api.js';
import { HeroSlider } from '../../components/features/HeroSlider.js';
import { MediaCarousel } from '../../components/features/MediaCarousel.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { MediaItem } from '../../types/media.js';
import { useAuth } from '../../context/AuthContext.js';
import { RiHistoryLine, RiHeartLine, RiPlayFill, RiTimeLine, RiArrowRightLine } from 'react-icons/ri';
import { Skeleton } from '../../components/ui/skeleton.js';
import { MediaCard } from '../../components/features/MediaCard.js';

export default function HomePage() {
  const [heroMovies, setHeroMovies] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [popularTvShows, setPopularTvShows] = useState<MediaItem[]>([]);
  const [actionMovies, setActionMovies] = useState<MediaItem[]>([]);
  const [comedyMovies, setComedyMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const { watchlist, watchlistIds, toggleWatchlist } = useWatchlist();
  
  // Library section state
  const [libraryTab, setLibraryTab] = useState<'history' | 'watchlist'>('history');
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [watchlistItemsLoading, setWatchlistItemsLoading] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [trendingRes, tvRes, actionRes, comedyRes] = await Promise.all([
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', page: 1 } }),
          api.get('/discover/tv', { params: { sort_by: 'popularity.desc', page: 1 } }),
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', withGenres: '28', page: 1 } }),
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', withGenres: '35', page: 1 } }),
        ]);

        const movies = trendingRes.data?.results || [];
        setHeroMovies(movies.slice(0, 5));
        setTrendingMovies(movies);
        setPopularTvShows(tvRes.data?.results || []);
        setActionMovies(actionRes.data?.results || []);
        setComedyMovies(comedyRes.data?.results || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log('========== AXIOS ERROR ==========');
          console.log('code:', err.code);
          console.log('message:', err.message);
          console.log('status:', err.response?.status);
          console.log('data:', err.response?.data);
          console.log('config:', err.config);
          console.log('request:', err.request);
        } else {
          console.error('Error fetching homepage data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 1. Fetch detailed Watchlist items on homepage
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWatchlistDetails = async () => {
      if (watchlist.length === 0) {
        setWatchlistItems([]);
        return;
      }
      setWatchlistItemsLoading(true);
      try {
        const detailed = await Promise.all(
          watchlist.slice(0, 10).map(async (item) => {
            try {
              const isMovie = item.mediaType === 'MOVIE';
              const endpoint = isMovie ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
              const res = await api.get(endpoint);
              const media = res.data?.movie || res.data;
              return {
                ...item,
                media,
              };
            } catch (err) {
              console.error('Failed to load watchlist details for ID: ' + item.tmdbId, err);
              return null;
            }
          })
        );
        setWatchlistItems(detailed.filter((item): item is any => item !== null));
      } catch (err) {
        console.error(err);
      } finally {
        setWatchlistItemsLoading(false);
      }
    };

    fetchWatchlistDetails();
  }, [isAuthenticated, watchlist]);

  // 2. Fetch watch history on homepage
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await api.get('/users/me/watch-history');
        const rawItems = response.data?.data || [];
        const sortedRaw = [...rawItems].sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
        const uniqueItems = sortedRaw.filter((item: any, index: number, self: any[]) => 
          self.findIndex((t: any) => t.tmdbId === item.tmdbId) === index
        );
        const items = uniqueItems.slice(0, 10);
        
        const resolved = await Promise.all(
          items.map(async (item: any) => {
            const isMovie = item.mediaType === 'MOVIE';
            try {
              const endpoint = isMovie ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
              const res = await api.get(endpoint);
              const media = res.data?.movie || res.data;
              return {
                ...item,
                media,
              };
            } catch (err) {
              console.error('Failed to load history details for ID: ' + item.tmdbId, err);
              return {
                ...item,
                media: {
                  title: isMovie ? 'Unknown Movie' : 'Unknown TV Show',
                  name: isMovie ? 'Unknown Movie' : 'Unknown TV Show',
                  vote_average: 0,
                },
              };
            }
          })
        );
        setHistoryList(resolved);
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    await toggleWatchlist(id, type);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Hero Slider */}
      <HeroSlider items={heroMovies} loading={loading} />

      {/* My Library Section */}
      {isAuthenticated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              My Library
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-900/60 p-1 rounded-xl border border-gray-850">
                <button
                  onClick={() => setLibraryTab('history')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    libraryTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <RiHistoryLine className="w-3.5 h-3.5" />
                  Watch History
                </button>
                <button
                  onClick={() => setLibraryTab('watchlist')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    libraryTab === 'watchlist'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <RiHeartLine className="w-3.5 h-3.5" />
                  My Watchlist
                </button>
              </div>
              <Link
                to={`/profile?tab=${libraryTab}`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
              >
                View All
                <RiArrowRightLine className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {libraryTab === 'history' ? (
            historyLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="min-w-[240px] sm:min-w-[280px] max-w-[280px] shrink-0 space-y-3">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : historyList.length === 0 ? (
              <div className="text-center py-10 bg-gray-900/10 border border-gray-850/50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-400">No watch history yet</p>
                <p className="text-xs text-gray-500 mt-1">Titles you play will appear here so you can easily resume watching.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {historyList.map((item) => {
                  const title = item.media.title || item.media.name || 'Untitled';
                  const isMovie = item.mediaType === 'MOVIE';
                  const playPath = isMovie
                    ? `/movies/${item.tmdbId}/play`
                    : (item.season !== null && item.season !== undefined && item.episode !== null && item.episode !== undefined)
                      ? `/tv/${item.tmdbId}/season/${item.season}/episode/${item.episode}`
                      : `/tv/${item.tmdbId}`;
                  const thumbUrl = item.media.backdrop_path
                    ? `https://image.tmdb.org/t/p/w300${item.media.backdrop_path}`
                    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop';

                  return (
                    <div
                      key={item.id}
                      className="min-w-[240px] sm:min-w-[280px] max-w-[280px] shrink-0 group relative bg-gray-900 border border-gray-800/60 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-indigo-500/10 hover:border-gray-700"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-gray-950 relative">
                        <img
                          src={thumbUrl}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 bg-gray-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link
                            to={playPath}
                            className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transform scale-75 group-hover:scale-100 transition-all duration-300"
                          >
                            <RiPlayFill className="w-5 h-5" />
                          </Link>
                        </div>
                        <span className="absolute bottom-2 left-2 inline-block text-[9px] uppercase font-bold text-indigo-400 bg-gray-950/90 px-1.5 py-0.5 rounded border border-indigo-900/30 backdrop-blur-sm">
                          {isMovie ? 'Movie' : 'TV Show'}
                        </span>
                      </div>
                      <div className="p-3 text-left">
                        <Link to={playPath} className="block text-sm font-bold text-white hover:text-indigo-400 transition-colors truncate">
                          {title}
                        </Link>
                        {!isMovie && item.season !== null && item.season !== undefined && item.episode !== null && item.episode !== undefined && (
                          <p className="text-[11px] font-semibold text-indigo-300 mt-0.5">
                            Season {item.season}, Episode {item.episode}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <RiTimeLine className="w-3 h-3" />
                          <span>{formatDate(item.watchedAt)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            watchlistItemsLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="min-w-[160px] sm:min-w-[200px] max-w-[200px] shrink-0 space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : watchlistItems.length === 0 ? (
              <div className="text-center py-10 bg-gray-900/10 border border-gray-850/50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-400">Your watchlist is empty</p>
                <p className="text-xs text-gray-500 mt-1">Start bookmarking movies and TV shows to see them here.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {watchlistItems.map((item) => (
                  <div key={item.id} className="min-w-[160px] sm:min-w-[200px] max-w-[200px] shrink-0">
                    <MediaCard
                      item={item.media}
                      type={item.mediaType === 'MOVIE' ? 'movie' : 'tv'}
                      isBookmarked={watchlistIds.includes(item.media.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-6">
        <MediaCarousel
          title="Trending Movies"
          items={trendingMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Popular TV Shows"
          items={popularTvShows}
          type="tv"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Action Thrillers"
          items={actionMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Comedy Hits"
          items={comedyMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </div>
    </div>
  );
}
