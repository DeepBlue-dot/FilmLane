import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { MediaCard } from '../../components/features/MediaCard.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiSearchLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [inputValue, setInputValue] = useState(query);
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  // Keep input value in sync with URL query
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Fetch results when query, page or tab changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      setTotalResults(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // If they want to search only movies or tv, we can use specific endpoints or filter locally.
        // Let's use search/multi and filter locally, or use specific endpoints.
        // Multi search is best for general discovery.
        // Let's call /search/multi on our proxy server.
        const endpoint = activeTab === 'all' 
          ? '/search/multi' 
          : activeTab === 'movie' 
            ? '/search/movie' 
            : '/search/tv';
        
        const response = await api.get(endpoint, {
          params: {
            query: query.trim(),
            page: currentPage,
          },
        });

        if (response.data) {
          const fetchedResults = response.data.results || [];
          // Multi search can return person items. Let's filter to movies/tv unless it's specific.
          const filtered = activeTab === 'all' 
            ? fetchedResults.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
            : fetchedResults.map((item: any) => ({ ...item, media_type: activeTab })); // add media_type back if movie/tv endpoint
          
          setResults(filtered);
          setTotalPages(response.data.total_pages || 1);
          setTotalResults(response.data.total_results || 0);
        }
      } catch (err: any) {
        console.error('Search fetch failed', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Reset page if query changes
    fetchResults();
  }, [query, currentPage, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCurrentPage(1);
      setSearchParams({ query: inputValue.trim() });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    await toggleWatchlist(id, type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Input Bar (in-page) */}
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold text-white text-center tracking-tight">
          Explore Movies & TV Shows
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search for movies, TV shows, actors..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-gray-900/60 border border-gray-800 text-white placeholder-gray-500 pl-12 pr-28 py-3.5 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md transition-all text-base shadow-xl"
          />
          <RiSearchLine className="absolute left-4.5 top-[18px] text-gray-500 w-5 h-5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {query && (
        <div className="space-y-6">
          {/* Tabs Filter & Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-4 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-400 hover:text-white bg-gray-900/40 border border-gray-800'
                }`}
              >
                All Results
              </button>
              <button
                onClick={() => { setActiveTab('movie'); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'movie'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-400 hover:text-white bg-gray-900/40 border border-gray-800'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => { setActiveTab('tv'); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'tv'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-400 hover:text-white bg-gray-900/40 border border-gray-800'
                }`}
              >
                TV Shows
              </button>
            </div>
            
            <p className="text-sm text-gray-400">
              Found <span className="text-white font-semibold">{totalResults}</span> results for &ldquo;
              <span className="text-indigo-400 font-semibold">{query}</span>&rdquo;
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-2">
              <p className="text-lg font-semibold text-gray-400">No results found</p>
              <p className="text-sm">Double check the spelling or try searching for another title.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    type={item.media_type || (activeTab === 'all' ? 'movie' : activeTab)}
                    isBookmarked={watchlistIds.includes(item.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>

              {/* Pagination controls */}
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
      )}
    </div>
  );
}
