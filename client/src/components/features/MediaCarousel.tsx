import React, { useRef } from 'react';
import { MediaCard } from './MediaCard.js';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Skeleton } from '../ui/skeleton.js';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface MediaCarouselProps {
  title: string;
  items: MediaItem[];
  type: 'movie' | 'tv';
  loading?: boolean;
  bookmarks?: number[];
  onBookmarkToggle?: (id: number, type: 'movie' | 'tv') => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  items,
  type,
  loading = false,
  bookmarks = [],
  onBookmarkToggle,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4 py-4 relative group">
      {/* Title */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
      </div>

      {/* Scroller Buttons (Desktop only, visible on hover) */}
      {!loading && items.length > 0 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[50%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-gray-900/90 border border-gray-800 text-gray-400 hover:text-white hover:scale-115 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block cursor-pointer shadow-lg"
            aria-label="Scroll left"
          >
            <RiArrowLeftSLine className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[50%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-gray-900/90 border border-gray-800 text-gray-400 hover:text-white hover:scale-115 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block cursor-pointer shadow-lg"
            aria-label="Scroll right"
          >
            <RiArrowRightSLine className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Sliding Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-4 sm:px-0 py-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading ? (
          // Display Skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="min-w-[160px] sm:min-w-[200px] max-w-[200px] shrink-0 space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-gray-500 py-8 text-sm">No items found.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="min-w-[160px] sm:min-w-[200px] max-w-[200px] shrink-0">
              <MediaCard
                item={item}
                type={type}
                isBookmarked={bookmarks.includes(item.id)}
                onBookmarkToggle={onBookmarkToggle}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
