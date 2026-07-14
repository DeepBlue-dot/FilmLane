jest.mock('../../src/config/db.js', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
}));

import prisma from '../../src/config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRegester, userLogin, userLogOut } from '../../src/controllers/authControllers.js';

const createReq = (overrides = {}) => ({ body: {}, params: {}, query: {}, cookies: {}, ...overrides });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('authControllers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('userRegester', () => {
    test('successfully registers a user', async () => {
      const mockUser = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const req = createReq({
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = createRes();

      const next = jest.fn((err) => { if (err) console.error('ERROR IN TEST:', err); });
      await userRegester(req as any, res as any, next);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
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
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUser },
      });
    });
  });

  describe('userLogin', () => {
    test('successfully logs in a user with correct credentials', async () => {
      const mockUser = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const req = createReq({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = createRes();

      process.env.JWT_SECRET = 'test_secret';
      await userLogin(req as any, res as any, jest.fn());

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock_token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt,
          },
        },
      });
    });

    test('returns 400 when user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const req = createReq({
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });
      const res = createRes();

      await userLogin(req as any, res as any, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failed',
        message: 'Invalid email or password',
      });
    });

    test('returns 400 when password comparison fails', async () => {
      const mockUser = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = createReq({
        body: {
          email: 'test@example.com',
          password: 'wrong_password',
        },
      });
      const res = createRes();

      await userLogin(req as any, res as any, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failed',
        message: 'Invalid email or password',
      });
    });
  });

  describe('userLogOut', () => {
    test('successfully logs out user by clearing cookie', async () => {
      const req = createReq();
      const res = createRes();

      await userLogOut(req as any, res as any, jest.fn());

      expect(res.cookie).toHaveBeenCalledWith('jwt', 'loggedout', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Logged out successfully',
      });
    });
  });
});
