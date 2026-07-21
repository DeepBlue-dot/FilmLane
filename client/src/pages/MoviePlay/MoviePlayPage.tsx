import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftLine, RiMovie2Line, RiStarFill, RiCalendarLine, RiTimeLine } from 'react-icons/ri';
import { MediaDetails, VideoResult } from '../../types/media.js';
import { useAuth } from '../../context/AuthContext.js';

export default function MoviePlayPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchRecorded, setWatchRecorded] = useState(false);
  const [activeSource, setActiveSource] = useState<'vidsrc' | 'twoembed' | 'trailer'>('vidsrc');

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/movie/${movieId}`, {
          params: { appendToResponse: 'videos' },
        });
        const movieData = response.data?.movie || response.data;
        setMovie(movieData);

        // Auto-record watch history
        if (isAuthenticated && !watchRecorded) {
          try {
            await api.post('/users/me/watch-history', {
              tmdbId: movieData.id.toString(),
              mediaType: 'MOVIE',
            });
            setWatchRecorded(true);
          } catch (histErr) {
            console.log('Watch history record skipped or exists', histErr);
          }
        }
      } catch (err) {
        console.error('Error fetching movie player data', err);
        setError('Unable to load movie player. Please check connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, watchRecorded, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto" />
          <p className="text-gray-400 text-sm animate-pulse">Initializing theater stream...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center space-y-4">
        <p className="text-red-400 text-lg">{error || 'Movie player could not be loaded.'}</p>
        <Link to={`/movies/${movieId}`} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold">
          Return to Details
        </Link>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (video: VideoResult) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser' || video.type === 'Clip')
  );

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between select-none relative pb-12">
      {/* Blurred Backdrop image for immersive atmosphere */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src={backdropUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-slate-950/85" />
        </div>
      )}

      {/* Player Header */}
      <header className="p-4 sm:px-6 sm:py-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between z-10 relative">
        <button
          onClick={() => navigate(`/movies/${movieId}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-sm font-semibold transition-all cursor-pointer shadow-lg hover:shadow-black/20"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center hidden md:block">
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Now Playing</p>
          <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
            {movie.title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-500 font-extrabold text-sm tracking-wider">
          <RiMovie2Line className="w-6 h-6 animate-pulse" />
          <span>FILMLANE</span>
        </div>
      </header>

      {/* Main Video Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:px-8 md:py-2 z-10 relative space-y-6 w-full max-w-5xl mx-auto">
        {/* Stream Selector Controls */}
        <div className="flex bg-slate-900/90 border border-slate-800 rounded-xl p-1 select-none backdrop-blur-md shadow-lg shadow-black/40">
          <button
            onClick={() => setActiveSource('vidsrc')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSource === 'vidsrc'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Server 1
          </button>
          <button
            onClick={() => setActiveSource('twoembed')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSource === 'twoembed'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Server 2
          </button>
          {trailer && (
            <button
              onClick={() => setActiveSource('trailer')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSource === 'trailer'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Official Trailer
            </button>
          )}
        </div>

        {/* Stream Player Viewport */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-slate-800 relative">
          {activeSource === 'vidsrc' ? (
            <iframe
              src={`https://vidsrc-embed.ru/embed/movie/${movieId}`}
              title={`${movie.title} - VidSrc`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : activeSource === 'twoembed' ? (
            <iframe
              src={`https://www.2embed.online/embed/movie/${movieId}`}
              title={`${movie.title} - 2Embed`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : trailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0`}
              title={`${movie.title} - Trailer`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : null}
        </div>

        {/* Foreground Movie Poster & Info Card */}
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left">
          {posterUrl && (
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-28 sm:w-36 aspect-[2/3] object-cover rounded-xl shadow-xl border border-slate-700/80 flex-shrink-0 hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="flex-grow space-y-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {movie.title}
              </h2>
              {movie.vote_average !== undefined && movie.vote_average > 0 && (
                <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-xl text-xs font-extrabold border border-amber-500/20 shadow-sm">
                  <RiStarFill className="w-3.5 h-3.5" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <RiCalendarLine className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{movie.release_date.split('-')[0]}</span>
                </span>
              )}
              {movie.runtime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-1">
                    <RiTimeLine className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{movie.runtime} min</span>
                  </span>
                </>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <div className="flex items-center gap-1.5">
                    {movie.genres.slice(0, 3).map((g) => (
                      <span key={g.id} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-gray-300 text-[11px] font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {movie.tagline && (
              <p className="text-xs italic text-indigo-300 font-medium">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {movie.overview && (
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
