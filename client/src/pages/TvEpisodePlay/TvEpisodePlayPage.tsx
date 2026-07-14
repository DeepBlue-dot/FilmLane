import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { RiArrowLeftLine, RiMovie2Line, RiArrowRightLine, RiStarFill, RiCalendarLine, RiPlayMiniFill } from 'react-icons/ri';
import { MediaDetails, VideoResult, Episode, Season } from '../../types/media.js';

type EpisodePlayDetails = Episode & {
  videos?: {
    results: VideoResult[];
  };
};

export default function TvEpisodePlayPage() {
  const { tvId, season_number, episode_number } = useParams<{ tvId: string; season_number: string; episode_number: string }>();
  const navigate = useNavigate();

  const [series, setSeries] = useState<MediaDetails | null>(null);
  const [episode, setEpisode] = useState<EpisodePlayDetails | null>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchRecorded, setWatchRecorded] = useState(false);
  const [activeSource, setActiveSource] = useState<'stream' | 'trailer'>('stream');

  const activeSeason = parseInt(season_number || '1', 10);
  const activeEpisode = parseInt(episode_number || '1', 10);

  // Fetch Series, Episode, and Season details
  useEffect(() => {
    const fetchTvPlaybackData = async () => {
      if (!tvId || !season_number || !episode_number) return;
      setLoading(true);
      setError(null);
      try {
        const [seriesRes, episodeRes, seasonRes] = await Promise.all([
          api.get(`/tv/${tvId}`, { params: { appendToResponse: 'videos' } }),
          api.get(`/tv/${tvId}/season/${season_number}/episode/${episode_number}`, {
            params: { appendToResponse: 'videos' },
          }),
          api.get(`/tv/${tvId}/season/${season_number}`),
        ]);

        const seriesData = seriesRes.data?.movie || seriesRes.data;
        const episodeData = episodeRes.data?.movie || episodeRes.data;
        const seasonData = seasonRes.data?.episodes || seasonRes.data?.movie?.episodes || [];

        setSeries(seriesData);
        setEpisode(episodeData);
        setSeasonEpisodes(seasonData);

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

  // Find trailer key
  const trailer = episode.videos?.results?.find(
    (video: VideoResult) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Clip')
  ) || series.videos?.results?.find(
    (video: VideoResult) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  const currentSeasonMeta = series.seasons?.find((s: Season) => s.season_number === activeSeason);
  const totalEpisodesInSeason = currentSeasonMeta ? currentSeasonMeta.episode_count : seasonEpisodes.length;
  const hasNextEpisode = activeEpisode < totalEpisodesInSeason;

  const handleNextEpisode = () => {
    if (hasNextEpisode) {
      navigate(`/tv/${tvId}/season/${activeSeason}/episode/${activeEpisode + 1}`);
    }
  };

  const backdropUrl = series.backdrop_path
    ? `https://image.tmdb.org/t/p/original${series.backdrop_path}`
    : '';

  const posterUrl = series.poster_path
    ? `https://image.tmdb.org/t/p/w300${series.poster_path}`
    : '';

  return (
    <div className="min-h-screen text-white flex flex-col justify-between select-none relative">
      {/* Blurred Backdrop image for immersive atmosphere */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={backdropUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-[0.06] blur-2xl scale-110"
          />
        </div>
      )}

      {/* Player Header */}
      <header className="p-4 sm:p-6 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between z-10 relative">
        <button
          onClick={() => navigate(`/tv/${tvId}/season/${activeSeason}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-sm font-semibold transition-all cursor-pointer shadow-lg"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center hidden md:block">
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">
            Season {activeSeason} • Episode {activeEpisode}
          </p>
          <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {series.name} - &ldquo;{episode.name}&rdquo;
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-500 font-extrabold text-sm tracking-wider">
          <RiMovie2Line className="w-6 h-6 animate-pulse" />
          <span>FILMLANE</span>
        </div>
      </header>

      {/* Main Video Section */}
      <main className="flex-grow flex flex-col items-center p-4 md:p-8 z-10 relative space-y-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 w-full max-w-5xl">
          {/* Stream Selector Controls */}
          {trailer && (
            <div className="flex bg-gray-900/90 border border-gray-800 rounded-xl p-1 select-none backdrop-blur-md shadow-lg shadow-black/40">
              <button
                onClick={() => setActiveSource('stream')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeSource === 'stream'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Main Stream
              </button>
              <button
                onClick={() => setActiveSource('trailer')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeSource === 'trailer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
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
                src={`https://vidsrc-embed.ru/embed/tv/${tvId}/${season_number}-${episode_number}`}
                title={`${episode.name} - Main Stream`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : trailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0`}
                title={`${episode.name} - Trailer`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : null}
          </div>
        </div>

        {/* Info & Episode Selector Container */}
        <div className="w-full max-w-5xl flex flex-col gap-8">
          
          {/* Episode metadata Card */}
          <div className="bg-gray-900/40 border border-gray-850 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row gap-6">
            {posterUrl && (
              <img 
                src={posterUrl} 
                alt={series.name}
                className="w-32 h-48 object-cover rounded-xl shadow-lg border border-gray-800 self-center md:self-start flex-shrink-0"
              />
            )}
            
            <div className="flex-grow space-y-4 text-left">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {series.name} - &ldquo;{episode.name}&rdquo;
                  </h2>
                  {episode.vote_average !== undefined && episode.vote_average > 0 && (
                    <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-500/20">
                      <RiStarFill className="w-3.5 h-3.5" />
                      <span>{episode.vote_average.toFixed(1)}</span>
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 font-medium">
                  <span className="text-indigo-400 font-bold uppercase tracking-wider">
                    Season {activeSeason} • Episode {activeEpisode}
                  </span>
                  {episode.air_date && (
                    <span className="flex items-center gap-1">
                      <RiCalendarLine className="w-3.5 h-3.5" />
                      <span>{episode.air_date}</span>
                    </span>
                  )}
                </div>
              </div>

              {episode.overview && (
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Episode Synopsis</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-normal">
                    {episode.overview}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Episode List Quick Selector */}
          {seasonEpisodes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Season {activeSeason} Episodes
                </h3>
                {hasNextEpisode && (
                  <button
                    onClick={handleNextEpisode}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <span>Next Episode</span>
                    <RiArrowRightLine className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                {seasonEpisodes.map((ep) => {
                  const isActive = ep.episode_number === activeEpisode;
                  const epStillUrl = ep.still_path
                    ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop';

                  return (
                    <button
                      key={ep.id}
                      onClick={() => navigate(`/tv/${tvId}/season/${activeSeason}/episode/${ep.episode_number}`)}
                      className={`flex-shrink-0 w-60 text-left rounded-xl overflow-hidden border bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                        isActive 
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' 
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="aspect-video w-full bg-gray-950 relative overflow-hidden">
                        <img 
                          src={epStillUrl} 
                          alt={ep.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="p-2.5 rounded-full bg-indigo-600 text-white shadow-lg">
                            <RiPlayMiniFill className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/85 text-[10px] font-extrabold rounded text-gray-300 uppercase">
                          EP {ep.episode_number}
                        </div>
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                          {ep.name}
                        </h4>
                        {ep.air_date && (
                          <p className="text-[10px] text-gray-500 font-medium">{ep.air_date}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
