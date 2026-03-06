import pino from 'pino';
import { config } from '../config/config.js';

const LOG_LEVEL = config.LOG_LEVEL;

/**
 * Structured logger instance using pino
 * Provides consistent JSON logging across the application
 */
export const logger = pino({
  level: LOG_LEVEL
});
