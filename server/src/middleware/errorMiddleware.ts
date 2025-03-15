import { Request, Response, NextFunction } from 'express';

export interface HttpError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

function unknownURL(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Can't find ${req.originalUrl} on this server`) as HttpError;
  error.statusCode = 404;
  error.status = 'fail';
  error.isOperational = true;
  next(error);
}

function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  if (typeof err === 'string') {
    err = new Error(err) as HttpError;
    err.statusCode = 500;
  } else if (!(err instanceof Error)) {
    err = new Error('An unknown error occurred') as HttpError;
    err.statusCode = 500;
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || (err.statusCode.toString().startsWith('4') ? 'fail' : 'error');
  err.isOperational = err.isOperational || false;

  if (err.statusCode.toString().startsWith('5')) {
    console.error('🚨 ERROR', err);
  }

  const errorResponse: Record<string, unknown> = {
    status: err.status,
    message: err.message
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(err.statusCode).json(errorResponse);
}

export { unknownURL, errorHandler };