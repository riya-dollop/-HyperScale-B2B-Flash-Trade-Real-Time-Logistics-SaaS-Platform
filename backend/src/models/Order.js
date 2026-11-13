const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: { type: String, required: true },
  sku: { type: String },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
  isFlashTrade: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cod', 'trade_credit'],
      default: 'stripe',
    },
    transactionId: {
      type: String,
      default: null,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    liveTracking: {
      driverName: { type: String, default: 'Logistics Partner Express' },
      driverPhone: { type: String, default: '+1 (800) 555-0199' },
      vehicleNumber: { type: String, default: 'TRK-9821-X' },
      currentLat: { type: Number, default: 28.6139 },
      currentLng: { type: Number, default: 77.2090 },
      etaMinutes: { type: Number, default: 45 },
      lastUpdated: { type: Date, default: Date.now },
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);

