import { logger } from '../utils/logger.js';

/**
 * Global error handler middleware
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  logger.error({ error: err, url: req.url }, 'Unhandled error in request');

  const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffcccc"/>
    <text x="20" y="50" font-family="Arial" font-size="16" fill="#cc0000">Internal Server Error</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(500).send(svg);
};
