import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { MediaCard } from '../../components/features/MediaCard.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiSearchLine, RiArrowLeftSLine, RiArrowRightSLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import { MediaItem, Genre, Language } from '../../types/media.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [inputValue, setInputValue] = useState(query);
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');

  // Filter & Config Lists
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  // Combine and de-duplicate genres
  const allGenres = useMemo(() => {
    const map = new Map<number, string>();
    movieGenres.forEach(g => map.set(g.id, g.name));
    tvGenres.forEach(g => map.set(g.id, g.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [movieGenres, tvGenres]);

  // Keep input value in sync with URL query
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Fetch Genres & Languages once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [movieG, tvG, langList] = await Promise.all([
          api.get('/genre/movie/list'),
          api.get('/genre/tv/list'),
          api.get('/Languages')
        ]);
        setMovieGenres(movieG.data?.genres || movieG.data || []);
        setTvGenres(tvG.data?.genres || tvG.data || []);
        
        // Sorting languages alphabetically by English name
        const sortedLangs = (langList.data || []).sort((a: Language, b: Language) => 
          a.english_name.localeCompare(b.english_name)
        );
        setLanguages(sortedLangs);
      } catch (err) {
        console.error('Metadata fetching failed on search page', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch results when query, page, tab, or year (for movie/tv search backend API) changes
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
        const endpoint = activeTab === 'all' 
          ? '/search/multi' 
          : activeTab === 'movie' 
            ? '/search/movie' 
            : '/search/tv';
        
        const params: Record<string, string | number | boolean | undefined> = {
          query: query.trim(),
          page: currentPage,
        };

        // If searching specific movie/tv, pass release year to TMDB search endpoint
        if (selectedYear) {
          if (activeTab === 'movie') {
            params.primary_release_year = selectedYear;
          } else if (activeTab === 'tv') {
            params.first_air_date_year = selectedYear;
          }
        }
        
        const response = await api.get(endpoint, { params });

        if (response.data) {
          const fetchedResults = (response.data.results || []) as MediaItem[];
          
          // Filter multi search to only movies/tv
          const filtered = activeTab === 'all' 
            ? fetchedResults.filter((item) => item.original_language && (item.title || item.name))
            : fetchedResults.map((item) => ({ ...item, media_type: activeTab }));
          
          setResults(filtered);
          setTotalPages(response.data.total_pages || 1);
          setTotalResults(response.data.total_results || 0);
        }
      } catch (err) {
        console.error('Search fetch failed', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, activeTab, selectedYear]);

  // Process filters and sorting locally
  const processedResults = useMemo(() => {
    let list = [...results];

    // If in multi-search (all) and year is selected, filter locally
    if (activeTab === 'all' && selectedYear) {
      list = list.filter((item) => {
        const year = (item.release_date || item.first_air_date || '').split('-')[0];
        return year === selectedYear;
      });
    }

    // Filter by Genre locally
    if (selectedGenre) {
      const gId = parseInt(selectedGenre, 10);
      list = list.filter((item) => item.genre_ids?.includes(gId));
    }

    // Filter by Language locally
    if (selectedLanguage) {
      list = list.filter((item) => item.original_language === selectedLanguage);
    }

    // Filter by Rating locally
    if (selectedRating) {
      const rating = parseFloat(selectedRating);
      list = list.filter((item) => (item.vote_average || 0) >= rating);
    }

    // Sort results locally
    if (sortBy) {
      list.sort((a, b) => {
        if (sortBy === 'popularity.desc') {
          return (b.popularity || 0) - (a.popularity || 0);
        }
        if (sortBy === 'vote_average.desc') {
          return (b.vote_average || 0) - (a.vote_average || 0);
        }
        if (sortBy === 'release_date.desc') {
          const dateA = a.release_date || a.first_air_date || '';
          const dateB = b.release_date || b.first_air_date || '';
          return dateB.localeCompare(dateA);
        }
        return 0;
      });
    }

    return list;
  }, [results, activeTab, selectedYear, selectedGenre, selectedLanguage, selectedRating, sortBy]);

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

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedLanguage('');
    setSelectedRating('');
    setSortBy('');
  };

  // Generate years list (current year back to 1970)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (currentYear - i).toString());

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-900 pb-4 gap-4">
            <div className="flex flex-wrap items-center gap-2">
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

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`ml-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showFilters || selectedGenre || selectedYear || selectedLanguage || selectedRating || sortBy
                    ? 'border-indigo-500 bg-indigo-600/10 text-indigo-400'
                    : 'border-gray-800 text-gray-400 hover:text-white bg-gray-900/20'
                }`}
              >
                <RiFilterLine className="w-4 h-4" />
                <span>Filters</span>
                {(selectedGenre || selectedYear || selectedLanguage || selectedRating || sortBy) && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                )}
              </button>
            </div>
            
            <p className="text-sm text-gray-400">
              Found <span className="text-white font-semibold">{totalResults}</span> results for &ldquo;
              <span className="text-indigo-400 font-semibold">{query}</span>&rdquo;
            </p>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="p-5 bg-gray-900/40 border border-gray-850 rounded-2xl space-y-4 backdrop-blur-sm animate-fade-in shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <RiFilterLine className="text-indigo-500 w-4 h-4" />
                  Advanced Filter Options
                </span>
                {(selectedGenre || selectedYear || selectedLanguage || selectedRating || sortBy) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RiCloseLine className="w-3.5 h-3.5" />
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Genre Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Genres</option>
                    {allGenres.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Release Year Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Release Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Years</option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                {/* Language Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Languages</option>
                    {languages.map((l) => (
                      <option key={l.iso_639_1} value={l.iso_639_1}>{l.english_name}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Min Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Any Rating</option>
                    <option value="8.5">8.5+ Stars</option>
                    <option value="7.5">7.5+ Stars</option>
                    <option value="6.0">6.0+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                  </select>
                </div>

                {/* Local Sorting Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Relevance</option>
                    <option value="popularity.desc">Popularity</option>
                    <option value="vote_average.desc">IMDb Rating</option>
                    <option value="release_date.desc">Release Date</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
          ) : processedResults.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-2">
              <p className="text-lg font-semibold text-gray-400">No results found</p>
              <p className="text-sm">Try adjusting your search queries or filter selections.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {processedResults.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    type={(item.media_type || (activeTab === 'all' ? 'movie' : activeTab)) as 'movie' | 'tv'}
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
