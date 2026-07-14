jest.mock('../../src/config/db.js', () => ({
  user: {
    findUnique: jest.fn(),
  },
  watchlistItem: {
    findFirst: jest.fn(),
  },
}));

jest.setTimeout(30000);

import { validateUserRegistration, userLoginValidator } from '../../src/middleware/validators/authValidators.js';
import { addWatchListItemValidator } from '../../src/middleware/validators/watchListValidators.js';
import { addWatchHistoryItemValidator } from '../../src/middleware/validators/watchHistoryValidators.js';
import { updateUserValidator } from '../../src/middleware/validators/userValidators.js';
import prisma from '../../src/config/db.js';
import validationRequest from '../../src/middleware/validateRequest.js';

const runMiddlewareArray = async (middlewares: any[], req: any, res: any) => {
  // Run validation chains (.run(req)) to populate validationResult
  for (const m of middlewares) {
    if (m && typeof m.run === 'function') {
      await m.run(req);
    }
  }

  // Finally run the shared validationRequest handler to return errors
  await new Promise<void>((resolve) => {
    res.json.mockImplementation(() => {
      resolve();
      return res;
    });
    validationRequest(req, res, () => resolve());
  });
};

const createReq = (body = {}, userId?: number) => ({ body, params: {}, query: {}, userId });
const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('validator branches (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validateUserRegistration - existing email triggers validation error', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'a@a.com' });

    const req = createReq({ username: 'u', email: 'a@a.com', password: 'password1', confirmPassword: 'password1' });
    const res = createRes();

    await runMiddlewareArray(validateUserRegistration, req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('addWatchListItemValidator - duplicate item returns validation error', async () => {
    (prisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue({ id: 11 });

    const req = createReq({ mediaType: 'MOVIE', tmdbId: '123' }, 1);
    req.userId = 1;
    const res = createRes();

    await runMiddlewareArray(addWatchListItemValidator, req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('addWatchHistoryItemValidator - duplicate item returns validation error', async () => {
    (prisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue({ id: 21 });

    const req = createReq({ mediaType: 'SERIES', tmdbId: '456' }, 2);
    req.userId = 2;
    const res = createRes();

    await runMiddlewareArray(addWatchHistoryItemValidator, req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('updateUserValidator - password without oldPassword returns error', async () => {
    const req = createReq({ password: 'newpassword' }, 3);
    req.userId = 3;
    const res = createRes();

    await runMiddlewareArray(updateUserValidator, req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
});
