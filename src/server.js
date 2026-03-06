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

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  logger.error({ error: error.message }, 'Configuration validation failed');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware stack
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging and timing
app.use(requestLogger);

// Health check endpoints (no rate limiting)
app.get('/health', healthCheck);
app.get('/ready', readinessCheck);
app.get('/metrics', metricsCheck);

// API routes with rate limiting and response headers
app.use('/api', apiLimiter);

// SVG endpoints get SVG headers
app.use('/api/stats', svgResponseHeaders);
app.use('/api/languages', svgResponseHeaders);
app.use('/api/repos', svgResponseHeaders);
app.use('/api/banner', svgResponseHeaders);
app.use('/api/typing', svgResponseHeaders);
app.use('/api/badge', svgResponseHeaders);
app.use('/api/contribution', svgResponseHeaders);
app.use('/api/dashboard', svgResponseHeaders);

// Other endpoints get JSON headers
app.use('/api/health', jsonResponseHeaders);

// API router
app.use('/api', router);

// 404 handler
app.use((req, res) => {
  logger.warn({ path: req.path, method: req.method }, 'Route not found');
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.PORT, config.HOST, () => {
  logger.info(
    { host: config.HOST, port: config.PORT, env: config.NODE_ENV },
    'Server started'
  );
});

// Graceful shutdown
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

// Handle uncaught exceptions
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
