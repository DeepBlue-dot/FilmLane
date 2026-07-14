// Global test setup for Jest
process.env.TMDB_API_KEY = process.env.TMDB_API_KEY || 'test_tmdb_key';

// Silence console during tests (optional)
// const originalConsoleError = console.error;
// beforeAll(() => { console.error = () => {} });
// afterAll(() => { console.error = originalConsoleError });

export {};
