import { logger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';
import { config } from '../config/config.js';

const startTime = Date.now();

/**
 * Health check endpoint for liveness probe
 * Returns 200 if service is running
 */
export function healthCheck(req, res) {
  const uptime = Date.now() - startTime;

  const health = {
    status: 'ok',
    uptime: Math.floor(uptime / 1000), // seconds
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  };

  logger.debug(health, 'Health check');
  res.set('Content-Type', 'application/json').json(health);
}

/**
 * Readiness check endpoint for readiness probe
 * Returns 200 if service is ready to handle traffic
 */
export function readinessCheck(req, res) {
  try {
    // Check cache availability
    const cacheStats = cache.getStats?.();
    const cacheHealthy = cacheStats && cacheStats.size >= 0;

    // Check memory usage
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    const memoryHealthy = heapUsedPercent < 90; // Alert if >90%

    const ready = cacheHealthy && memoryHealthy;

    const status = {
      ready,
      checks: {
        cache: cacheHealthy,
        memory: memoryHealthy,
      },
      memory: {
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        externalMB: Math.round(memUsage.external / 1024 / 1024),
        percentUsed: heapUsedPercent.toFixed(1),
      },
      cache: cacheStats,
    };

    logger.debug(status, 'Readiness check');

    if (!ready) {
      logger.warn(status, 'Service not ready');
      return res
        .status(503)
        .set('Content-Type', 'application/json')
        .json(status);
    }

    res.set('Content-Type', 'application/json').json(status);
  } catch (error) {
    logger.error({ error: error.message }, 'Readiness check failed');
    res.status(503).json({
      ready: false,
      error: error.message,
    });
  }
}

/**
 * Metrics endpoint for monitoring
 */
export function metricsCheck(req, res) {
  try {
    const memUsage = process.memoryUsage();
    const uptime = Date.now() - startTime;
    const cacheStats = cache.getStats?.();

    const metrics = {
      uptime: Math.floor(uptime / 1000),
      memory: {
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        externalMB: Math.round(memUsage.external / 1024 / 1024),
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
      },
      cache: cacheStats,
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        env: config.NODE_ENV,
      },
    };

    logger.debug(metrics, 'Metrics check');
    res.set('Content-Type', 'application/json').json(metrics);
  } catch (error) {
    logger.error({ error: error.message }, 'Metrics check failed');
    res.status(500).json({
      error: error.message,
    });
  }
}
