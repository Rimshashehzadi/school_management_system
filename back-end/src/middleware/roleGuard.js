import { AppError } from './errorHandler.js';

export const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'));
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
  }
  next();
};
