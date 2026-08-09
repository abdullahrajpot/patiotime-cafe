/**
 * Order Controller - Handle HTTP requests for orders
 */

const orderService = require('../services/orderService');

class OrderController {
  /**
   * Create new order
   * POST /api/orders
   */
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const userId = req.user ? req.user.userId : null;

      const result = await orderService.createOrder(orderData, userId);
      
      res.status(201).json(result);
    } catch (err) {
      console.error('Order creation error:', err);
      
      // Return 400 for validation/business logic errors
      if (err.message.includes('No valid items') || 
          err.message.includes('Could not generate unique order code')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Failed to create order' });
    }
  }

  /**
   * Track order by code
   * GET /api/orders/track/:code
   */
  async trackOrder(req, res) {
    try {
      const { code } = req.params;
      const order = await orderService.getOrderByCode(code);
      
      res.json(order);
    } catch (err) {
      console.error('Order tracking error:', err);
      
      if (err.message === 'Order not found') {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.status(500).json({ error: 'Failed to track order' });
    }
  }

  /**
   * Get user's order history
   * GET /api/orders/history
   */
  async getOrderHistory(req, res) {
    try {
      const userId = req.user.userId;
      const orders = await orderService.getUserOrderHistory(userId);
      
      res.json(orders);
    } catch (err) {
      console.error('Order history error:', err);
      res.status(500).json({ error: 'Failed to fetch order history' });
    }
  }

  /**
   * Get all orders (admin)
   * GET /api/admin/orders
   */
  async getAllOrders(req, res) {
    try {
      const { status } = req.query;
      const orders = await orderService.getAllOrders(status);
      
      res.json(orders);
    } catch (err) {
      console.error('Get orders error:', err);
      res.status(500).json({ error: 'Failed to load orders' });
    }
  }

  /**
   * Get order by ID (admin) - shows full data with status history
   * GET /api/admin/orders/:id
   */
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      
      res.json(order);
    } catch (err) {
      console.error('Get order by ID error:', err);
      
      if (err.message === 'Order not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to load order' });
    }
  }

  /**
   * Update order status (admin)
   * PATCH /api/admin/orders/:id/status
   */
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminUserId = req.user.userId; // Get admin user ID from token

      const result = await orderService.updateOrderStatus(id, status, adminUserId);
      
      res.json(result);
    } catch (err) {
      console.error('Update order status error:', err);
      
      if (err.message.includes('Invalid status') || err.message.includes('Cannot change status')) {
        return res.status(400).json({ error: err.message });
      }
      
      if (err.message === 'Order not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  /**
   * Get order statistics (admin)
   * GET /api/admin/orders/statistics
   */
  async getStatistics(req, res) {
    try {
      const stats = await orderService.getStatistics();
      res.json(stats);
    } catch (err) {
      console.error('Get statistics error:', err);
      res.status(500).json({ error: 'Failed to load statistics' });
    }
  }
}

module.exports = new OrderController();
