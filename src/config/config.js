import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Centralized configuration management
 * Supports defaults and environment variable overrides
 */
export const config = Object.freeze({
  // Server configuration
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',

  // GitHub API configuration
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  API_RATE_LIMIT: parseInt(process.env.API_RATE_LIMIT || '100'), // requests per minute
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'), // milliseconds

  // Cache configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '21600'), // 6 hours in seconds
  CACHE_MAX_ITEMS: parseInt(process.env.CACHE_MAX_ITEMS || '500'),
  CACHE_MAX_SIZE: parseInt(process.env.CACHE_MAX_SIZE || '52428800'), // 50MB in bytes

  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // SVG rendering configuration
  SVG_WIDTH: 900,
  SVG_MAX_WIDTH: 1200,
  SVG_PADDING: 20,

  // Feature flags
  ENABLE_GRAPHQL: process.env.ENABLE_GRAPHQL !== 'false',
  ENABLE_CACHING: process.env.ENABLE_CACHING !== 'false',
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',

  // Validation configuration
  MAX_USERNAME_LENGTH: 39, // GitHub username max length
  MIN_USERNAME_LENGTH: 1,

  // Response configuration
  CACHE_CONTROL_PUBLIC: 'public, max-age=21600', // 6 hours
  CACHE_CONTROL_NO_CACHE: 'no-cache, no-store, must-revalidate',
});

/**
 * Validate configuration on startup
 */
export function validateConfig() {
  const errors = [];

  if (config.PORT < 1 || config.PORT > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (config.CACHE_TTL < 60) {
    errors.push('CACHE_TTL should be at least 60 seconds');
  }

  if (config.CACHE_MAX_ITEMS < 10) {
    errors.push('CACHE_MAX_ITEMS should be at least 10');
  }

  if (config.API_RATE_LIMIT < 10) {
    errors.push('API_RATE_LIMIT should be at least 10');
  }

  if (['development', 'production', 'test'].indexOf(config.NODE_ENV) === -1) {
    errors.push(`Invalid NODE_ENV: ${config.NODE_ENV}`);
  }

  if (errors.length > 0) {
    logger.error({ errors }, 'Configuration validation failed');
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }

  logger.info(
    {
      port: config.PORT,
      nodeEnv: config.NODE_ENV,
      cacheTtl: config.CACHE_TTL,
      logLevel: config.LOG_LEVEL,
    },
    'Configuration validated'
  );
}

/**
 * Get configuration for specific feature
 */
export function getFeatureConfig(feature) {
  const featureConfigs = {
    github: {
      token: config.GITHUB_TOKEN,
      rateLimit: config.API_RATE_LIMIT,
      timeout: config.API_TIMEOUT,
      graphqlEnabled: config.ENABLE_GRAPHQL,
    },
    cache: {
      ttl: config.CACHE_TTL,
      maxItems: config.CACHE_MAX_ITEMS,
      maxSize: config.CACHE_MAX_SIZE,
      enabled: config.ENABLE_CACHING,
    },
    server: {
      port: config.PORT,
      host: config.HOST,
      nodeEnv: config.NODE_ENV,
    },
    svg: {
      width: config.SVG_WIDTH,
      maxWidth: config.SVG_MAX_WIDTH,
      padding: config.SVG_PADDING,
    },
  };

  return featureConfigs[feature] || null;
}
