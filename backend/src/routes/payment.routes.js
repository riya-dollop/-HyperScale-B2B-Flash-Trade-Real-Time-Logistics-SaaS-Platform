const express = require('express');
const {
  createPaymentIntent,
  handleStripeWebhook,
  handleRazorpayWebhook,
} = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/create-intent', authenticate, createPaymentIntent);

// Webhook routes (Stripe raw body parser or JSON body)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post('/webhook/razorpay', handleRazorpayWebhook);

module.exports = router;

