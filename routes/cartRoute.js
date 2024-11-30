// routes/cartRoutes.js

const express = require('express');
const { addToCart } = require('../controllers/cartController');
const router = express.Router();

// Add item to the cart (POST request)
router.post('/:userId/add', addToCart);

// Export the routes
module.exports = router;
