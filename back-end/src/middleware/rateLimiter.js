import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler.js';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new AppError(
      429,
      'RATE_LIMITED',
      'Too many login attempts. Try again in 15 minutes.',
    );
  },
});
