const express = require('express');
const {
  initializeFlashSale,
  participateInFlashSale,
  getFlashSaleStatus,
} = require('../controllers/flashSale.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { checkoutRateLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.get('/status/:productId', getFlashSaleStatus);

// Vendor/Admin initializes flash sale stock into Redis
router.post(
  '/initialize',
  authenticate,
  authorize('Vendor', 'SuperAdmin'),
  initializeFlashSale
);

// High-concurrency flash sale purchase with sliding window rate limiting
router.post(
  '/purchase',
  authenticate,
  checkoutRateLimiter,
  participateInFlashSale
);

module.exports = router;

