import OMDBService from '../../src/services/omdbService.js';
import TMDBService from '../../src/services/tmdbService.js';

describe('OMDBService & TMDB Backup', () => {
    let omdbService: OMDBService;

    beforeEach(() => {
        omdbService = new OMDBService({ apiKey: '1a30fa3a' });
    });

    test('should fetch movie details by ID from OMDb', async () => {
        const details = await omdbService.getMovieDetails(3896198); // tt3896198 (Guardians of the Galaxy Vol 2)
        expect(details).toBeDefined();
        expect(details.title).toContain('Guardians of the Galaxy');
        expect(details.id).toBe(3896198);
        expect(details.vote_average).toBeGreaterThan(0);
    });

    test('should search movies on OMDb', async () => {
        const res = await omdbService.searchMovie({ query: 'Batman', page: 1 });
        expect(res).toBeDefined();
        expect(res.results.length).toBeGreaterThan(0);
        expect(res.results[0].title.toLowerCase()).toContain('batman');
    });

    test('should fall back to OMDb when TMDB request fails', async () => {
        // TMDB instance initialized with invalid API key to trigger fallback
        const tmdbService = new TMDBService({ apiKey: 'invalid_key', authMode: 'query' });
        const details = await tmdbService.getMovieDetails(3896198);
        expect(details).toBeDefined();
        expect(details.title).toContain('Guardians of the Galaxy');
    });
});
