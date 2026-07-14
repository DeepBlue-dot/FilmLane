import request from 'supertest';

// Mock axios before importing the app so TMDBService uses the mocked axios
jest.mock('axios', () => {
  return {
    isAxiosError: (e: any) => false,
    create: () => ({
      get: jest.fn((url: string) => {
        if (url.includes('/movie/')) {
          return Promise.resolve({ data: { id: 1, title: 'Mock Movie' } });
        }
        if (url.includes('/tv/') && url.includes('/similar')) {
          return Promise.resolve({ data: { page: 1, results: [{ id: 100, name: 'Similar Show' }] } });
        }
        if (url.includes('/search/person')) {
          return Promise.resolve({ data: { page: 1, results: [{ id: 10, name: 'Actor One' }] } });
        }
        if (url.includes('/search/multi')) {
          return Promise.resolve({ data: { page: 1, results: [{ id: 200, media_type: 'movie' }] } });
        }
        return Promise.resolve({ data: {} });
      })
    })
  };
});

import app from '../../src/app';

describe('Integration: movie routes', () => {
  test('GET /api/movie/:movieId returns movie details', async () => {
    const res = await request(app).get('/api/movie/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('movie');
    expect(res.body.movie).toHaveProperty('id', 1);
  });

  test('GET /api/tv/:series_id/similar returns similar shows', async () => {
    const res = await request(app).get('/api/tv/1/similar');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page');
    expect(res.body.results).toBeDefined();
  });

  test('GET /api/search/person returns person results', async () => {
    const res = await request(app).get('/api/search/person').query({ query: 'actor' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page');
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test('GET /api/search/multi returns multi search results', async () => {
    const res = await request(app).get('/api/search/multi').query({ query: 'test' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page');
    expect(Array.isArray(res.body.results)).toBe(true);
  });
});
