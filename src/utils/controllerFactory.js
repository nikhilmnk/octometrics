import { cache } from './cache.js';
import { logger } from './logger.js';
import { errorSVG } from './errorSVG.js';
import { themeLoader } from './themeLoader.js';
import { validator } from './validator.js';
import { config } from '../config/config.js';

/**
 * Controller Factory: Creates standardized controllers with common patterns
 * Handles: validation, caching, theme loading, error handling, response rendering
 */
export function createController({
  cacheKey,
  fetchData,
  renderSVG,
  validateParams = () => true,
  cacheDuration = config.CACHE_TTL
}) {
  return async (req, res) => {
    const startTime = Date.now();
    const { username, theme = 'dark' } = req.query;

    try {
      // Validate input parameters
      if (!validator.isValidUsername(username)) {
        logger.warn({ username }, 'Invalid username parameter');
        return res.set('Content-Type', 'image/svg+xml').send(
          errorSVG('Invalid username parameter')
        );
      }

      // Run custom validation if provided
      if (!validateParams(req.query)) {
        logger.warn({ query: req.query }, 'Custom validation failed');
        return res.set('Content-Type', 'image/svg+xml').send(
          errorSVG('Invalid parameters')
        );
      }

      // Build cache key with theme
      const key = `${cacheKey}:${username}:${theme}`;

      // Check cache
      const cached = cache.get(key);
      if (cached) {
        logger.debug(
          { key, duration: Date.now() - startTime },
          'Cache hit'
        );
        return res.set('Content-Type', 'image/svg+xml').send(cached);
      }

      // Load theme
      let loadedTheme = themeLoader.getTheme(theme);
      if (!loadedTheme) {
        logger.warn({ theme }, 'Unknown theme, falling back to dark');
        loadedTheme = themeLoader.getTheme('dark');
      }

      // Fetch data
      logger.debug({ username, cacheKey }, 'Fetching data');
      const data = await fetchData(username);

      // Render SVG
      const svg = renderSVG(data, loadedTheme);

      // Cache result
      cache.set(key, svg, cacheDuration);

      logger.info(
        { key, duration: Date.now() - startTime },
        'Request completed'
      );

      return res.set('Content-Type', 'image/svg+xml').send(svg);
    } catch (error) {
      logger.error(
        { username, cacheKey, error: error.message, duration: Date.now() - startTime },
        'Controller error'
      );

      return res.set('Content-Type', 'image/svg+xml').send(
        errorSVG(`Error generating ${cacheKey}`)
      );
    }
  };
}

/**
 * Batch Controller: For endpoints that fetch multiple data sources
 */
export function createBatchController({
  dataFetchers,
  renderSVG,
  cacheKey,
  validateParams = () => true,
  cacheDuration = config.CACHE_TTL
}) {
  return async (req, res) => {
    const startTime = Date.now();
    const { username, theme = 'dark' } = req.query;

    try {
      if (!username || !validator.isValidUsername(username)) {
        logger.warn({ username }, 'Invalid username parameter');
        return res.set('Content-Type', 'image/svg+xml').send(
          errorSVG('Invalid username parameter')
        );
      }

      if (!validateParams(req.query)) {
        logger.warn({ query: req.query }, 'Custom validation failed');
        return res.set('Content-Type', 'image/svg+xml').send(
          errorSVG('Invalid parameters')
        );
      }

      const key = `${cacheKey}:${username}:${theme}`;

      const cached = cache.get(key);
      if (cached) {
        logger.debug({ key, duration: Date.now() - startTime }, 'Cache hit');
        return res.set('Content-Type', 'image/svg+xml').send(cached);
      }

      const loadedTheme = themeLoader.getTheme(theme) || themeLoader.getTheme('dark');

      // Fetch all data sources in parallel
      logger.debug({ username, dataFetchers: Object.keys(dataFetchers) }, 'Fetching batch data');
      const data = {};
      const promises = Object.entries(dataFetchers).map(async ([key, fetcher]) => {
        try {
          data[key] = await fetcher(username);
        } catch (error) {
          logger.warn({ key, error: error.message }, 'Data fetcher failed');
          data[key] = null;
        }
      });

      await Promise.all(promises);

      // Render SVG with all data
      const svg = renderSVG(data, loadedTheme);

      // Cache result
      cache.set(key, svg, cacheDuration);

      logger.info(
        { key, duration: Date.now() - startTime },
        'Batch request completed'
      );

      return res.set('Content-Type', 'image/svg+xml').send(svg);
    } catch (error) {
      logger.error(
        { username, cacheKey, error: error.message, duration: Date.now() - startTime },
        'Batch controller error'
      );

      return res.set('Content-Type', 'image/svg+xml').send(
        errorSVG(`Error generating ${cacheKey}`)
      );
    }
  };
}
