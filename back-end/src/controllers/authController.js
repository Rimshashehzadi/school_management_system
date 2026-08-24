import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { assertValid, requireString, validateEmailFormat } from '../utils/validators.js';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  createdAt: true,
};

const DUMMY_HASH = bcrypt.hashSync('timing-attack-mitigation', 10);

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const errors = [];

  requireString(email, 'email', errors);
  requireString(password, 'password', errors);
  if (errors.length === 0) {
    validateEmailFormat(email, errors);
  }
  assertValid(errors);

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { ...USER_SELECT, passwordHash: true },
  });

  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.passwordHash : DUMMY_HASH,
  );

  if (!user || user.status !== 'ACTIVE' || !passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '12h' },
  );

  const { passwordHash, ...sanitized } = user;
  res.json({ success: true, data: { token, user: sanitized } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User no longer exists');
  }

  res.json({ success: true, data: { user } });
});
