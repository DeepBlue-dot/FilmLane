import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer.js';
import { RiMovie2Line, RiSearchLine, RiArrowRightUpLine } from 'react-icons/ri';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white overflow-hidden relative">
      {/* Background decoration elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15),transparent_60%)]"></div>
      <div className="absolute bottom-0 inset-x-0 h-96 bg-[radial-gradient(circle_at_bottom,rgba(219,39,119,0.1),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(#ffffff07_1px,transparent_1px)] bg-[size:32px_32px] opacity-70"></div>

      {/* Global Navigation Header */}
      <NavBar />

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center max-w-3xl space-y-8 animate-fade-in-up">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <RiMovie2Line className="w-3.5 h-3.5" />
            Introducing FilmLane v1.0
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
            Navigate Your Personal{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Cinema Universe
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Get instant metadata, curate your custom watchlist, record your watch history logs, and discover thousands of movies and series from around the world.
          </p>

          {/* Search bar redirecting to login */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto relative flex items-center">
            <input
              type="text"
              placeholder="Search movies, TV shows, genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-900/60 backdrop-blur border border-gray-800 focus:border-indigo-500 text-white rounded-full pl-12 pr-16 py-3.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm sm:text-base placeholder-gray-500"
            />
            <RiSearchLine className="absolute left-4 w-5 h-5 text-gray-500" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs sm:text-sm text-white rounded-full transition-all shadow-md cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-8 py-3.5 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Start Curating List
              <RiArrowRightUpLine className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white font-semibold rounded-full px-8 py-3.5 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}