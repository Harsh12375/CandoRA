const express = require('express');
const { body, query, param } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createSweet, getSweets, searchSweets, updateSweet, deleteSweet } = require('../controllers/sweetController');
const { purchaseSweet, restockSweet } = require('../controllers/inventoryController');

const router = express.Router();

// All sweets routes are protected
router.use(protect);

// Create a sweet
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  validate,
  createSweet
);

// List all sweets
router.get('/', getSweets);

// Search sweets
router.get(
  '/search',
  [
    query('name').optional().isString(),
    query('category').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
  ],
  validate,
  searchSweets
);

// Update a sweet
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid id'),
    body('price').optional().isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 0 }),
  ],
  validate,
  updateSweet
);

// Delete a sweet (Admin only)
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid id')],
  authorize('admin'),
  validate,
  deleteSweet
);

// Purchase a sweet
router.post(
  '/:id/purchase',
  [param('id').isMongoId().withMessage('Invalid id'), body('amount').optional().isInt({ min: 1 })],
  validate,
  purchaseSweet
);

// Restock a sweet (Admin only)
router.post(
  '/:id/restock',
  [param('id').isMongoId().withMessage('Invalid id'), body('amount').isInt({ min: 1 }).withMessage('Amount must be at least 1')],
  authorize('admin'),
  validate,
  restockSweet
);

module.exports = router;
