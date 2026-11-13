const Product = require('../models/Product');
const { redisClient } = require('../config/redis');
const { flashSaleOrderQueue } = require('../queues/queue');
const { getIO } = require('../config/socket');
const { emitKafkaEvent } = require('../events/kafkaProducer');

/**
 * Initialize or Reset Flash Sale Stock in Redis
 */
const initializeFlashSale = async (req, res, next) => {
  try {
    const { productId, flashStock, discountPrice, durationMinutes = 60 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const stockCount = parseInt(flashStock, 10);
    const salePrice = parseFloat(discountPrice) || product.price * 0.5;

    // 1. Update product model in MongoDB
    product.flashSale = {
      isEnabled: true,
      discountPrice: salePrice,
      stock: stockCount,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + durationMinutes * 60 * 1000),
    };
    await product.save();

    // 2. Set Atomic counter in Redis with TTL
    const redisKey = `flash_stock:${productId}`;
    await redisClient.set(redisKey, stockCount.toString(), 'EX', durationMinutes * 60);

    // 3. Broadcast real-time flash sale announcement via Socket.io
    const io = getIO();
    io.emit('flash_sale_initialized', {
      productId: product._id,
      title: product.title,
      discountPrice: salePrice,
      initialStock: stockCount,
      durationMinutes,
    });

    emitKafkaEvent('FLASH_SALE_INITIALIZED', {
      productId: product._id,
      stock: stockCount,
      discountPrice: salePrice,
    });

    res.status(200).json({
      success: true,
      message: 'Flash sale initialized successfully with Redis atomic counter',
      data: {
        productId: product._id,
        stock: stockCount,
        discountPrice: salePrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * High-Concurrency Flash Sale Purchase
 * Uses Redis atomic DECR to eliminate database locking bottlenecks
 */
const participateInFlashSale = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const redisKey = `flash_stock:${productId}`;

    // 1. Check if flash sale exists in Redis
    const currentStockStr = await redisClient.get(redisKey);
    if (currentStockStr === null) {
      return res.status(400).json({
        success: false,
        message: 'No active flash sale found for this product, or sale has ended.',
      });
    }

    // 2. High-Concurrency Atomic Decrement (DECR)
    const remainingStock = await redisClient.decr(redisKey);

    // 3. Check for overselling (race-condition check)
    if (remainingStock < 0) {
      // Compensate back so counter doesn't become overly negative
      await redisClient.incr(redisKey);
      return res.status(410).json({
        success: false,
        code: 'OUT_OF_STOCK',
        message: 'Flash sale item is completely SOLD OUT! Better luck next time.',
      });
    }

    // 4. Fetch product details to prepare order payload
    const product = await Product.findById(productId);
    const orderNumber = `FLASH-${Date.now()}-${Math.random().toString(36).substring(5).toUpperCase()}`;
    const unitPrice = product.flashSale?.discountPrice || product.price;

    const orderData = {
      orderNumber,
      customer: userId,
      vendor: product.vendor,
      items: [
        {
          product: product._id,
          title: product.title,
          sku: product.sku,
          unitPrice,
          quantity: 1,
          subtotal: unitPrice,
          isFlashTrade: true,
        },
      ],
      totalAmount: unitPrice,
      paymentStatus: 'paid', // Fast simulated settlement for flash trade
      paymentMethod: 'stripe',
      orderStatus: 'placed',
      shippingAddress: req.body.shippingAddress || {
        street: '100 Silicon Blvd',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
      },
    };

    // 5. Asynchronously persist into MongoDB using BullMQ background queue
    await flashSaleOrderQueue.add('process-flash-order', {
      orderData,
      remainingStock,
    });

    // 6. Real-time broadcast to all clients via Socket.io
    const io = getIO();
    io.emit('flash_stock_updated', {
      productId,
      remainingStock,
    });

    // 7. Emit stream event to Apache Kafka for analytics
    emitKafkaEvent('FLASH_TRADE_SUCCESS', {
      userId,
      productId,
      orderNumber,
      remainingStock,
    });

    res.status(202).json({
      success: true,
      message: 'Flash trade secured! Order is queued for background processing.',
      orderNumber,
      remainingStock,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Flash Sale Live Status
 */
const getFlashSaleStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const redisKey = `flash_stock:${productId}`;

    const redisStock = await redisClient.get(redisKey);
    const product = await Product.findById(productId).populate('vendor', 'name companyName');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        product,
        liveStock: redisStock !== null ? parseInt(redisStock, 10) : product.flashSale?.stock || 0,
        isLive: redisStock !== null && parseInt(redisStock, 10) > 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializeFlashSale,
  participateInFlashSale,
  getFlashSaleStatus,
};

