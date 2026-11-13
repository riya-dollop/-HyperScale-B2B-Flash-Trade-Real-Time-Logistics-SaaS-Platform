const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 200,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    moq: {
      // Minimum Order Quantity for B2B
      type: Number,
      default: 1,
      min: 1,
    },
    b2bTierPricing: [
      {
        minQty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    flashSale: {
      isEnabled: { type: Boolean, default: false },
      discountPrice: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
      startsAt: { type: Date },
      endsAt: { type: Date },
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid catalog filtering
productSchema.index({ category: 1, status: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);

