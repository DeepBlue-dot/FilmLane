import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer.js';
import { api } from '../../services/api.js';
import { RiSearchLine, RiArrowRightUpLine, RiStarFill, RiPlayFill, RiMagicLine } from 'react-icons/ri';

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
        setTrending(movies.slice(0, 12));
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white relative overflow-x-hidden">
      {/* VIBRANT ANIMATED BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Animated Floating Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-indigo-600/40 to-purple-600/30 rounded-full blur-[120px] animate-orb1" />
        <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-tl from-pink-600/35 to-rose-600/25 rounded-full blur-[140px] animate-orb2" />
        <div className="absolute -bottom-32 left-1/3 w-[750px] h-[750px] bg-gradient-to-tr from-cyan-600/30 to-blue-600/25 rounded-full blur-[150px] animate-glow-pulse" />

        {/* Ambient Dark Mesh Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />

        {/* Moving Background Poster Grid Wall */}
        <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-6 w-[150%] h-[150%] -translate-x-[25%] -translate-y-[25%] -rotate-6 animate-diagonal-scroll opacity-[0.22]">
          {Array.from({ length: 32 }).map((_, idx) => {
            const movie = trending.length > 0 ? trending[idx % trending.length] : null;
            const posterUrl = movie?.poster_path
              ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
              : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=185&auto=format&fit=crop';
            return (
              <div key={idx} className="aspect-[2/3] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl">
                <img src={posterUrl} alt="" className="w-full h-full object-cover filter brightness-125 contrast-125 saturate-125" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Header */}
      <NavBar />

      {/* Main Content (z-10 above animated background) */}
      <main className="flex-grow z-10 relative space-y-16 pb-20">
        
        {/* 1. Hero Section */}
        <section className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 space-y-8 animate-fade-in-up">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide shadow-lg shadow-indigo-500/20 backdrop-blur-md">
            <RiMagicLine className="w-4 h-4 text-indigo-400 animate-pulse" />
            Introducing FilmLane Cinema Universe
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
            Explore Unlimited Movies &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              TV Shows
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get instant metadata, stream across multiple servers, build your custom watchlist, and track your viewing history seamlessly.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center shadow-2xl group">
            <input
              type="text"
              placeholder="Search movies, TV shows, actors, genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900/85 backdrop-blur-xl border border-slate-700 focus:border-indigo-500 text-white rounded-full pl-12 pr-28 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 transition-all text-sm sm:text-base placeholder-gray-400 shadow-inner"
            />
            <RiSearchLine className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs sm:text-sm text-white rounded-full transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/40"
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-full px-8 py-3.5 transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 cursor-pointer"
            >
              Browse Library
              <RiArrowRightUpLine className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-gray-200 hover:text-white font-bold rounded-full px-8 py-3.5 transition-all backdrop-blur-md cursor-pointer shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </section>
        

        {/* 3. Live Trending Carousel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center md:text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Trending Now on FilmLane
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto md:mx-0">
              Discover currently trending blockbusters and popular recommendations.
            </p>
          </div>

          {loadingTrending ? (
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] shrink-0 snap-start space-y-3">
                  <div className="aspect-[2/3] bg-slate-900 rounded-2xl animate-pulse" />
                  <div className="h-4 bg-slate-900 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-900 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
              {trending.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=342&auto=format&fit=crop';
                return (
                  <Link
                    key={movie.id}
                    to={`/movies/${movie.id}`}
                    className="group min-w-[160px] sm:min-w-[180px] md:min-w-[200px] shrink-0 snap-start space-y-3 text-left block animate-fade-in"
                  >
                    <div className="aspect-[2/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 shadow-xl relative group transition-all duration-300 hover:scale-[1.04]">
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
                        <div className="absolute top-2 right-2 bg-black/85 backdrop-blur text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-slate-800 text-amber-400 flex items-center gap-0.5">
                          <RiStarFill className="w-2.5 h-2.5" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium">
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