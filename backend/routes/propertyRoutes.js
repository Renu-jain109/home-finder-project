const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  seedProperties,
  getMyProperties,
} = require('../controllers/propertyController');

// Seed route (for testing)
router.post('/seed', seedProperties);

// Get my properties (must come before /:id)
router.get('/my', getMyProperties);

// Main CRUD routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;
