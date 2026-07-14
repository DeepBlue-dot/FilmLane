import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftLine, RiMovie2Line, RiStarFill } from 'react-icons/ri';
import { MediaDetails, VideoResult } from '../../types/media.js';

export default function MoviePlayPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchRecorded, setWatchRecorded] = useState(false);
  const [activeSource, setActiveSource] = useState<'stream' | 'trailer'>('stream');

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
        if (!watchRecorded) {
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
  }, [movieId, watchRecorded]);

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

  return (
    <div className="min-h-screen max-h-screen h-screen overflow-hidden bg-gray-950 text-white flex flex-col justify-between select-none relative">
      {/* Blurred Backdrop image for immersive atmosphere */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={backdropUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-[0.05] blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950" />
        </div>
      )}

      {/* Player Header */}
      <header className="p-4 sm:px-6 sm:py-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between z-10 relative">
        <button
          onClick={() => navigate(`/movies/${movieId}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-sm font-semibold transition-all cursor-pointer shadow-lg hover:shadow-black/20"
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
          <RiMovie2Line className="w-6 h-6" />
          <span>FILMLANE</span>
        </div>
      </header>

      {/* Main Video Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:px-8 md:py-2 z-10 relative space-y-4 w-full max-w-5xl mx-auto">
        {/* Stream Selector Controls */}
        {trailer && (
          <div className="flex bg-gray-900/90 border border-gray-800 rounded-xl p-1 select-none backdrop-blur-md shadow-lg shadow-black/40">
            <button
              onClick={() => setActiveSource('stream')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSource === 'stream'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Main Stream
            </button>
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
          </div>
        )}

        <div className="w-full aspect-video bg-gray-950 rounded-2xl overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] border border-gray-850 relative">
          {activeSource === 'stream' ? (
            <iframe
              src={`https://vidsrc-embed.ru/embed/movie/${movieId}`}
              title={`${movie.title} - Main Stream`}
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

        {/* Minimal Movie Info Panel */}
        <div className="w-full flex items-center justify-between text-sm text-gray-400 px-1 mt-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left">
            <h2 className="text-base font-bold text-white leading-none">{movie.title}</h2>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>{movie.release_date?.split('-')[0]}</span>
            {movie.runtime && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span>{movie.runtime} min</span>
              </>
            )}
            {movie.vote_average !== undefined && movie.vote_average > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <RiStarFill className="w-3.5 h-3.5" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </span>
              </>
            )}
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-gray-300">
              {movie.genres.slice(0, 3).map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
