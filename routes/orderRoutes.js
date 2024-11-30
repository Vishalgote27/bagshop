const express = require('express');
const { placeOrder, getOrderById, getOrdersByUserId, getMonthlySales, getYearlySales, getTopProducts, getAllOrders } = require('../controllers/orderController');
const router = express.Router();
const protected = require("../middlewares/auth");

// POST route to place an order
router.post('/place-order', protected, placeOrder);
router.get('/order/:orderId', getOrderById);
router.get('/order', getOrderById);
router.get('/allorders', getAllOrders);
// Route to get all orders for a specific user
router.get('/orders/:userId', getOrdersByUserId);
router.get('/monthly-sales', getMonthlySales); // Monthly sales data route
router.get('/yearly-sales', getYearlySales); // Yearly sales data route
router.get("/top-products", getTopProducts);


module.exports = router;
