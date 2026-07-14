import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftLine, RiMovie2Line, RiFullscreenLine, RiVolumeUpLine, RiPlayMiniFill, RiPauseMiniFill, RiArrowRightLine } from 'react-icons/ri';

export default function TvEpisodePlayPage() {
  const { tvId, season_number, episode_number } = useParams<{ tvId: string; season_number: string; episode_number: string }>();
  const navigate = useNavigate();

  const [series, setSeries] = useState<any>(null);
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchRecorded, setWatchRecorded] = useState(false);

  // Video control
  const [isPlaying, setIsPlaying] = useState(true);

  const activeSeason = parseInt(season_number || '1', 10);
  const activeEpisode = parseInt(episode_number || '1', 10);

  // Fetch Series & Episode details
  useEffect(() => {
    const fetchTvPlaybackData = async () => {
      if (!tvId || !season_number || !episode_number) return;
      setLoading(true);
      setError(null);
      try {
        const [seriesRes, episodeRes] = await Promise.all([
          api.get(`/tv/${tvId}`, { params: { appendToResponse: 'videos' } }),
          api.get(`/tv/${tvId}/season/${season_number}/episode/${episode_number}`, {
            params: { appendToResponse: 'videos' },
          }),
        ]);

        const seriesData = seriesRes.data?.movie || seriesRes.data;
        const episodeData = episodeRes.data?.movie || episodeRes.data;

        setSeries(seriesData);
        setEpisode(episodeData);

        // Auto-record watch history
        if (!watchRecorded) {
          try {
            await api.post('/users/me/watch-history', {
              tmdbId: seriesData.id.toString(),
              mediaType: 'SERIES',
            });
            setWatchRecorded(true);
          } catch (histErr) {
            console.log('Watch history record skipped or exists', histErr);
          }
        }
      } catch (err) {
        console.error('Error fetching TV playback details', err);
        setError('Unable to load episode player. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTvPlaybackData();
  }, [tvId, season_number, episode_number, watchRecorded]);

  // Reset history tracker when navigating to a different episode
  useEffect(() => {
    setWatchRecorded(false);
  }, [episode_number, season_number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto" />
          <p className="text-gray-400 text-sm animate-pulse">Loading episode stream...</p>
        </div>
      </div>
    );
  }

  if (error || !series || !episode) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center space-y-4">
        <p className="text-red-400 text-lg">{error || 'Episode details could not be loaded.'}</p>
        <Link to={`/tv/${tvId}`} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold">
          Return to Series
        </Link>
      </div>
    );
  }

  // Find trailer key (fallback to series trailer if episode has no specific trailer clip)
  const trailer = episode.videos?.results?.find(
    (video: any) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Clip')
  ) || series.videos?.results?.find(
    (video: any) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  // Check if next episode exists (look at series object season configuration)
  const currentSeasonMeta = series.seasons?.find((s: any) => s.season_number === activeSeason);
  const totalEpisodesInSeason = currentSeasonMeta ? currentSeasonMeta.episode_count : 99;
  const hasNextEpisode = activeEpisode < totalEpisodesInSeason;

  const handleNextEpisode = () => {
    if (hasNextEpisode) {
      navigate(`/tv/${tvId}/season/${activeSeason}/episode/${activeEpisode + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between select-none">
      {/* Player Header */}
      <header className="p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <button
          onClick={() => navigate(`/tv/${tvId}/season/${activeSeason}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 text-sm font-semibold transition-all cursor-pointer"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          <span>Back to Series</span>
        </button>

        <div className="text-center">
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">
            Season {activeSeason} • Episode {activeEpisode}
          </p>
          <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {series.name} - &ldquo;{episode.name}&rdquo;
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
            /* YouTube Iframe Player */
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0`}
              title={`${episode.name} - Player`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            /* Fallback HTML5 mock player playing standard clip */
            <div className="relative w-full h-full group">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full h-full object-contain"
                autoPlay={isPlaying}
                loop
                controls
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-end p-2">
                  <span className="px-2.5 py-1 bg-black/60 border border-gray-800 text-[10px] rounded font-bold uppercase tracking-wider text-indigo-400">
                    Mock Episode Stream
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
                    <span className="text-xs text-gray-300">00:00 / 45:12</span>
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

      {/* Control panel and Next Episode Button */}
      <div className="flex justify-center p-4 bg-gradient-to-t from-black/80 to-transparent">
        {hasNextEpisode ? (
          <button
            onClick={handleNextEpisode}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
          >
            <span>Next Episode (EP {activeEpisode + 1})</span>
            <RiArrowRightLine className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-gray-600">You have reached the end of the season.</span>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-gray-600">
        <p>Copyright &copy; FilmLane Cinema. Powered by TMDB API. Stream quality auto-negotiated.</p>
      </footer>
    </div>
  );
}
