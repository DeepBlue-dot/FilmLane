jest.mock('../../src/config/db.js', () => ({
  watchHistory: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

jest.mock('../../src/services/queryParser.js', () => ({
  parsePrismaQuery: jest.fn().mockReturnValue({
    skip: 0,
    take: 25,
    where: {},
    orderBy: {},
    select: undefined,
  }),
}));

import prisma from '../../src/config/db.js';
import {
  getWatchHistoryByUserId,
  getUserWatchHistory,
  getUserHistoryItem,
  getHistoryById,
  addWatchHistoryItem,
  deleteUserHistoryItem,
  clearUserWatchHistory,
  deleteHistoryItemById,
} from '../../src/controllers/watchHistoryControllers.js';

const createReq = (overrides = {}) => ({ userId: undefined, params: {}, query: {}, body: {}, ...overrides });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('watchHistoryControllers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWatchHistoryByUserId', () => {
    test('successfully retrieves watch history for a specific userId parameter', async () => {
      const mockHistory = [{ id: 'h1', tmdbId: 101, mediaType: 'MOVIE' }];
      (prisma.watchHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

      const req = createReq({ params: { userId: 'u1' } });
      const res = createRes();

      await getWatchHistoryByUserId(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        skip: 0,
        take: 25,
        orderBy: {},
        select: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        length: 1,
        data: mockHistory,
      });
    });
  });

  describe('getUserWatchHistory', () => {
    test('successfully retrieves current authenticated user watch history', async () => {
      const mockHistory = [{ id: 'h2', tmdbId: 202, mediaType: 'SERIES' }];
      (prisma.watchHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

      const req = createReq({ userId: 'u1' });
      const res = createRes();

      await getUserWatchHistory(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        skip: 0,
        take: 25,
        orderBy: {},
        select: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        length: 1,
        data: mockHistory,
      });
    });
  });

  describe('getUserHistoryItem', () => {
    test('successfully retrieves a specific watch history item for the current user', async () => {
      const mockItem = { id: 'h1', tmdbId: 101, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchHistory.findUnique as jest.Mock).mockResolvedValue(mockItem);

      const req = createReq({ userId: 'u1', params: { ItemId: 'h1' } });
      const res = createRes();

      await getUserHistoryItem(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u1', id: 'h1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { watchHistory: mockItem },
      });
    });
  });

  describe('getHistoryById', () => {
    test('successfully retrieves a specific watch history item by userId and item ID parameter', async () => {
      const mockItem = { id: 'h2', tmdbId: 202, mediaType: 'SERIES', userId: 'u2' };
      (prisma.watchHistory.findUnique as jest.Mock).mockResolvedValue(mockItem);

      const req = createReq({ params: { userId: 'u2', ItemId: 'h2' } });
      const res = createRes();

      await getHistoryById(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u2', id: 'h2' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { watchHistory: mockItem },
      });
    });
  });

  describe('addWatchHistoryItem', () => {
    test('successfully creates a new watch history item for user', async () => {
      const mockNewItem = { id: 'h3', tmdbId: 303, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchHistory.create as jest.Mock).mockResolvedValue(mockNewItem);

      const req = createReq({
        userId: 'u1',
        body: { tmdbId: '303', mediaType: 'MOVIE' },
      });
      const res = createRes();

      await addWatchHistoryItem(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.create).toHaveBeenCalledWith({
        data: {
          tmdbId: 303,
          userId: 'u1',
          mediaType: 'MOVIE',
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { newItem: mockNewItem },
      });
    });
  });

  describe('deleteUserHistoryItem', () => {
    test('successfully deletes a watch history item for current user', async () => {
      const mockDeletedItem = { id: 'h1', tmdbId: 101, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchHistory.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const req = createReq({ userId: 'u1', params: { ItemId: 'h1' } });
      const res = createRes();

      await deleteUserHistoryItem(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.delete).toHaveBeenCalledWith({
        where: { userId: 'u1', id: 'h1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });
  });

  describe('clearUserWatchHistory', () => {
    test('successfully clears all watch history items for current user', async () => {
      (prisma.watchHistory.deleteMany as jest.Mock).mockResolvedValue({ count: 5 });

      const req = createReq({ userId: 'u1' });
      const res = createRes();

      await clearUserWatchHistory(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });
  });

  describe('deleteHistoryItemById', () => {
    test('successfully deletes a watch history item by userId and item ID parameter', async () => {
      const mockDeletedItem = { id: 'h2', tmdbId: 202, mediaType: 'SERIES', userId: 'u2' };
      (prisma.watchHistory.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const req = createReq({ params: { userId: 'u2', ItemId: 'h2' } });
      const res = createRes();

      await deleteHistoryItemById(req as any, res as any, jest.fn());

      expect(prisma.watchHistory.delete).toHaveBeenCalledWith({
        where: { userId: 'u2', id: 'h2' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });
  });
});
