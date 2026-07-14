export class HttpError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${String(statusCode).startsWith('4') ? 'fail' : 'error'}`;
    this.isOperational = isOperational;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function createHttpError(statusCode: number, message: string) {
  return new HttpError(statusCode, message, true);
}

export default HttpError;
