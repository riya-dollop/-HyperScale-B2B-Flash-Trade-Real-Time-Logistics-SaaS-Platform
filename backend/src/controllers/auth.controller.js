const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { redisClient } = require('../config/redis');
const { emitKafkaEvent } = require('../events/kafkaProducer');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'hyperscale_super_secure_jwt_access_secret_key_2026_xyz';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'hyperscale_super_secure_jwt_refresh_secret_key_2026_abc';

/**
 * Generate Access and Refresh JWT Tokens
 */
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });

  return { accessToken, refreshToken };
};

/**
 * Cookie options for Secure HttpOnly Refresh Token
 */
const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Register User (Customer / Vendor / SuperAdmin)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, gstinOrTaxId, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Customer',
      companyName,
      gstinOrTaxId,
      phone,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Store hashed refresh token in DB or Redis for rotation tracking
    const salt = await bcrypt.genSalt(8);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await user.save();

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    // Stream audit log to Kafka
    emitKafkaEvent('USER_REGISTERED', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login User with Sliding Window Rate Limiting & Refresh Token Issuance
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +refreshTokenHash');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token hash for token rotation
    const salt = await bcrypt.genSalt(8);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await user.save();

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    emitKafkaEvent('USER_LOGGED_IN', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Token Refresh Rotation (Invalidates old refresh token and issues new pair)
 */
const refreshTokenRotation = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const token = tokenFromCookie || tokenFromBody;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing. Please log in again.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token. Re-authentication required.',
      });
    }

    const user = await User.findById(decoded.id).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash) {
      return res.status(403).json({
        success: false,
        message: 'User session revoked. Please login again.',
      });
    }

    // Verify refresh token hash matches the one stored in database
    const isValidToken = await bcrypt.compare(token, user.refreshTokenHash);
    if (!isValidToken) {
      // Possible token reuse detected! Revoke all tokens for safety
      user.refreshTokenHash = null;
      await user.save();
      return res.status(403).json({
        success: false,
        message: 'Refresh token reuse detected. Access revoked for security.',
      });
    }

    // Issue brand new token pair (Rotation)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    const salt = await bcrypt.genSalt(8);
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, salt);
    await user.save();

    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout - Blacklist Access Token in Redis and Clear Refresh Cookie
 */
const logout = async (req, res, next) => {
  try {
    const token = req.user?.token;
    if (token) {
      // Blacklist token in Redis for remaining validity (e.g. 15 mins = 900s)
      await redisClient.set(`blacklist_${token}`, 'revoked', 'EX', 900);
    }

    // Revoke user refresh token hash in DB
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });
    }

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Token invalidated in Redis cache.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User Profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshTokenRotation,
  logout,
  getMe,
};

