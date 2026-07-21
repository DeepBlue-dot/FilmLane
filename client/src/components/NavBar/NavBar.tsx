import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { RiMovie2Line, RiSearchLine, RiUser3Line, RiLogoutBoxRLine, RiHeartLine, RiHistoryLine, RiMenu3Line, RiCloseLine, RiStarFill } from 'react-icons/ri';
import { api } from '../../services/api.js';
import { Genre } from '../../types/media.js';

const NavBar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [genresDropdownOpen, setGenresDropdownOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setGenresDropdownOpen(false);
    setMobileGenresOpen(false);

    const isSearchPage = location.pathname === '/search';
    const queryFromUrl = new URLSearchParams(location.search).get('query')?.trim() || '';

    if (!isSearchPage || queryFromUrl.length < 2) {
      setShowDropdown(false);
    }
  }, [location.pathname, location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideDesktop = desktopSearchRef.current?.contains(target);
      const isInsideMobile = mobileSearchRef.current?.contains(target);
      const isInsideProfileButton = profileButtonRef.current?.contains(target);
      const isInsideProfileDropdown = profileDropdownRef.current?.contains(target);

      if (!isInsideDesktop && !isInsideMobile) {
        setShowDropdown(false);
      }

      if (!isInsideProfileButton && !isInsideProfileDropdown) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch recommendations based on searchQuery
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setRecommendations([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await api.get('/search/multi', {
          params: { query: searchQuery.trim(), page: 1 }
        });
        const results = response.data?.results || [];
        // Filter to only items with a title or name
        const filtered = results.filter((item: any) => item.title || item.name).slice(0, 5);
        setRecommendations(filtered);
        setShowDropdown(filtered.length > 0);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch Genres list on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          api.get('/genre/movie/list'),
          api.get('/genre/tv/list')
        ]);
        setMovieGenres(movieRes.data?.genres || movieRes.data || []);
        setTvGenres(tvRes.data?.genres || tvRes.data || []);
      } catch (err) {
        console.error('Error fetching genres in NavBar', err);
      }
    };
    fetchGenres();
  }, []);

  // Sync search input with URL if query is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query');
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Keep search suggestions visible when already on the search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query')?.trim() || '';
    if (q.length >= 2 && recommendations.length > 0) {
      setShowDropdown(true);
    }
  }, [location.search, recommendations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderDropdown = () => {
    if (!showDropdown || recommendations.length === 0) return null;

    return (
      <div className="absolute left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-indigo-500/20 rounded-xl shadow-2xl overflow-hidden z-[100] animate-fade-in divide-y divide-gray-800/40">
        {recommendations.map((item) => {
          const isMovie = item.media_type === 'movie' || !item.first_air_date;
          const title = item.title || item.name;
          const date = item.release_date || item.first_air_date || '';
          const year = date ? date.split('-')[0] : '';
          const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
            : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=92&auto=format&fit=crop';
          const linkPath = isMovie ? `/movies/${item.id}` : `/tv/${item.id}`;

          return (
            <Link
              key={`${item.media_type || 'media'}-${item.id}`}
              to={linkPath}
              onClick={() => {
                setShowDropdown(false);
                setSearchQuery('');
              }}
              className="flex items-center gap-3 p-2.5 hover:bg-indigo-600/10 transition-all cursor-pointer text-left group"
            >
              <img
                src={posterUrl}
                alt={title}
                className="w-9 h-13 object-cover rounded-lg border border-gray-800/80 shadow-md flex-shrink-0 group-hover:border-indigo-500/30 transition-all"
              />
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                    {title}
                  </h4>
                  {rating && rating !== '0.0' && (
                    <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-500/20 flex-shrink-0">
                      <RiStarFill className="w-2.5 h-2.5" />
                      <span>{rating}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium mt-1">
                  <span className="uppercase font-bold text-indigo-400 tracking-wider">
                    {isMovie ? 'Movie' : 'TV Show'}
                  </span>
                  {year && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>{year}</span>
                    </>
                  )}
                  {item.original_language && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span className="uppercase text-[9px]">{item.original_language}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        <button
          onClick={handleSearchSubmit}
          className="w-full text-center py-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/5 transition-all uppercase tracking-wider cursor-pointer"
        >
          View all results
        </button>
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Trending', path: '/trending' },
    { name: 'Top IMDb', path: '/topIMDB' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-white">
              <RiMovie2Line className="w-8 h-8 text-indigo-500" />
              <span>
                FILM<span className="text-indigo-500">LANE</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-indigo-400 font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Genres Hoverable Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setGenresDropdownOpen(true)}
                onMouseLeave={() => setGenresDropdownOpen(false)}
              >
                <button
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer focus:outline-none py-2"
                >
                  <span>Genres</span>
                  <svg 
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${genresDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {genresDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[480px] bg-gray-950/95 border border-gray-800 rounded-2xl shadow-2xl p-5 z-50 backdrop-blur-md grid grid-cols-2 gap-6">
                    {/* Movie Genres column */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 mb-3 border-b border-gray-800/80 pb-1.5">Movies</h4>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 max-h-[300px] overflow-y-auto pr-1 select-none">
                        {movieGenres.map((genre) => (
                          <Link
                            key={`movie-genre-${genre.id}`}
                            to={`/movies?genre=${genre.id}`}
                            className="text-xs text-gray-400 hover:text-white hover:bg-indigo-600/10 px-2 py-1 rounded-md transition-all truncate"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* TV Genres column */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 mb-3 border-b border-gray-800/80 pb-1.5">TV Shows</h4>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 max-h-[300px] overflow-y-auto pr-1 select-none">
                        {tvGenres.map((genre) => (
                          <Link
                            key={`tv-genre-${genre.id}`}
                            to={`/tv?genre=${genre.id}`}
                            className="text-xs text-gray-400 hover:text-white hover:bg-indigo-600/10 px-2 py-1 rounded-md transition-all truncate"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Search & User Profile section */}
          <div className="hidden md:flex items-center gap-4">
            <div ref={desktopSearchRef} className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search movies & shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (recommendations.length > 0) setShowDropdown(true);
                  }}
                  className="w-60 bg-gray-900 text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2 border border-gray-800 rounded-full focus:outline-none focus:border-indigo-500 focus:w-72 transition-all"
                />
                <RiSearchLine className="absolute left-3.5 top-2.5 text-gray-500 w-4 h-4" />
              </form>
              {renderDropdown()}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-1.5 text-sm z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-gray-800">
                      <p className="font-semibold text-white truncate">{user?.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      <RiUser3Line className="w-4 h-4 text-gray-400" />
                      My Profile
                    </Link>
                    <Link to="/profile?tab=watchlist" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      <RiHeartLine className="w-4 h-4 text-gray-400" />
                      Watchlist
                    </Link>
                    <Link to="/profile?tab=history" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      <RiHistoryLine className="w-4 h-4 text-gray-400" />
                      History
                    </Link>

                    <div className="border-t border-gray-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors text-left cursor-pointer"
                    >
                      <RiLogoutBoxRLine className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors shadow-lg hover:shadow-indigo-500/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenu3Line className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-900 px-4 pt-2 pb-4 space-y-3">
          <div ref={mobileSearchRef} className="relative mt-2">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (recommendations.length > 0) setShowDropdown(true);
                }}
                className="w-full bg-gray-900 text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2 border border-gray-800 rounded-full focus:outline-none focus:border-indigo-500"
              />
              <RiSearchLine className="absolute left-3.5 top-2.5 text-gray-500 w-4 h-4" />
            </form>
            {renderDropdown()}
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Genres Collapsible */}
            <div className="block">
              <button
                onClick={() => setMobileGenresOpen(!mobileGenresOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
              >
                <span>Genres</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${mobileGenresOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileGenresOpen && (
                <div className="pl-4 pr-2 py-2 mt-1 bg-gray-900/20 border border-gray-900/50 rounded-xl space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-2">Movies</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {movieGenres.slice(0, 16).map((genre) => (
                        <Link
                          key={`mob-movie-genre-${genre.id}`}
                          to={`/movies?genre=${genre.id}`}
                          className="text-xs text-gray-400 hover:text-white py-1 block truncate"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-2">TV Shows</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {tvGenres.slice(0, 16).map((genre) => (
                        <Link
                          key={`mob-tv-genre-${genre.id}`}
                          to={`/tv?genre=${genre.id}`}
                          className="text-xs text-gray-400 hover:text-white py-1 block truncate"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-900 my-2 pt-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-white transition-colors">
                    <RiUser3Line className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link to="/profile?tab=watchlist" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-white transition-colors">
                    <RiHeartLine className="w-4 h-4" />
                    Watchlist
                  </Link>
                  <Link to="/profile?tab=history" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-white transition-colors">
                    <RiHistoryLine className="w-4 h-4" />
                    History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-900 hover:text-red-300 transition-colors text-left cursor-pointer"
                  >
                    <RiLogoutBoxRLine className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-3">
                <Link to="/login" className="block text-center px-4 py-2 rounded-full border border-gray-800 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="block text-center px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;