import dotenv from 'dotenv';

dotenv.config();

const INSECURE_SECRETS = new Set([
  '',
  'insecure-dev-secret',
  'change-me-in-production',
  'changeme',
  'secret',
  'jwt_secret',
]);

export const env = {
  port: parseInt(process.env.PORT, 10) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function assertEnv() {
  const problems = [];

  if (!env.jwtSecret || INSECURE_SECRETS.has(env.jwtSecret.trim().toLowerCase())) {
    problems.push('JWT_SECRET is missing or uses a known insecure/default value');
  }
  if (!env.databaseUrl) {
    problems.push('DATABASE_URL is missing');
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`[env] FATAL: ${problem}`);
    }
    throw new Error('Invalid environment configuration — server cannot start');
  }
}
