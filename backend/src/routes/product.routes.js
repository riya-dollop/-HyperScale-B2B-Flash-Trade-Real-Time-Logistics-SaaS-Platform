const express = require('express');
const multer = require('multer');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  authenticate,
  authorize('Vendor', 'SuperAdmin'),
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('Vendor', 'SuperAdmin'),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('Vendor', 'SuperAdmin'),
  deleteProduct
);

module.exports = router;

