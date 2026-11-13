const Product = require('../models/Product');
const { redisClient } = require('../config/redis');
const { uploadToS3 } = require('../config/s3');
const { emitKafkaEvent } = require('../events/kafkaProducer');

const CACHE_KEY_PRODUCTS = 'cache:products:all';
const CACHE_TTL = 300; // 5 minutes

/**
 * Get Products with Redis Cache-Aside Pattern
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, flashOnly } = req.query;

    // Build unique cache key based on query filters
    const filterKey = `cache:products:${category || 'all'}:${search || ''}:${flashOnly || 'false'}`;

    // 1. Check Redis Cache
    const cachedData = await redisClient.get(filterKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'redis_cache',
        data: JSON.parse(cachedData),
      });
    }

    // 2. Cache Miss: Query Database
    const query = { status: 'active' };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (flashOnly === 'true') query['flashSale.isEnabled'] = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).populate('vendor', 'name companyName').sort({ createdAt: -1 });

    // 3. Populate Redis Cache
    await redisClient.set(filterKey, JSON.stringify(products), 'EX', CACHE_TTL);

    res.status(200).json({
      success: true,
      source: 'mongodb_database',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Product By ID with Cache-Aside
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `cache:product:${id}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        source: 'redis_cache',
        data: JSON.parse(cached),
      });
    }

    const product = await Product.findById(id).populate('vendor', 'name companyName');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await redisClient.set(cacheKey, JSON.stringify(product), 'EX', CACHE_TTL);

    res.status(200).json({
      success: true,
      source: 'mongodb_database',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product with AWS S3 Image Upload & Cache Invalidation
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      sku,
      description,
      category,
      price,
      moq,
      b2bTierPricing,
      stock,
      flashSaleEnabled,
      flashDiscountPrice,
      flashStock,
    } = req.body;

    const imageUrls = [];

    // Process uploaded images via AWS S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `products/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const s3Result = await uploadToS3(file.buffer, fileName, file.mimetype);
        imageUrls.push(s3Result.url);
      }
    } else if (req.body.imageUrl) {
      imageUrls.push(req.body.imageUrl);
    }

    let parsedTierPricing = [];
    if (b2bTierPricing) {
      try {
        parsedTierPricing = typeof b2bTierPricing === 'string' ? JSON.parse(b2bTierPricing) : b2bTierPricing;
      } catch (e) {
        parsedTierPricing = [];
      }
    }

    const product = await Product.create({
      vendor: req.user.id,
      title,
      sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      description,
      category: category || 'General B2B',
      price: Number(price),
      moq: Number(moq) || 1,
      b2bTierPricing: parsedTierPricing,
      stock: Number(stock) || 0,
      flashSale: {
        isEnabled: flashSaleEnabled === 'true' || flashSaleEnabled === true,
        discountPrice: Number(flashDiscountPrice) || Number(price) * 0.7,
        stock: Number(flashStock) || 0,
      },
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'],
    });

    // Invalidate product catalog cache
    await redisClient.del(CACHE_KEY_PRODUCTS);

    // If flash sale is enabled, seed Redis stock counter immediately
    if (product.flashSale.isEnabled && product.flashSale.stock > 0) {
      await redisClient.set(`flash_stock:${product._id}`, product.flashSale.stock.toString());
    }

    emitKafkaEvent('PRODUCT_CREATED', {
      productId: product._id,
      vendorId: req.user.id,
      sku: product.sku,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Product & Invalidate Cache
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role verification: only Vendor owner or SuperAdmin can update
    if (req.user.role !== 'SuperAdmin' && product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this product' });
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

    // Cache Invalidation
    await redisClient.del(`cache:product:${id}`);
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Product & Invalidate Cache
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role !== 'SuperAdmin' && product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this product' });
    }

    await Product.findByIdAndDelete(id);

    // Invalidate Cache
    await redisClient.del(`cache:product:${id}`);
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

