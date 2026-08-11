/**
 * Simple In-Memory Caching Middleware
 * 
 * Provides response caching for frequently accessed, rarely changed data
 * like menu items and categories. Uses in-memory storage (no Redis required).
 * 
 * Features:
 * - Configurable TTL (Time To Live)
 * - Automatic cache invalidation on data changes
 * - Memory-efficient (clears old entries)
 * - Easy integration with Express routes
 * 
 * Usage:
 *   router.get('/menu', cache(300), menuController.getMenu);
 *   // Caches response for 5 minutes (300 seconds)
 */

// Simple in-memory cache storage
const cacheStore = new Map();

// Track cache stats
const stats = {
  hits: 0,
  misses: 0,
  size: 0,
};

/**
 * Generate cache key from request
 */
function generateKey(req) {
  const { method, originalUrl, query } = req;
  const queryString = JSON.stringify(query);
  return `${method}:${originalUrl}:${queryString}`;
}

/**
 * Cache middleware factory
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Function} Express middleware
 */
function cache(ttl = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = generateKey(req);
    const cached = cacheStore.get(key);

    // Check if cache entry exists and is not expired
    if (cached && cached.expiresAt > Date.now()) {
      stats.hits++;
      
      // Set cache headers
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Age', Math.floor((Date.now() - cached.cachedAt) / 1000));
      
      // Return cached response
      return res.status(cached.status).json(cached.data);
    }

    stats.misses++;

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      // Only cache successful responses (200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          data,
          status: res.statusCode,
          cachedAt: Date.now(),
          expiresAt: Date.now() + (ttl * 1000),
        });

        stats.size = cacheStore.size;

        // Set cache headers
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-TTL', ttl);
      }

      // Call original json function
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear all cache entries
 */
function clearAll() {
  cacheStore.clear();
  stats.size = 0;
  console.log('✅ Cache cleared');
}

/**
 * Clear cache entries matching a pattern
 * @param {string|RegExp} pattern - Pattern to match cache keys
 */
function clearPattern(pattern) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  let cleared = 0;

  for (const [key] of cacheStore.entries()) {
    if (regex.test(key)) {
      cacheStore.delete(key);
      cleared++;
    }
  }

  stats.size = cacheStore.size;
  console.log(`✅ Cleared ${cleared} cache entries matching: ${pattern}`);
  return cleared;
}

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 */
function clearKey(key) {
  const deleted = cacheStore.delete(key);
  if (deleted) {
    stats.size = cacheStore.size;
    console.log(`✅ Cleared cache key: ${key}`);
  }
  return deleted;
}

/**
 * Get cache statistics
 */
function getStats() {
  const hitRate = stats.hits + stats.misses > 0 
    ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2)
    : 0;

  return {
    ...stats,
    hitRate: `${hitRate}%`,
    entries: cacheStore.size,
  };
}

/**
 * Clean up expired cache entries
 */
function cleanup() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, value] of cacheStore.entries()) {
    if (value.expiresAt < now) {
      cacheStore.delete(key);
      cleaned++;
    }
  }

  stats.size = cacheStore.size;

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
  }

  return cleaned;
}

// Run cleanup every 5 minutes (only in non-test environment)
let cleanupInterval;
if (process.env.NODE_ENV !== 'test') {
  cleanupInterval = setInterval(cleanup, 5 * 60 * 1000);
}

// Clear interval on process exit
process.on('exit', () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
});

// Export cleanup interval for testing
module.exports.cleanupInterval = cleanupInterval;

// Middleware to invalidate cache on data changes
function invalidateOnChange(patterns) {
  return (req, res, next) => {
    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json
    res.json = function(data) {
      // Only invalidate on successful write operations
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Clear cache entries matching patterns
          if (Array.isArray(patterns)) {
            patterns.forEach(pattern => clearPattern(pattern));
          } else if (patterns) {
            clearPattern(patterns);
          }
        }
      }

      return originalJson(data);
    };

    next();
  };
}

module.exports = {
  cache,
  clearAll,
  clearPattern,
  clearKey,
  getStats,
  cleanup,
  invalidateOnChange,
};
