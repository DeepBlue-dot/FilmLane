import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftLine, RiMovie2Line, RiFullscreenLine, RiVolumeUpLine, RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';

export default function MoviePlayPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchRecorded, setWatchRecorded] = useState(false);

  // Custom player control state (used if no YouTube trailer or if mock playing)
  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch Movie details and trailer
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
            // Silence 409 or history errors so the user session is uninterrupted
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

  // Find trailer video key
  const trailer = movie.videos?.results?.find(
    (video: any) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser' || video.type === 'Clip')
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between select-none">
      {/* Player Header */}
      <header className="p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
        <button
          onClick={() => navigate(`/movies/${movieId}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 text-sm font-semibold transition-all cursor-pointer"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <div className="text-center">
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Now Playing</p>
          <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {movie.title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-500 font-extrabold text-sm tracking-wider">
          <RiMovie2Line className="w-6 h-6" />
          <span>FILMLANE</span>
        </div>
      </header>

      {/* Main Video Frame */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-5xl aspect-video bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-900/40 relative">
          {trailer ? (
            /* YouTube Player Iframe */
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0`}
              title={`${movie.title} - Player`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            /* Custom HTML5 video fallback with royalty free stock media */
            <div className="relative w-full h-full group">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full h-full object-contain"
                autoPlay={isPlaying}
                loop
                controls
              />
              {/* Transport HUD Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-end p-2">
                  <span className="px-2.5 py-1 bg-black/60 border border-gray-800 text-[10px] rounded font-bold uppercase tracking-wider text-indigo-400">
                    Mock Feature Stream
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/60 backdrop-blur border border-gray-800 rounded-xl p-3 pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 text-white hover:text-indigo-400 cursor-pointer"
                    >
                      {isPlaying ? <RiPauseMiniFill className="w-6 h-6" /> : <RiPlayMiniFill className="w-6 h-6" />}
                    </button>
                    <RiVolumeUpLine className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">01:45 / 09:56</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <RiFullscreenLine className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-gray-600 bg-gradient-to-t from-black/80 to-transparent">
        <p>Copyright &copy; FilmLane Cinema. Powered by TMDB API. Stream quality auto-negotiated.</p>
      </footer>
    </div>
  );
}
