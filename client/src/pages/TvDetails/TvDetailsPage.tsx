import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useWatchlist } from '../../hooks/useWatchlist.js';
import { useAuth } from '../../context/AuthContext.js';
import { MediaCarousel } from '../../components/features/MediaCarousel.js';
import { Skeleton } from '../../components/ui/skeleton.js';
import { Badge } from '../../components/ui/badge.js';
import { RiPlayFill, RiHeartLine, RiHeartFill, RiStarFill, RiTimeLine, RiCalendarLine } from 'react-icons/ri';
import { MediaDetails, VideoResult, Genre, Episode } from '../../types/media.js';

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

interface CastMember {
  id: number;
  name: string;
  character?: string;
  roles?: { character: string }[];
  profile_path: string | null;
}

export default function TvDetailsPage() {
  const { tvId, season_number } = useParams<{ tvId: string; season_number?: string }>();
  const navigate = useNavigate();

  const [series, setSeries] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Season and Episode States
  const [activeSeasonNum, setActiveSeasonNum] = useState<number>(season_number ? parseInt(season_number, 10) : 1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodesError, setEpisodesError] = useState<string | null>(null);

  const { watchlistIds, toggleWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const [lastWatched, setLastWatched] = useState<{ season: number; episode: number } | null>(null);

  // Fetch watch history to check if the user has watched this series before
  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!isAuthenticated || !tvId) return;
      try {
        const historyRes = await api.get('/users/me/watch-history');
        const historyItems = historyRes.data?.data || [];
        const matchingRecord = historyItems.find(
          (item: any) => item.tmdbId === parseInt(tvId, 10) && item.mediaType === 'SERIES'
        );
        if (matchingRecord && matchingRecord.season !== null && matchingRecord.episode !== null) {
          setLastWatched({
            season: matchingRecord.season,
            episode: matchingRecord.episode,
          });
        }
      } catch (err) {
        console.error('Error fetching watch history in TV details', err);
      }
    };

    fetchWatchHistory();
  }, [tvId, isAuthenticated]);

  // Fetch Series Details
  useEffect(() => {
    const fetchSeriesDetails = async () => {
      if (!tvId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/tv/${tvId}`, {
          params: { appendToResponse: 'credits,videos,recommendations' },
        });
        if (response.data?.movie) {
          setSeries(response.data.movie);
        } else {
          setSeries(response.data);
        }
      } catch (err) {
        console.error('Error fetching TV details', err);
        setError('Failed to load TV series details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesDetails();
  }, [tvId]);

  // Sync state with URL parameter if it changes
  useEffect(() => {
    if (season_number) {
      setActiveSeasonNum(parseInt(season_number, 10));
    }
  }, [season_number]);

  // Fetch Episodes when Active Season changes
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!tvId) return;
      setEpisodesLoading(true);
      setEpisodesError(null);
      try {
        const response = await api.get(`/tv/${tvId}/season/${activeSeasonNum}`);
        const data = response.data?.movie || response.data;
        if (data && data.episodes) {
          setSeasonEpisodes(data.episodes);
        } else {
          setSeasonEpisodes([]);
        }
      } catch (err) {
        console.error('Error fetching season details', err);
        setEpisodesError('Failed to load episodes for this season.');
      } finally {
        setEpisodesLoading(false);
      }
    };

    if (series) {
      fetchEpisodes();
    }
  }, [tvId, activeSeasonNum, series]);

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

  if (error || !series) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-red-400">
        {error || 'TV series details not found.'}
      </div>
    );
  }

  const isBookmarked = watchlistIds.includes(series.id);
  const rating = series.vote_average ? series.vote_average.toFixed(1) : 'N/A';
  const releaseYear = series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A';
  
  // Get representative runtime
  const duration = series.episode_run_time && series.episode_run_time.length > 0 ? `${series.episode_run_time[0]} min` : 'N/A';

  const backdropUrl = series.backdrop_path
    ? `https://image.tmdb.org/t/p/original${series.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

  const posterUrl = series.poster_path
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=342&auto=format&fit=crop';

  const trailer = series.videos?.results?.find(
    (video: VideoResult) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  const castList = series.credits?.cast?.slice(0, 10) || [];
  const recommendations = series.recommendations?.results || [];

  // filter seasons to actual show seasons (e.g. Specials Season 0 is optional)
  const seasonsList = series.seasons || [];

  const handleSeasonChange = (num: number) => {
    setActiveSeasonNum(num);
    navigate(`/tv/${tvId}/season/${num}`);
  };

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
            <img src={posterUrl} alt={series.name} className="w-full h-auto object-cover" />
          </div>

          {/* Info Side */}
          <div className="flex-grow space-y-6 text-center md:text-left self-end">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
                {series.name}
              </h1>
              <p className="text-indigo-400 text-sm font-semibold tracking-wider italic">
                {series.tagline}
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
                <span>First Air: {releaseYear}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
                <RiTimeLine className="w-4 h-4 text-indigo-400" />
                <span>{duration}/ep</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
                <span className="text-indigo-400 font-semibold">{series.number_of_seasons} Seasons</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {series.genres?.map((genre: Genre) => (
                <Badge key={genre.id} variant="outline" className="bg-indigo-600/10 border-indigo-500/20 text-indigo-400 px-3 py-1">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {lastWatched && (
                <Link
                  to={`/tv/${series.id}/season/${lastWatched.season}/episode/${lastWatched.episode}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer text-base"
                >
                  <RiPlayFill className="w-5 h-5" />
                  Resume S{lastWatched.season} E{lastWatched.episode}
                </Link>
              )}
              {seasonEpisodes.length > 0 && (
                <Link
                  to={`/tv/${series.id}/season/${activeSeasonNum}/episode/1`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer text-base"
                >
                  <RiPlayFill className="w-5 h-5" />
                  Play Episode 1
                </Link>
              )}
              <button
                onClick={() => toggleWatchlist(series.id, 'tv')}
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
              {series.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${series.imdb_id}`}
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

        {/* Overview & Seasons & Cast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-8 border-t border-gray-900">
          {/* Left Column: Synopsis, Cast, and Seasons/Episodes */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Synopsis</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {series.overview || 'No overview description is available.'}
              </p>
            </div>

            {/* TV Show Cast */}
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
                          <p className="text-[10px] text-gray-500 truncate">
                            {cast.roles && cast.roles.length > 0 ? cast.roles[0].character : cast.character}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seasons & Episodes Selector */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-3 gap-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Seasons & Episodes</h2>
                
                {/* Season Dropdown */}
                <select
                  value={activeSeasonNum}
                  onChange={(e) => handleSeasonChange(parseInt(e.target.value, 10))}
                  className="bg-gray-900/60 border border-gray-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {seasonsList.map((s: Season) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name} ({s.episode_count} Episodes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Episodes List */}
              {episodesError ? (
                <div className="p-4 bg-red-950/20 border border-red-800/30 text-red-400 rounded-xl text-center">
                  {episodesError}
                </div>
              ) : episodesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-900/20 border border-gray-850 rounded-xl">
                      <Skeleton className="w-32 h-20 rounded-lg shrink-0" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : seasonEpisodes.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No episodes loaded for this season.</div>
              ) : (
                <div className="space-y-4">
                  {seasonEpisodes.map((ep: Episode) => {
                    const stillUrl = ep.still_path
                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                      : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop';
                    return (
                      <div key={ep.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900/20 border border-gray-850/60 hover:border-gray-800 hover:bg-gray-900/30 rounded-xl transition-all group">
                        {/* Stills Frame */}
                        <div className="w-full sm:w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-950 border border-gray-850 relative">
                          <img src={stillUrl} alt={ep.name} className="w-full h-full object-cover" />
                          <Link
                            to={`/tv/${tvId}/season/${activeSeasonNum}/episode/${ep.episode_number}`}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <span className="p-2 rounded-full bg-indigo-600 scale-90 group-hover:scale-100 transition-all">
                              <RiPlayFill className="w-5 h-5" />
                            </span>
                          </Link>
                        </div>

                        {/* Summary details */}
                        <div className="flex-grow space-y-1.5 self-center">
                          <div className="flex items-center justify-between gap-4">
                            <Link
                              to={`/tv/${tvId}/season/${activeSeasonNum}/episode/${ep.episode_number}`}
                              className="text-base font-bold text-white hover:text-indigo-400 transition-colors"
                            >
                              EP {ep.episode_number}: {ep.name}
                            </Link>
                            <span className="text-xs text-gray-500 shrink-0 font-medium">
                              {ep.air_date || 'N/A'}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                            {ep.overview || 'No episode summary description is available.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
                    title="TV Show Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Sidebar Details Info */}
            <div className="bg-gray-900/30 border border-gray-850 rounded-2xl p-5 space-y-4 text-sm">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-gray-900 pb-2">
                Series Info
              </h2>
              {series.status && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-white font-medium">{series.status}</span>
                </div>
              )}
              {series.number_of_seasons && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Seasons</span>
                  <span className="text-white font-medium">{series.number_of_seasons}</span>
                </div>
              )}
              {series.number_of_episodes && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Episodes</span>
                  <span className="text-white font-medium">{series.number_of_episodes}</span>
                </div>
              )}
              {series.original_language && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="text-white font-medium uppercase">{series.original_language}</span>
                </div>
              )}
              {series.networks && series.networks.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className="text-white font-medium">{series.networks[0]?.name}</span>
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
            type="tv"
            bookmarks={watchlistIds}
            onBookmarkToggle={(id, type) => toggleWatchlist(id, type)}
          />
        </div>
      )}
    </div>
  );
}
