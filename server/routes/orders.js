const express = require('express');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { validateCreateOrder } = require('../middleware/validation');
const orderController = require('../controllers/orderController');

const router = express.Router();

// POST /api/orders -> create an order (checkout)
router.post('/', optionalAuth, validateCreateOrder, orderController.createOrder.bind(orderController));

// GET /api/orders/track/:code -> customer order tracking
router.get('/track/:code', orderController.trackOrder.bind(orderController));

// GET /api/orders/history -> get authenticated user's order history (PROTECTED)
router.get('/history', authenticateToken, orderController.getOrderHistory.bind(orderController));

module.exports = router;
