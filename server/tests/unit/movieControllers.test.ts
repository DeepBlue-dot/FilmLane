jest.mock('../../src/services/tmdbService.js');
jest.mock('../../src/config/db.js', () => ({ }));

import TMDBService from '../../src/services/tmdbService.js';
import {
  getMovieDetails,
  getTvShowDetails,
  getTvSeasonDetails,
  getTvEpisodeDetails,
  getMoviesGenreList,
  getMoviesGenreName,
  getTvShowGenreList,
  getTvShowGenreName,
  discoverMovies,
  discoverTvShows,
  searchMovie,
  searchAll,
  searchTVShows,
  getCountriesList,
  getLanguagesList,
  getTVSimilar,
  getTVRecommendations,
  searchPerson,
  getPersonDetails,
} from '../../src/controllers/movieControllers.js';

const createReq = (overrides = {}) => ({ params: {}, query: {}, body: {}, ...overrides });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('movieControllers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMovieDetails sends movie from TMDBService', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 1, title: 'Unit Movie' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getMovieDetails: mock }));

    const req: any = createReq({ params: { movieId: '1' }, query: {} });
    const res: any = createRes();

    await getMovieDetails(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(1, { appendToResponse: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ movie: { id: 1, title: 'Unit Movie' } });
  });

  test('getTvShowDetails sends show details', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 2, name: 'TV Show' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVShowDetails: mock }));

    const req: any = createReq({ params: { series_id: '2' } });
    const res: any = createRes();

    await getTvShowDetails(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(2, { appendToResponse: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ movie: { id: 2, name: 'TV Show' } });
  });

  test('getTvSeasonDetails sends season details', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 3, name: 'Season 1' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVSeasonsDetails: mock }));

    const req: any = createReq({ params: { series_id: '2', season_number: '1' } });
    const res: any = createRes();

    await getTvSeasonDetails(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(2, 1, { appendToResponse: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ movie: { id: 3, name: 'Season 1' } });
  });

  test('getTvEpisodeDetails sends episode details', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 4, name: 'Episode 1' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVEpisodesDetails: mock }));

    const req: any = createReq({ params: { series_id: '2', season_number: '1', episode_number: '3' } });
    const res: any = createRes();

    await getTvEpisodeDetails(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(2, 1, 3, { appendToResponse: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ movie: { id: 4, name: 'Episode 1' } });
  });

  test('getMoviesGenreList returns list of genres', async () => {
    const mock = jest.fn().mockResolvedValue({ genres: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getMoviesGenreList: mock }));

    const req: any = createReq();
    const res: any = createRes();

    await getMoviesGenreList(req, res, jest.fn());

    expect(mock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ genres: [] });
  });

  test('getMoviesGenreName returns genre name', async () => {
    const mock = jest.fn().mockResolvedValue('Action');
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getMoviesGenreName: mock }));

    const req: any = createReq({ params: { genreId: '28' } });
    const res: any = createRes();

    await getMoviesGenreName(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(28);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Action');
  });

  test('getTvShowGenreList returns tv genres', async () => {
    const mock = jest.fn().mockResolvedValue({ genres: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVShowGenreList: mock }));

    const req: any = createReq();
    const res: any = createRes();

    await getTvShowGenreList(req, res, jest.fn());

    expect(mock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ genres: [] });
  });

  test('getTvShowGenreName returns tv genre name', async () => {
    const mock = jest.fn().mockResolvedValue('Sci-Fi');
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVShowGenreName: mock }));

    const req: any = createReq({ params: { genreId: '10765' } });
    const res: any = createRes();

    await getTvShowGenreName(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(10765);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Sci-Fi');
  });

  test('discoverMovies returns discovered movies', async () => {
    const mock = jest.fn().mockResolvedValue({ results: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ discoverMovies: mock }));

    const req: any = createReq({ query: { page: '1' } });
    const res: any = createRes();

    await discoverMovies(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({ page: '1' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('discoverTvShows returns discovered tv shows', async () => {
    const mock = jest.fn().mockResolvedValue({ results: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ discoverTvShows: mock }));

    const req: any = createReq({ query: { page: '2' } });
    const res: any = createRes();

    await discoverTvShows(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({ page: '2' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('searchMovie returns matching movies', async () => {
    const mock = jest.fn().mockResolvedValue({ results: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchMovie: mock }));

    const req: any = createReq({ query: { query: 'test', page: '1' } });
    const res: any = createRes();

    await searchMovie(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({
      query: 'test',
      page: 1,
      primary_release_year: undefined,
      region: undefined,
      year: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('searchTVShows returns matching tv shows', async () => {
    const mock = jest.fn().mockResolvedValue({ results: [] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchTVShows: mock }));

    const req: any = createReq({ query: { query: 'show', page: '1' } });
    const res: any = createRes();

    await searchTVShows(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({
      query: 'show',
      page: 1,
      first_air_date_year: undefined,
      year: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('getCountriesList returns list of countries', async () => {
    const mock = jest.fn().mockResolvedValue([]);
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getCountriesList: mock }));

    const req: any = createReq();
    const res: any = createRes();

    await getCountriesList(req, res, jest.fn());

    expect(mock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('getLanguagesList returns list of languages', async () => {
    const mock = jest.fn().mockResolvedValue([]);
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getLanguagesList: mock }));

    const req: any = createReq();
    const res: any = createRes();

    await getLanguagesList(req, res, jest.fn());

    expect(mock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('getTVSimilar returns paginated similar shows', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 10, name: 'Similar' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVSimilar: mock }));

    const req: any = createReq({ params: { series_id: '5' }, query: { page: '1' } });
    const res: any = createRes();

    await getTVSimilar(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(5, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 10, name: 'Similar' }] });
  });

  test('getTVRecommendations returns recommendations', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 20, name: 'Rec' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVRecommendations: mock }));

    const req: any = createReq({ params: { series_id: '7' }, query: { page: '2' } });
    const res: any = createRes();

    await getTVRecommendations(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(7, 2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 20, name: 'Rec' }] });
  });

  test('searchPerson calls TMDBService.searchPerson', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 3, name: 'Actor' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchPerson: mock }));

    const req: any = createReq({ query: { query: 'actor', page: '1' } });
    const res: any = createRes();

    await searchPerson(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({ query: 'actor', page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 3, name: 'Actor' }] });
  });

  test('getPersonDetails calls TMDBService.getPersonDetails', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 42, name: 'Person' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getPersonDetails: mock }));

    const req: any = createReq({ params: { id: '42' } });
    const res: any = createRes();

    await getPersonDetails(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 42, name: 'Person' });
  });

  test('searchAll calls TMDBService.searchAll', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 90, media_type: 'movie' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchAll: mock }));

    const req: any = createReq({ query: { query: 'x', page: '1' } });
    const res: any = createRes();

    await searchAll(req, res, jest.fn());

    expect(mock).toHaveBeenCalledWith({ query: 'x', page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 90, media_type: 'movie' }] });
  });
});
