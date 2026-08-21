import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'EduManage API',
      version: '0.1.0',
      health: '/api/health',
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app, prisma };