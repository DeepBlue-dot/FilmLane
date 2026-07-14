import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { MediaCard } from '../../components/features/MediaCard.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftSLine, RiArrowRightSLine, RiFilterLine } from 'react-icons/ri';

interface Genre {
  id: number;
  name: string;
}

export default function MovieDiscoveryPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  // Load Genres on Mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genre/movie/list');
        // response.data is either { genres: [...] } or direct array. Let's inspect getMoviesGenreList on backend:
        // res.status(200).json(list) where list = { genres: Genre[] }
        if (response.data?.genres) {
          setGenres(response.data.genres);
        } else if (Array.isArray(response.data)) {
          setGenres(response.data);
        }
      } catch (err) {
        console.error('Error fetching movie genres', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch Movies on filter/page change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = {
          sortBy,
          page: currentPage,
        };

        if (selectedGenre) {
          params.withGenres = selectedGenre;
        }

        if (selectedYear) {
          params.primaryReleaseYear = parseInt(selectedYear, 10);
        }

        const response = await api.get('/discover/movie', { params });
        if (response.data) {
          setMovies(response.data.results || []);
          setTotalPages(Math.min(response.data.total_pages || 1, 500)); // TMDB limits discover page queries to 500 pages
        }
      } catch (err: any) {
        console.error('Error fetching discovered movies', err);
        setError('Failed to fetch movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [sortBy, selectedGenre, selectedYear, currentPage]);

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    await toggleWatchlist(id, type);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate years list (e.g. 1970 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Movies</h1>
          <p className="text-gray-400 mt-1 text-sm">Discover and filter through thousands of cinematic titles.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/40 border border-gray-800 rounded-xl text-gray-400 text-xs font-semibold">
            <RiFilterLine className="w-4 h-4 text-indigo-400" />
            <span>Filters:</span>
          </div>

          {/* Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="bg-gray-900/60 border border-gray-850 text-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-gray-900/60 border border-gray-850 text-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Sorting Dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-900/60 border border-gray-850 text-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">IMDb Rating</option>
            <option value="primary_release_date.desc">Release Date</option>
          </select>
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
      ) : movies.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-semibold text-gray-400">No movies found</p>
          <p className="text-sm">Try adjusting your filters to find matching content.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MediaCard
                key={movie.id}
                item={movie}
                type="movie"
                isBookmarked={watchlistIds.includes(movie.id)}
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
