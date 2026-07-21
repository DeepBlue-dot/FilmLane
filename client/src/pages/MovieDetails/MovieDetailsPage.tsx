import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { MediaCarousel } from '../../components/features/MediaCarousel.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { Badge } from '../../components/ui/badge.js';
import { RiPlayFill, RiHeartLine, RiHeartFill, RiStarFill, RiTimeLine, RiCalendarLine } from 'react-icons/ri';
import { MediaDetails, VideoResult, Genre } from '../../types/media.js';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { watchlistIds, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/movie/${movieId}`, {
          params: { appendToResponse: 'credits,videos,recommendations' },
        });
        if (response.data?.movie) {
          setMovie(response.data.movie);
        } else {
          setMovie(response.data);
        }
      } catch (err) {
        console.error('Error fetching movie details', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <Skeleton className="w-full h-[40vh] sm:h-[50vh] rounded-2xl" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-64 h-96 rounded-xl shrink-0" />
          <div className="flex-grow space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-red-400">
        {error || 'Movie details not found.'}
      </div>
    );
  }

  const isBookmarked = watchlistIds.includes(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const duration = movie.runtime ? `${movie.runtime} min` : 'N/A';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=342&auto=format&fit=crop';

  // Find trailer video
  const trailer = movie.videos?.results?.find(
    (video: VideoResult) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  const castList = movie.credits?.cast?.slice(0, 10) || [];
  const recommendations = movie.recommendations?.results || [];

  return (
    <div className="space-y-10 pb-12">
      {/* Backdrop Section */}
      <div className="relative w-full h-[40vh] sm:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-102 transition-transform duration-700"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent"></div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
          {/* Poster Card */}
          <div className="w-60 mx-auto md:mx-0 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-gray-900 bg-gray-950">
            <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
          </div>

          {/* Info Side */}
          <div className="flex-grow space-y-6 text-center md:text-left self-end">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
                {movie.title}
              </h1>
              <p className="text-indigo-400 text-sm font-semibold tracking-wider italic">
                {movie.tagline}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1.5 text-amber-500 font-semibold bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
                <RiStarFill className="w-4 h-4" />
                <span>{rating} Rating</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
                <RiCalendarLine className="w-4 h-4 text-indigo-400" />
                <span>{releaseYear}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
                <RiTimeLine className="w-4 h-4 text-indigo-400" />
                <span>{duration}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {movie.genres?.map((genre: Genre) => (
                <Badge key={genre.id} variant="outline" className="bg-indigo-600/10 border-indigo-500/20 text-indigo-400 px-3 py-1">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                to={`/movies/${movie.id}/play`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer text-base"
              >
                <RiPlayFill className="w-5 h-5" />
                Play Movie
              </Link>
              <button
                onClick={() => toggleWatchlist(movie.id, 'movie')}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30'
                    : 'bg-gray-900/80 border-gray-800 text-white hover:bg-gray-850'
                }`}
              >
                {isBookmarked ? (
                  <>
                    <RiHeartFill className="w-4 h-4 text-red-500" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <RiHeartLine className="w-4 h-4 text-gray-400" />
                    Add to Watchlist
                  </>
                )}
              </button>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-amber-500/20 cursor-pointer"
                >
                  View on<span className="bg-black text-amber-500 px-1.5 py-0.5 rounded text-[10px] font-black tracking-tighter">IMDb</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Overview & Detailed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-8 border-t border-gray-900">
          {/* Left Column: Synopsis & Cast */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Synopsis</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {movie.overview || 'No synopsis description is available.'}
              </p>
            </div>

            {/* Cast List */}
            {castList.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Top Billed Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {castList.map((cast: CastMember) => {
                    const avatarUrl = cast.profile_path
                      ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
                    return (
                      <div key={cast.id} className="bg-gray-900/40 border border-gray-850 rounded-xl p-3 text-center space-y-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-gray-950 border border-gray-800">
                          <img src={avatarUrl} alt={cast.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white truncate">{cast.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{cast.character}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Trailer & Sidebar Details */}
          <div className="space-y-8">
            {/* YouTube Trailer Frame */}
            {trailer && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Official Trailer</h2>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-900 shadow-lg bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Movie Info Details */}
            <div className="bg-gray-900/30 border border-gray-850 rounded-2xl p-5 space-y-4 text-sm">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-gray-900 pb-2">
                Details Info
              </h2>
              {movie.release_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Release Date</span>
                  <span className="text-white font-medium">{movie.release_date}</span>
                </div>
              )}
              {movie.budget !== undefined && movie.budget > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="text-white font-medium">${movie.budget.toLocaleString()}</span>
                </div>
              )}
              {movie.revenue !== undefined && movie.revenue > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-white font-medium">${movie.revenue.toLocaleString()}</span>
                </div>
              )}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="text-white font-medium">{movie.spoken_languages[0]?.english_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Carousel */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <MediaCarousel
            title="Recommendations"
            items={recommendations}
            type="movie"
            bookmarks={watchlistIds}
            onBookmarkToggle={(id, type) => toggleWatchlist(id, type)}
          />
        </div>
      )}
    </div>
  );
}
