import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../services/api.js';
import { HeroSlider } from '../../components/features/HeroSlider.js';
import { MediaCarousel } from '../../components/features/MediaCarousel.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { MediaItem } from '../../types/media.js';

export default function HomePage() {
  const [heroMovies, setHeroMovies] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [popularTvShows, setPopularTvShows] = useState<MediaItem[]>([]);
  const [actionMovies, setActionMovies] = useState<MediaItem[]>([]);
  const [comedyMovies, setComedyMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [trendingRes, tvRes, actionRes, comedyRes] = await Promise.all([
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', page: 1 } }),
          api.get('/discover/tv', { params: { sort_by: 'popularity.desc', page: 1 } }),
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', withGenres: '28', page: 1 } }),
          api.get('/discover/movie', { params: { sortBy: 'popularity.desc', withGenres: '35', page: 1 } }),
        ]);

        const movies = trendingRes.data?.results || [];
        setHeroMovies(movies.slice(0, 5));
        setTrendingMovies(movies);
        setPopularTvShows(tvRes.data?.results || []);
        setActionMovies(actionRes.data?.results || []);
        setComedyMovies(comedyRes.data?.results || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log('========== AXIOS ERROR ==========');
          console.log('code:', err.code);
          console.log('message:', err.message);
          console.log('status:', err.response?.status);
          console.log('data:', err.response?.data);
          console.log('config:', err.config);
          console.log('request:', err.request);
        } else {
          console.error('Error fetching homepage data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleBookmarkToggle = async (id: number, type: 'movie' | 'tv') => {
    await toggleWatchlist(id, type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Hero Slider */}
      <HeroSlider items={heroMovies} loading={loading} />

      {/* Rows */}
      <div className="space-y-6">
        <MediaCarousel
          title="Trending Movies"
          items={trendingMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Popular TV Shows"
          items={popularTvShows}
          type="tv"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Action Thrillers"
          items={actionMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />

        <MediaCarousel
          title="Comedy Hits"
          items={comedyMovies}
          type="movie"
          loading={loading}
          bookmarks={watchlistIds}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </div>
    </div>
  );
}
