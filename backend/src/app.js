const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const flashSaleRoutes = require('./routes/flashSale.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { apiGeneralRateLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

// Security Headers & Cross-Origin Resource Sharing
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(cookieParser());

// Raw body preservation for Stripe Webhook before express.json()
app.use('/api/v1/payments/webhook/stripe', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve local upload fallbacks for image/invoice preview
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint for Kubernetes Readiness & Liveness Probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'UP',
      redis: 'CONFIGURED',
      mongodb: 'CONFIGURED',
      rabbitmq: 'CONFIGURED',
      kafka: 'CONFIGURED',
    },
  });
});

// Apply General Rate Limiter to API routes
app.use('/api/v1', apiGeneralRateLimiter);

// API Routes Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/flash-sale', flashSaleRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route [${req.method} ${req.originalUrl}] does not exist.`,
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;

