import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiPlayFill, RiInformationLine, RiStarFill } from 'react-icons/ri';
import { Skeleton } from '../ui/skeleton.js';

interface HeroMedia {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
}

interface HeroSliderProps {
  items: HeroMedia[];
  loading?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ items, loading = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (loading) {
    return <Skeleton className="w-full h-[55vh] sm:h-[70vh] rounded-2xl" />;
  }

  if (items.length === 0) return null;

  const currentItem = items[activeIndex];
  const title = currentItem.title || currentItem.name || 'Featured Title';
  const backdropUrl = currentItem.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="relative w-full h-[55vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-gray-900">
      {/* Background Image backdrop */}
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-102" style={{ backgroundImage: `url(${backdropUrl})` }}></div>

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>

      {/* Info Container */}
      <div className="absolute inset-y-0 left-0 flex items-center px-6 sm:px-12 md:px-20 max-w-2xl z-10">
        <div className="space-y-4 sm:space-y-6">
          {/* Rating */}
          {currentItem.vote_average && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900/60 backdrop-blur border border-gray-800 text-amber-500 text-xs font-semibold">
              <RiStarFill className="w-3.5 h-3.5" />
              <span>{currentItem.vote_average.toFixed(1)} TMDB Rating</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase line-clamp-2">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4">
            {currentItem.overview || 'Browse summary and trailers for this featured presentation.'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              to={`/movies/${currentItem.id}/play`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <RiPlayFill className="w-4 h-4" />
              Watch Now
            </Link>
            <Link
              to={`/movies/${currentItem.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/80 hover:bg-gray-850 border border-gray-800 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              <RiInformationLine className="w-4 h-4" />
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-8 bg-indigo-500' : 'w-2.5 bg-gray-600/80 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};
