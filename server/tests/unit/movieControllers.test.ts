jest.mock('../../src/services/tmdbService.js');
jest.mock('../../src/config/db.js', () => ({ }));

import TMDBService from '../../src/services/tmdbService.js';
import { getMovieDetails, getTVSimilar, getTVRecommendations, searchPerson, getPersonDetails, searchAll } from '../../src/controllers/movieControllers.js';

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
    const mockGetMovieDetails = jest.fn().mockResolvedValue({ id: 1, title: 'Unit Movie' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getMovieDetails: mockGetMovieDetails }));

    const req: any = createReq({ params: { movieId: '1' }, query: {} });
    const res: any = createRes();
    const next = jest.fn();

    await getMovieDetails(req, res, next);

    expect(mockGetMovieDetails).toHaveBeenCalledWith(1, { appendToResponse: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ movie: { id: 1, title: 'Unit Movie' } });
  });

  test('getTVSimilar returns paginated similar shows', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 10, name: 'Similar' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVSimilar: mock }));

    const req: any = createReq({ params: { series_id: '5' }, query: { page: '1' } });
    const res: any = createRes();
    const next = jest.fn();

    await getTVSimilar(req, res, next);

    expect(mock).toHaveBeenCalledWith(5, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 10, name: 'Similar' }] });
  });

  test('getTVRecommendations returns recommendations', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 20, name: 'Rec' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getTVRecommendations: mock }));

    const req: any = createReq({ params: { series_id: '7' }, query: { page: '2' } });
    const res: any = createRes();
    const next = jest.fn();

    await getTVRecommendations(req, res, next);

    expect(mock).toHaveBeenCalledWith(7, 2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 20, name: 'Rec' }] });
  });

  test('searchPerson calls TMDBService.searchPerson', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 3, name: 'Actor' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchPerson: mock }));

    const req: any = createReq({ query: { query: 'actor', page: '1' } });
    const res: any = createRes();
    const next = jest.fn();

    await searchPerson(req, res, next);

    expect(mock).toHaveBeenCalledWith({ query: 'actor', page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 3, name: 'Actor' }] });
  });

  test('getPersonDetails calls TMDBService.getPersonDetails', async () => {
    const mock = jest.fn().mockResolvedValue({ id: 42, name: 'Person' });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ getPersonDetails: mock }));

    const req: any = createReq({ params: { id: '42' } });
    const res: any = createRes();
    const next = jest.fn();

    await getPersonDetails(req, res, next);

    expect(mock).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 42, name: 'Person' });
  });

  test('searchAll calls TMDBService.searchAll', async () => {
    const mock = jest.fn().mockResolvedValue({ page: 1, results: [{ id: 90, media_type: 'movie' }] });
    (TMDBService as unknown as jest.Mock).mockImplementation(() => ({ searchAll: mock }));

    const req: any = createReq({ query: { query: 'x', page: '1' } });
    const res: any = createRes();
    const next = jest.fn();

    await searchAll(req, res, next);

    expect(mock).toHaveBeenCalledWith({ query: 'x', page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ page: 1, results: [{ id: 90, media_type: 'movie' }] });
  });
});
