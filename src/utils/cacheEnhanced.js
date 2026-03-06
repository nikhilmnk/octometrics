import LRU from 'lru-cache';
import { logger } from './logger.js';
import { config } from '../config/config.js';

/**
 * Enhanced cache utility with namespace support and versioning
 */
class CacheManager {
  constructor(options = {}) {
    const {
      max = config.CACHE_MAX_ITEMS,
      maxSize = config.CACHE_MAX_SIZE,
      ttl = config.CACHE_TTL * 1000, // Convert to milliseconds
    } = options;

    this.cache = new LRU({
      max,
      maxSize,
      ttl,
      sizeCalculation: this.calculateSize.bind(this),
      updateAgeOnGet: true,
      updateAgeOnHas: false,
    });

    this.namespaces = new Map();
    this.versions = new Map();

    logger.info({ max, maxSize, ttl: config.CACHE_TTL }, 'Cache initialized');
  }

  /**
   * Calculate size of cached value in bytes
   */
  // eslint-disable-next-line no-unused-vars
  calculateSize(value, _key) {
    if (typeof value === 'string') {
      return Buffer.byteLength(value, 'utf8');
    }
    if (typeof value === 'object') {
      return Buffer.byteLength(JSON.stringify(value), 'utf8');
    }
    return 1;
  }

  /**
   * Build namespaced key
   */
  buildKey(namespace, key, version = null) {
    const v = version ? `:v${version}` : '';
    return `${namespace}:${key}${v}`;
  }

  /**
   * Set value with namespace
   */
  set(namespace, key, value, ttl = null) {
    const fullKey = this.buildKey(namespace, key);
    const options = ttl ? { ttl: ttl * 1000 } : {};

    this.cache.set(fullKey, value, options);
    logger.debug(
      { namespace, key, size: this.calculateSize(value) },
      'Cache set'
    );
  }

  /**
   * Get value with namespace
   */
  get(namespace, key) {
    const fullKey = this.buildKey(namespace, key);
    const value = this.cache.get(fullKey);

    if (value) {
      logger.debug({ namespace, key }, 'Cache hit');
    } else {
      logger.debug({ namespace, key }, 'Cache miss');
    }

    return value;
  }

  /**
   * Has value in cache
   */
  has(namespace, key) {
    const fullKey = this.buildKey(namespace, key);
    return this.cache.has(fullKey);
  }

  /**
   * Delete value
   */
  delete(namespace, key) {
    const fullKey = this.buildKey(namespace, key);
    this.cache.delete(fullKey);
    logger.debug({ namespace, key }, 'Cache deleted');
  }

  /**
   * Clear namespace
   */
  clearNamespace(namespace) {
    const pattern = `${namespace}:`;
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    logger.info({ namespace, deleted }, 'Namespace cleared');
  }

  /**
   * Set version for namespace (invalidates all previous versions)
   */
  setVersion(namespace, version) {
    this.versions.set(namespace, version);
    logger.info({ namespace, version }, 'Cache version set');
  }

  /**
   * Get current version for namespace
   */
  getVersion(namespace) {
    return this.versions.get(namespace) || 1;
  }

  /**
   * Set versioned key
   */
  setVersioned(namespace, key, value, ttl = null) {
    const version = this.getVersion(namespace);
    const fullKey = this.buildKey(namespace, key, version);
    const options = ttl ? { ttl: ttl * 1000 } : {};

    this.cache.set(fullKey, value, options);
    logger.debug({ namespace, key, version }, 'Versioned cache set');
  }

  /**
   * Get versioned key
   */
  getVersioned(namespace, key) {
    const version = this.getVersion(namespace);
    const fullKey = this.buildKey(namespace, key, version);
    const value = this.cache.get(fullKey);

    if (value) {
      logger.debug({ namespace, key, version }, 'Versioned cache hit');
    }

    return value;
  }

  /**
   * Invalidate namespace (increment version)
   */
  invalidateNamespace(namespace) {
    const current = this.getVersion(namespace);
    this.setVersion(namespace, current + 1);
    logger.info(
      { namespace, newVersion: current + 1 },
      'Namespace invalidated'
    );
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.maxSize,
      calculatedSize: this.cache.calculatedSize,
      percentUsed: (
        (this.cache.calculatedSize / this.cache.maxSize) *
        100
      ).toFixed(2),
    };
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.versions.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get all keys (for debugging)
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries (for debugging)
   */
  entries() {
    return Array.from(this.cache.entries());
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// For backwards compatibility with old cache.js API
export const cache = {
  set: (key, value, ttl) => {
    const [namespace, ...rest] = key.split(':');
    const cacheKey = rest.join(':');
    return cacheManager.set(namespace, cacheKey, value, ttl);
  },
  get: (key) => {
    const [namespace, ...rest] = key.split(':');
    const cacheKey = rest.join(':');
    return cacheManager.get(namespace, cacheKey);
  },
  has: (key) => {
    const [namespace, ...rest] = key.split(':');
    const cacheKey = rest.join(':');
    return cacheManager.has(namespace, cacheKey);
  },
  delete: (key) => {
    const [namespace, ...rest] = key.split(':');
    const cacheKey = rest.join(':');
    return cacheManager.delete(namespace, cacheKey);
  },
  clear: () => cacheManager.clear(),
  getStats: () => cacheManager.getStats(),
  keys: () => cacheManager.keys(),
  entries: () => cacheManager.entries(),
};
