import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { authRouter } from './modules/auth/auth.router';
import { vehiclesRouter } from './modules/vehicles/vehicles.router';
import { errorHandler } from './middleware/error.middleware';
import { swaggerDocument } from './config/swagger';
import { env } from './config/env';

export const createApp = () => {
  const app = express();

  // Security & Middleware (disable CSP for swagger-ui and dashboard rendering)
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
  app.use(express.json());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Serve authentic car photos statically
  app.use('/cars', express.static(path.resolve(__dirname, '../../frontend/public/cars')));

  // Rate limiting (disabled in test)
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests' } }));
    app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
  }

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Root Developer Portal / API Gateway Landing Page
  app.get('/', (req: Request, res: Response) => {
    if (req.accepts('html')) {
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoElite API Gateway — Backend Host</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #070b12;
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #0d1624;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 40px;
      max-width: 680px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #34d399;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    h1 span { color: #f43f5e; }
    p.subtitle {
      font-size: 14px;
      color: #94a3b8;
      margin-bottom: 28px;
      line-height: 1.5;
    }
    .btn-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }
    .btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: #0d9488;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #14b8a6;
      transform: translateY(-2px);
    }
    .btn-secondary {
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid #334155;
    }
    .btn-secondary:hover {
      background: #334155;
      transform: translateY(-2px);
    }
    .endpoints {
      background: #070b12;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px;
      font-family: monospace;
      font-size: 12px;
      color: #cbd5e1;
    }
    .endpoints h3 {
      font-family: -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .endpoint-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #1e293b;
    }
    .endpoint-row:last-child { border-bottom: none; }
    .method {
      font-weight: bold;
      color: #38bdf8;
    }
    .route { color: #f1f5f9; }
    .desc { color: #64748b; }
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span> Backend API Host Online (Port 3001)
    </div>
    <h1>car<span>wale</span> AutoElite API Gateway</h1>
    <p class="subtitle">
      Welcome to the Car Dealership Inventory backend service. Built with Node.js, Express, TypeScript, and ACID concurrency-safe database transactions.
    </p>

    <div class="btn-grid">
      <a href="/api/docs" class="btn btn-primary">
        <span>📖</span>
        <div>
          <div>Interactive Swagger UI</div>
          <small style="opacity: 0.8; font-weight: normal;">API docs & schema explorer (/api/docs)</small>
        </div>
      </a>

      <a href="http://localhost:5173" class="btn btn-secondary">
        <span>🚗</span>
        <div>
          <div>Open Frontend Showroom</div>
          <small style="opacity: 0.8; font-weight: normal;">CarWale UI app (localhost:5173)</small>
        </div>
      </a>

      <a href="/api/vehicles" class="btn btn-secondary">
        <span>🏎️</span>
        <div>
          <div>Vehicle Inventory JSON</div>
          <small style="opacity: 0.8; font-weight: normal;">16 Indian models (/api/vehicles)</small>
        </div>
      </a>

      <a href="/health" class="btn btn-secondary">
        <span>🩺</span>
        <div>
          <div>Health Check Endpoint</div>
          <small style="opacity: 0.8; font-weight: normal;">Heartbeat & uptime status (/health)</small>
        </div>
      </a>
    </div>

    <div class="endpoints">
      <h3>Active API Routes</h3>
      <div class="endpoint-row">
        <span><span class="method">GET</span> <span class="route">/api/vehicles</span></span>
        <span class="desc">Browse 16 Indian vehicles (public)</span>
      </div>
      <div class="endpoint-row">
        <span><span class="method">GET</span> <span class="route">/api/vehicles/:id</span></span>
        <span class="desc">Vehicle dossier & specs (public)</span>
      </div>
      <div class="endpoint-row">
        <span><span class="method">POST</span> <span class="route">/api/vehicles/:id/purchase</span></span>
        <span class="desc">ACID transaction purchase (auth)</span>
      </div>
      <div class="endpoint-row">
        <span><span class="method">POST</span> <span class="route">/api/auth/login</span></span>
        <span class="desc">Customer & Admin JWT login</span>
      </div>
      <div class="endpoint-row">
        <span><span class="method">POST</span> <span class="route">/api/auth/register</span></span>
        <span class="desc">Account creation</span>
      </div>
      <div class="endpoint-row">
        <span><span class="method">GET</span> <span class="route">/api/docs</span></span>
        <span class="desc">OpenAPI 3.0 Swagger UI</span>
      </div>
    </div>

    <div class="footer">
      AutoElite Car Dealership System • Running on Node.js v24 & TypeScript 5
    </div>
  </div>
</body>
</html>
      `);
    }

    // JSON response for API clients
    res.json({
      success: true,
      service: 'AutoElite Car Dealership API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      links: {
        swaggerDocs: '/api/docs',
        health: '/health',
        vehicles: '/api/vehicles',
        frontend: 'http://localhost:5173',
      },
      accounts: {
        admin: 'admin@cardealership.com / Admin@12345',
        customer: 'customer@example.com / Customer@12345',
      },
    });
  });

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
