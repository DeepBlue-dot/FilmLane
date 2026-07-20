import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { MediaCard } from '../../components/features/MediaCard.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarEventLine } from 'react-icons/ri';
import { MediaItem } from '../../types/media.js';

export default function UpcomingPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'now-playing'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchUpcomingOrNowPlaying = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = activeTab === 'upcoming' ? '/movie/upcoming' : '/movie/now-playing';
        const response = await api.get(endpoint, {
          params: { page: currentPage },
        });

        if (response.data) {
          setItems(response.data.results || []);
          setTotalPages(Math.min(response.data.total_pages || 1, 50)); // Limit pages
        }
      } catch (err) {
        console.error('Error fetching movie releases', err);
        setError('Failed to load movie releases list. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingOrNowPlaying();
  }, [activeTab, currentPage]);

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    await toggleWatchlist(id, type);
  };

  const handleTabChange = (tab: 'upcoming' | 'now-playing') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RiCalendarEventLine className="w-8 h-8 text-indigo-400" />
            {activeTab === 'upcoming' ? 'Upcoming Releases' : 'Now Playing in Theaters'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {activeTab === 'upcoming'
              ? 'Get a sneak peek at highly anticipated movies coming to screens soon.'
              : 'Discover what hot cinematic releases are showing in theaters right now.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-gray-900/60 p-1 border border-gray-800 rounded-xl shrink-0">
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleTabChange('now-playing')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'now-playing'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Now Playing
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30 text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-semibold text-gray-400">No items found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                type="movie"
                isBookmarked={watchlistIds.includes(item.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-900">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <RiArrowLeftSLine className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400">
                Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <RiArrowRightSLine className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
