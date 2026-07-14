import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httpError.js';

function unknownURL(req: Request, res: Response, next: NextFunction) {
  const error = new HttpError(404, `Can't find ${req.originalUrl} on this server`);
  next(error);
}

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  let httpErr: HttpError;

  if (err instanceof HttpError) {
    httpErr = err;
  } else if (err instanceof Error) {
    httpErr = new HttpError(500, err.message);
    // preserve stack
    httpErr.stack = err.stack;
  } else if (typeof err === 'string') {
    httpErr = new HttpError(500, err);
  } else {
    httpErr = new HttpError(500, 'An unknown error occurred');
  }

  if (String(httpErr.statusCode).startsWith('5')) {
    console.error('🚨 ERROR', httpErr);
  }

  const errorResponse: Record<string, unknown> = {
    status: httpErr.status,
    message: httpErr.message
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = httpErr.stack;
  }

  res.status(httpErr.statusCode).json(errorResponse);
}

export { unknownURL, errorHandler };