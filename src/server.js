import express from 'express';
import { logger } from './utils/logger.js';
import { config, validateConfig } from './config/config.js';
import { router } from './api/router.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import {
  svgResponseHeaders,
  jsonResponseHeaders,
} from './middleware/responseHeaders.js';
import { apiLimiter } from './middleware/ratelimit.js';
import {
  healthCheck,
  readinessCheck,
  metricsCheck,
} from './middleware/healthCheck.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  logger.error({ error: error.message }, 'Configuration validation failed');
  process.exit(1);
}

// Initialize Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

app.get('/health', healthCheck);
app.get('/ready', readinessCheck);
app.get('/metrics', metricsCheck);

app.use('/api', apiLimiter);

// SVG endpoints headers
app.use('/api/stats', svgResponseHeaders);
app.use('/api/languages', svgResponseHeaders);
app.use('/api/repos', svgResponseHeaders);
app.use('/api/banner', svgResponseHeaders);
app.use('/api/typing', svgResponseHeaders);
app.use('/api/streak', svgResponseHeaders);
app.use('/api/badge', svgResponseHeaders);
app.use('/api/badges', svgResponseHeaders);
app.use('/api/contribution', svgResponseHeaders);
app.use('/api/dashboard', svgResponseHeaders);

// JSON endpoints
app.use('/api/health', jsonResponseHeaders);

// API router
app.use('/api', router);

const uiPath = path.join(__dirname, '../ui/dist');

// Serve static files
app.use(express.static(uiPath));

// React fallback (ignore /api routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  res.sendFile(path.join(uiPath, 'index.html'));
});

app.use((req, res) => {
  logger.warn({ path: req.path, method: req.method }, 'Route not found');
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

app.use(errorHandler);

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info(
    { host: config.HOST, port: config.PORT, env: config.NODE_ENV },
    'Server started'
  );
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error(
    { error: error.message, stack: error.stack },
    'Uncaught exception'
  );
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled rejection');
  process.exit(1);
});
