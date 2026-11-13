const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');
const User = require('../models/User');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'hyperscale_super_secure_jwt_access_secret_key_2026_xyz';

/**
 * Protect routes - Verifies JWT access token and checks blacklist
 */
const authenticate = async (req, res, next) => {
  let token = null;

  // 1. Extract Bearer token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Please log in to proceed.',
    });
  }

  try {
    // 2. Check if token is blacklisted in Redis (e.g. user logged out)
    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked or expired. Please login again.',
      });
    }

    // 3. Verify signature
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    // 4. Attach user context to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      token,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

