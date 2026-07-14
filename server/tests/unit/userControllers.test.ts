jest.mock('../../src/config/db.js', () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../src/services/queryParser.js', () => ({
  parsePrismaQuery: jest.fn().mockReturnValue({
    skip: 0,
    take: 25,
    where: {},
    orderBy: {},
    select: { id: true, email: true, username: true },
  }),
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

import prisma from '../../src/config/db.js';
import bcrypt from 'bcryptjs';
import {
  getUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteUserById,
} from '../../src/controllers/userControllers.js';

const createReq = (overrides = {}) => ({ userId: undefined, params: {}, query: {}, body: {}, ...overrides });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('userControllers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    test('successfully retrieves current user info', async () => {
      const mockUser = { id: 'u1', email: 'u1@ex.com', username: 'u1' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const req = createReq({ userId: 'u1' });
      const res = createRes();

      await getUser(req as any, res as any, jest.fn());

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUser },
      });
    });
  });

  describe('getUserById', () => {
    test('successfully retrieves user info by parameter id', async () => {
      const mockUser = { id: 'u2', email: 'u2@ex.com', username: 'u2' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const req = createReq({ params: { id: 'u2' } });
      const res = createRes();

      await getUserById(req as any, res as any, jest.fn());

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u2' },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUser },
      });
    });
  });

  describe('getAllUsers', () => {
    test('retrieves paginated list of users', async () => {
      const mockUsers = [
        { id: 'u1', email: 'u1@ex.com', username: 'u1' },
        { id: 'u2', email: 'u2@ex.com', username: 'u2' },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const req = createReq({ query: { page: '1', limit: '10' } });
      const res = createRes();

      await getAllUsers(req as any, res as any, jest.fn());

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 25,
        where: {},
        orderBy: {},
        select: { id: true, email: true, username: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        length: 2,
        page: '1',
        data: { users: mockUsers },
      });
    });
  });

  describe('updateUser', () => {
    test('successfully updates user details including password hashing', async () => {
      const mockUpdatedUser = { id: 'u1', email: 'u1@ex.com', username: 'u1_updated' };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const req = createReq({
        userId: 'u1',
        body: {
          username: 'u1_updated',
          password: 'new_password',
          confirmPassword: 'new_password',
          oldPassword: 'old_password',
        },
      });
      const res = createRes();

      const next = jest.fn((err) => { if (err) console.error('updateUser Error:', err); });
      await updateUser(req as any, res as any, next);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 'salt');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: {
          username: 'u1_updated',
          passwordHash: 'hashed_password',
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUpdatedUser },
      });
    });
  });

  describe('deleteUser', () => {
    test('successfully deletes current user and logs them out', async () => {
      const req = createReq({ userId: 'u1' });
      const res = createRes();

      await deleteUser(req as any, res as any, jest.fn());

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'u1' },
      });
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'loggedout', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('deleteUserById', () => {
    test('successfully deletes user by id parameter and logs them out', async () => {
      const req = createReq({ params: { id: 'u2' } });
      const res = createRes();

      await deleteUserById(req as any, res as any, jest.fn());

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'u2' },
      });
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'loggedout', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
