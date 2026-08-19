import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

async function main() {
  try {
    await prisma.$connect();
    console.log('[db] MySQL connected');
  } catch (err) {
    console.error('[db] MySQL connection failed:', err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`[server] EduManage API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('[server] startup error:', err);
  process.exit(1);
});