const Order = require('../models/Order');
const Product = require('../models/Product');
const { invoiceQueue, notificationQueue } = require('../queues/queue');
const { publishEvent } = require('../events/rabbitProducer');
const { getIO } = require('../config/socket');
const { emitKafkaEvent } = require('../events/kafkaProducer');

/**
 * Create standard B2B Order with MOQ & Tiered Pricing calculation
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'stripe' } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    let calculatedTotal = 0;
    const orderItems = [];
    let vendorId = null;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      // Check Minimum Order Quantity (MOQ)
      if (item.quantity < (product.moq || 1)) {
        return res.status(400).json({
          success: false,
          message: `Item "${product.title}" has a Minimum Order Quantity (MOQ) of ${product.moq} units.`,
        });
      }

      // Calculate B2B Tiered Pricing if applicable
      let unitPrice = product.price;
      if (product.b2bTierPricing && product.b2bTierPricing.length > 0) {
        const sortedTiers = [...product.b2bTierPricing].sort((a, b) => b.minQty - a.minQty);
        for (const tier of sortedTiers) {
          if (item.quantity >= tier.minQty) {
            unitPrice = tier.unitPrice;
            break;
          }
        }
      }

      const subtotal = unitPrice * item.quantity;
      calculatedTotal += subtotal;
      vendorId = product.vendor;

      orderItems.push({
        product: product._id,
        title: product.title,
        sku: product.sku,
        unitPrice,
        quantity: item.quantity,
        subtotal,
        isFlashTrade: false,
      });

      // Inter-service inventory sync event via RabbitMQ
      await publishEvent('inventory.sync', {
        productId: product._id,
        quantity: item.quantity,
      });
    }

    const orderNumber = `B2B-${Date.now()}-${Math.random().toString(36).substring(6).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customer: userId,
      vendor: vendorId,
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentStatus: 'pending',
      paymentMethod,
      orderStatus: 'placed',
      shippingAddress,
      liveTracking: {
        driverName: 'FedEx Express Freight',
        driverPhone: '+1-800-463-3339',
        vehicleNumber: 'US-TRK-771',
        currentLat: 37.7749,
        currentLng: -122.4194,
        etaMinutes: 120,
      },
    });

    // Enqueue PDF Invoice Generation in BullMQ
    await invoiceQueue.add('generate-invoice', { orderId: order._id });

    // Enqueue notification job
    await notificationQueue.add('send-notification', {
      type: 'EMAIL_INVOICE',
      recipient: req.user.email,
      payload: { orderNumber: order.orderNumber, amount: calculatedTotal },
    });

    emitKafkaEvent('ORDER_CREATED', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: calculatedTotal,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'B2B Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Orders (Filtered by Role: Customer sees own, Vendor sees incoming, SuperAdmin sees all)
 */
const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    } else if (req.user.role === 'Vendor') {
      filter.vendor = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email companyName')
      .populate('vendor', 'name companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Order By ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email companyName')
      .populate('vendor', 'name companyName');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Real-Time Logistics Tracking (GPS Location & ETA)
 */
const updateTrackingLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentLat, currentLng, etaMinutes, orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (currentLat !== undefined) order.liveTracking.currentLat = Number(currentLat);
    if (currentLng !== undefined) order.liveTracking.currentLng = Number(currentLng);
    if (etaMinutes !== undefined) order.liveTracking.etaMinutes = Number(etaMinutes);
    if (orderStatus) order.orderStatus = orderStatus;
    order.liveTracking.lastUpdated = new Date();

    await order.save();

    // Broadcast live telemetry update to room listeners via Socket.io
    const io = getIO();
    io.to(`order_${order._id}`).emit('delivery_location_changed', {
      orderId: order._id,
      lat: order.liveTracking.currentLat,
      lng: order.liveTracking.currentLng,
      etaMinutes: order.liveTracking.etaMinutes,
      orderStatus: order.orderStatus,
      lastUpdated: order.liveTracking.lastUpdated,
    });

    res.status(200).json({
      success: true,
      message: 'Logistics tracking coordinates updated & streamed',
      data: order.liveTracking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateTrackingLocation,
};

