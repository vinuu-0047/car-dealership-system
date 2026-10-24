import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './modules/auth/auth.router';
import { vehiclesRouter } from './modules/vehicles/vehicles.router';
import { errorHandler } from './middleware/error.middleware';
import { swaggerDocument } from './config/swagger';
import { env } from './config/env';

export const createApp = () => {
  const app = express();

  // Security & Middleware (disable CSP for swagger-ui rendering)
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
  app.use(express.json());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate limiting (disabled in test)
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests' } }));
    app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
  }

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/vehicles', vehiclesRouter);

  // 404 handler
  app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found' }));

  // Centralized error handler (must be last)
  app.use(errorHandler);

  return app;
};
