import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMovie2Line, RiFacebookBoxFill, RiTwitterXFill, RiInstagramFill, RiYoutubeFill } from 'react-icons/ri';
import { api } from '../../services/api.js';
import { Genre } from '../../types/media.js';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 bg-slate-950 border-t border-slate-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Intro */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-white">
              <RiMovie2Line className="w-7 h-7 text-indigo-500" />
              <span>
                FILM<span className="text-indigo-500">LANE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              The ultimate destination to discover and track your favorite movies & TV shows. Browse summaries, discover releases, and navigate reviews.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition-colors"><RiFacebookBoxFill className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><RiTwitterXFill className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><RiInstagramFill className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><RiYoutubeFill className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Browse Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Browse</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/home" className="hover:text-white transition-colors">Home Dashboard</Link></li>
              <li><Link to="/movies" className="hover:text-white transition-colors">Latest Movies</Link></li>
              <li><Link to="/tv" className="hover:text-white transition-colors">TV Series</Link></li>
              <li><Link to="/topIMDB" className="hover:text-white transition-colors">Top Rated IMDb</Link></li>
            </ul>
          </div>

          {/* Genres Links (dynamic by TMDB genre id) */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {/** Render top movie genres by id → link to movies filtered by genre id */}
              <GenreList />
            </ul>
          </div>

          {/* Support / Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Help & Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} FilmLane. Developed as a premium movie discovery platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Small helper component to fetch and render top movie genres by id
function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        const res = await api.get('/genre/movie/list');
        const list = res.data?.genres || res.data || [];
        if (mounted) setGenres(list.slice(0, 6));
      } catch (err) {
        // silent
      }
    };
    fetchGenres();
    return () => { mounted = false; };
  }, []);

  if (!genres.length) {
    return (
      <>
        <li className="text-sm text-gray-400">Loading genres…</li>
      </>
    );
  }

  return (
    <>
      {genres.map((g) => (
        <li key={`footer-genre-${g.id}`}>
          <Link to={`/movies?genre=${g.id}`} className="hover:text-white transition-colors">
            {g.name}
          </Link>
        </li>
      ))}
    </>
  );
}
