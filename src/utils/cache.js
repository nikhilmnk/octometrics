import { LRUCache } from 'lru-cache';
import { getFeatureConfig } from '../config/config.js';

const cacheConfig = getFeatureConfig('cache');

/**
 * LRU Cache instance with bounded memory usage
 */
export const cache = new LRUCache({
  max: cacheConfig.maxItems,
  ttl: cacheConfig.ttl * 1000,
  sizeCalculation: (item) => JSON.stringify(item).length,
  maxSize: cacheConfig.maxSize
});

export const get = (key) => cache.get(key);

export const set = (key, value) => {
  cache.set(key, value);
};
