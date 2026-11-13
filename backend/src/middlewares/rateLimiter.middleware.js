const { redisClient } = require('../config/redis');

/**
 * Enterprise Sliding Window Rate Limiter using Redis Sorted Sets
 * @param {number} windowSeconds - Duration of the sliding time window in seconds
 * @param {number} maxRequests - Max allowable requests inside the sliding window
 * @param {string} prefix - Custom prefix for the route/action
 */
const slidingWindowRateLimiter = ({ windowSeconds = 60, maxRequests = 10, prefix = 'rl' }) => {
  return async (req, res, next) => {
    try {
      // Determine client identity (IP or Authenticated User ID)
      const identifier = req.user ? req.user.id : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip');
      const key = `${prefix}:${identifier}`;
      const now = Date.now();
      const windowStart = now - windowSeconds * 1000;

      // 1. Remove timestamps outside the sliding window
      await redisClient.zremrangebyscore(key, 0, windowStart);

      // 2. Count requests in the current active window
      const requestCount = await redisClient.zcard(key);

      // 3. Set standard enterprise rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount - 1));
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowSeconds * 1000) / 1000));

      if (requestCount >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowSeconds}s allowed. Please back off.`,
          retryAfterSeconds: windowSeconds,
        });
      }

      // 4. Add current timestamp to sorted set and refresh TTL
      const member = `${now}-${Math.random().toString(36).substring(7)}`;
      await redisClient.zadd(key, now, member);
      await redisClient.expire(key, windowSeconds * 2);

      next();
    } catch (error) {
      console.warn(`[Rate Limiter Warning] ${error.message}. Allowing request through.`);
      next();
    }
  };
};

module.exports = {
  slidingWindowRateLimiter,
  loginRateLimiter: slidingWindowRateLimiter({ windowSeconds: 60, maxRequests: 5, prefix: 'rl:login' }),
  checkoutRateLimiter: slidingWindowRateLimiter({ windowSeconds: 60, maxRequests: 10, prefix: 'rl:checkout' }),
  apiGeneralRateLimiter: slidingWindowRateLimiter({ windowSeconds: 60, maxRequests: 100, prefix: 'rl:api' }),
};

