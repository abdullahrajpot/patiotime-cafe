/**
 * Order Repository - Database operations for orders
 */

const Order = require('../models/Order');

class OrderRepository {
  /**
   * Find orders with filters
   */
  async findOrders(filter = {}, options = {}) {
    const { sort = { createdAt: -1 }, limit, skip } = options;
    
    let query = Order.find(filter).sort(sort);
    
    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);
    
    return query.lean();
  }

  /**
   * Find order by ID
   */
  async findById(id) {
    return Order.findById(id).lean();
  }

  /**
   * Find order by order code
   */
  async findByOrderCode(orderCode) {
    return Order.findOne({ orderCode: orderCode.toUpperCase() }).lean();
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  }

  /**
   * Create new order
   */
  async create(orderData) {
    return Order.create(orderData);
  }

  /**
   * Update order status
   */
  async updateStatus(orderId, status, updatedBy = null) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return null;
    }

    // Set the new status
    order.status = status;
    
    // Add to status history with who updated it
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      updatedBy: updatedBy
    });

    await order.save();
    return order;
  }

  /**
   * Update order
   */
  async update(orderId, updateData) {
    return Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete order
   */
  async delete(orderId) {
    return Order.findByIdAndDelete(orderId);
  }

  /**
   * Count orders by filter
   */
  async count(filter = {}) {
    return Order.countDocuments(filter);
  }

  /**
   * Get order statistics
   */
  async getStatistics() {
    const totalOrders = await Order.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    return {
      totalOrders,
      todayOrders,
      statusCounts,
      totalRevenue: totalRevenue[0]?.total || 0
    };
  }
}

module.exports = new OrderRepository();
