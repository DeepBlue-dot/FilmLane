import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer.js';
import { api } from '../../services/api.js';
import { RiMovie2Line, RiSearchLine, RiArrowRightUpLine, RiStarFill, RiCompassLine, RiStackLine, RiHistoryLine, RiPlayFill } from 'react-icons/ri';

interface TrendingMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState<TrendingMovie[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await api.get('/discover/movie', {
          params: { sortBy: 'popularity.desc', page: 1 }
        });
        const movies = response.data?.results || response.data || [];
        setTrending(movies.slice(0, 6));
      } catch (err) {
        console.error('Error fetching landing page trending movies', err);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white relative overflow-x-hidden">
      {/* Cinematic Poster Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.35),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_20%)] blur-3xl animate-glow-pulse" />
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-4 w-[110%] h-[110%] -translate-x-[5%] -translate-y-[5%] -rotate-2 animate-diagonal-scroll">
          {Array.from({ length: 24 }).map((_, idx) => {
            const movie = trending.length > 0 ? trending[idx % trending.length] : null;
            const posterUrl = movie?.poster_path
              ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
              : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=185&auto=format&fit=crop';
            return (
              <div key={idx} className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 border border-gray-800/40 shadow-xl shadow-indigo-500/20">
                <img src={posterUrl} alt="" className="w-full h-full object-cover filter brightness-110 contrast-[1.05] saturate-150 opacity-95" />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-950/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>

      {/* Navigation Header */}
      <NavBar />

      {/* Main Container */}
      <main className="flex-grow z-10 space-y-24 pb-16">
        
        {/* 1. Hero Section */}
        <section className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-8 animate-fade-in-up">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <RiMovie2Line className="w-3.5 h-3.5" />
            Introducing FilmLane v1.1
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
            Navigate Your Personal{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Cinema Universe
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Get instant metadata, stream with multiple servers, build your custom watchlist, and track your history details including seasons and episodes.
          </p>

          {/* Search bar redirecting to search page */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto relative flex items-center shadow-2xl">
            <input
              type="text"
              placeholder="Search movies, TV shows, genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-900/80 backdrop-blur border border-gray-800 focus:border-indigo-500 text-white rounded-full pl-12 pr-20 py-3.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm sm:text-base placeholder-gray-500"
            />
            <RiSearchLine className="absolute left-4 w-5 h-5 text-gray-500" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs sm:text-sm text-white rounded-full transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20"
            >
              Explore
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-8 py-3.5 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Browse Movies & Shows
              <RiArrowRightUpLine className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-900/60 hover:bg-gray-850 border border-gray-855 hover:border-gray-800 text-gray-300 hover:text-white font-bold rounded-full px-8 py-3.5 transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* 2. Live Trending Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center md:text-left mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Trending Now on FilmLane
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              Discover currently trending blockbusters and popular recommendations.
            </p>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[2/3] bg-gray-900 rounded-2xl animate-pulse" />
                  <div className="h-4 bg-gray-900 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-900 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {trending.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=342&auto=format&fit=crop';
                return (
                  <Link
                    key={movie.id}
                    to={`/movies/${movie.id}`}
                    className="group space-y-3 text-left block animate-fade-in"
                  >
                    <div className="aspect-[2/3] bg-gray-900 rounded-2xl overflow-hidden border border-gray-900 hover:border-indigo-500/30 shadow-lg relative group transition-all duration-300 hover:scale-[1.03]">
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-3 rounded-full bg-indigo-600 text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-350">
                          <RiPlayFill className="w-5 h-5" />
                        </div>
                      </div>
                      {movie.vote_average !== undefined && movie.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-gray-800 text-amber-400 flex items-center gap-0.5">
                          <RiStarFill className="w-2.5 h-2.5" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>


      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}