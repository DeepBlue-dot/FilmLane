import React from 'react';
import { Link } from 'react-router-dom';
import { RiPlayFill, RiStarFill, RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { Badge } from '../ui/badge.js';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface MediaCardProps {
  item: MediaItem;
  type: 'movie' | 'tv';
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: number, type: 'movie' | 'tv') => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, type, isBookmarked = false, onBookmarkToggle }) => {
  const title = item.title || item.name || 'Untitled';
  const releaseYear = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=342&auto=format&fit=crop';

  const detailsPath = type === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`;

  return (
    <div className="group relative bg-gray-900 border border-gray-800/60 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-indigo-500/10 hover:border-gray-700">
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-gray-950 relative">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Backdrop Hover Overlay */}
        <div className="absolute inset-0 bg-gray-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
          {/* Top Row: Bookmark Toggle */}
          <div className="flex justify-end">
            {onBookmarkToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBookmarkToggle(item.id, type);
                }}
                className="p-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-indigo-400 hover:text-indigo-300 hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
              >
                {isBookmarked ? <RiBookmarkFill className="w-4 h-4" /> : <RiBookmarkLine className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Center Row: Play Button */}
          <Link
            to={detailsPath}
            className="self-center p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transform scale-75 group-hover:scale-100 transition-all duration-300"
          >
            <RiPlayFill className="w-6 h-6" />
          </Link>

          {/* Bottom Row: Specs */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
              <RiStarFill className="w-3.5 h-3.5 text-amber-500" />
              <span>{rating}</span>
              <span className="text-gray-600">•</span>
              <span>{releaseYear}</span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 bg-gray-900/60 text-indigo-400 border-indigo-500/20">
              {type === 'movie' ? 'Movie' : 'TV Show'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Media info footer */}
      <div className="p-3">
        <Link to={detailsPath} className="block text-sm font-semibold text-gray-200 truncate hover:text-indigo-400 transition-colors">
          {title}
        </Link>
      </div>
    </div>
  );
};
