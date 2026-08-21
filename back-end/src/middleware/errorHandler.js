import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  const status = err.status || 500;
  const body = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status === 500 && env.nodeEnv === 'production'
        ? 'Internal server error'
        : err.message,
    },
  };

  if (status === 500 && env.nodeEnv !== 'production') {
    body.error.stack = err.stack;
  }

  return res.status(status).json(body);
};