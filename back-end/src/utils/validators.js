import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALID_ROLES = Object.values(Role);

export function requireString(value, field, errors) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push({ field, message: `${field} is required and must be a non-empty string` });
  }
}

export function validateEmailFormat(email, errors) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'email must be a valid email address' });
  }
}

export function assertValid(errors) {
  if (errors.length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors);
  }
}
