const express = require('express');
const { getDashboardMetrics } = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/metrics', authenticate, getDashboardMetrics);

module.exports = router;

