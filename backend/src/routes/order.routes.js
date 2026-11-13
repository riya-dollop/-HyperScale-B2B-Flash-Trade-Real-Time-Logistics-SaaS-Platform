const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateTrackingLocation,
} = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { checkoutRateLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/', authenticate, checkoutRateLimiter, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);

// Logistics delivery partner telemetry update endpoint
router.patch(
  '/:id/tracking',
  authenticate,
  authorize('Vendor', 'SuperAdmin'),
  updateTrackingLocation
);

module.exports = router;

