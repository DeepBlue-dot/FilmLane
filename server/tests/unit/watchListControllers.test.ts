jest.mock('../../src/config/db.js', () => ({
  watchlistItem: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../src/services/queryParser.js', () => ({
  parsePrismaQuery: jest.fn().mockReturnValue({
    skip: 0,
    take: 25,
    where: {},
    orderBy: {},
    select: undefined, // test findMany mapping
  }),
}));

import prisma from '../../src/config/db.js';
import {
  getWatchListByUserId,
  getUserWatchList,
  getUserWatchItem,
  getWatchItemById,
  addWatchListItem,
  deleteUserWatchItem,
  deleteWatchItemById,
} from '../../src/controllers/watchListControllers.js';

const createReq = (overrides = {}) => ({ userId: undefined, params: {}, query: {}, body: {}, ...overrides });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('watchListControllers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWatchListByUserId', () => {
    test('successfully retrieves watchlist for a specific userId parameter', async () => {
      const mockList = [{ id: 'w1', tmdbId: 101, mediaType: 'MOVIE' }];
      (prisma.watchlistItem.findMany as jest.Mock).mockResolvedValue(mockList);

      const req = createReq({ params: { userId: 'u1' } });
      const res = createRes();

      await getWatchListByUserId(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.findMany).toHaveBeenCalledWith({
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
        data: mockList,
      });
    });
  });

  describe('getUserWatchList', () => {
    test('successfully retrieves current authenticated user watchlist', async () => {
      const mockList = [{ id: 'w2', tmdbId: 202, mediaType: 'SERIES' }];
      (prisma.watchlistItem.findMany as jest.Mock).mockResolvedValue(mockList);

      const req = createReq({ userId: 'u1' });
      const res = createRes();

      await getUserWatchList(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.findMany).toHaveBeenCalledWith({
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
        data: mockList,
      });
    });
  });

  describe('getUserWatchItem', () => {
    test('successfully retrieves a specific watchlist item for the current user', async () => {
      const mockItem = { id: 'w1', tmdbId: 101, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchlistItem.findUnique as jest.Mock).mockResolvedValue(mockItem);

      const req = createReq({ userId: 'u1', params: { ItemId: 'w1' } });
      const res = createRes();

      await getUserWatchItem(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u1', id: 'w1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { wacthList: mockItem },
      });
    });
  });

  describe('getWatchItemById', () => {
    test('successfully retrieves a specific watchlist item by userId and item ID parameter', async () => {
      const mockItem = { id: 'w2', tmdbId: 202, mediaType: 'SERIES', userId: 'u2' };
      (prisma.watchlistItem.findUnique as jest.Mock).mockResolvedValue(mockItem);

      const req = createReq({ params: { userId: 'u2', ItemId: 'w2' } });
      const res = createRes();

      await getWatchItemById(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u2', id: 'w2' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { wacthList: mockItem },
      });
    });
  });

  describe('addWatchListItem', () => {
    test('successfully creates a new watchlist item for user', async () => {
      const mockNewItem = { id: 'w3', tmdbId: 303, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchlistItem.create as jest.Mock).mockResolvedValue(mockNewItem);

      const req = createReq({
        userId: 'u1',
        body: { tmdbId: '303', mediaType: 'MOVIE' },
      });
      const res = createRes();

      await addWatchListItem(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.create).toHaveBeenCalledWith({
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

  describe('deleteUserWatchItem', () => {
    test('successfully deletes a watchlist item for current user', async () => {
      const mockDeletedItem = { id: 'w1', tmdbId: 101, mediaType: 'MOVIE', userId: 'u1' };
      (prisma.watchlistItem.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const req = createReq({ userId: 'u1', params: { ItemId: 'w1' } });
      const res = createRes();

      await deleteUserWatchItem(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.delete).toHaveBeenCalledWith({
        where: { userId: 'u1', id: 'w1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });
  });

  describe('deleteWatchItemById', () => {
    test('successfully deletes a watchlist item by userId and item ID parameter', async () => {
      const mockDeletedItem = { id: 'w2', tmdbId: 202, mediaType: 'SERIES', userId: 'u2' };
      (prisma.watchlistItem.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const req = createReq({ params: { userId: 'u2', ItemId: 'w2' } });
      const res = createRes();

      await deleteWatchItemById(req as any, res as any, jest.fn());

      expect(prisma.watchlistItem.delete).toHaveBeenCalledWith({
        where: { userId: 'u2', id: 'w2' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });
  });
});
