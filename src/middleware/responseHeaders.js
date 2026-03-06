/**
 * Middleware to set SVG response headers
 * Applies Content-Type: image/svg+xml to all API responses
 */
export const svgResponseHeaders = (req, res, next) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
};

/**
 * Middleware to set JSON response headers for health checks
 */
export const jsonResponseHeaders = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
};
