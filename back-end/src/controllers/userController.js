import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  VALID_ROLES,
  assertValid,
  requireString,
  validateEmailFormat,
} from '../utils/validators.js';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  createdAt: true,
};

export const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: USER_SELECT,
    orderBy: { id: 'asc' },
  });

  res.json({ success: true, data: { users } });
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body || {};
  const errors = [];

  requireString(email, 'email', errors);
  requireString(password, 'password', errors);
  requireString(name, 'name', errors);
  requireString(role, 'role', errors);

  if (errors.length === 0) {
    validateEmailFormat(email, errors);
    if (typeof password !== 'string' || password.length < 8) {
      errors.push({ field: 'password', message: 'password must be at least 8 characters long' });
    }
    if (!VALID_ROLES.includes(role)) {
      errors.push({
        field: 'role',
        message: `role must be one of: ${VALID_ROLES.join(', ')}`,
      });
    }
  }
  assertValid(errors);

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
      role,
    },
    select: USER_SELECT,
  });

  res.status(201).json({ success: true, data: { user } });
});
