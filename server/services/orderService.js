/**
 * Order Service - Business logic for orders
 */

const orderRepository = require('../repositories/orderRepository');
const menuRepository = require('../repositories/menuRepository');
const { maskOrderData } = require('../utils/maskData');

const TAX_RATE = 0.08;

class OrderService {
  /**
   * Generate unique order code
   */
  generateOrderCode() {
    const stamp = Date.now().toString(36).toUpperCase().slice(-4);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
    return `PT-${stamp}${rand}`;
  }

  /**
   * Calculate order pricing from menu items
   */
  async calculateOrderPricing(items) {
    // Extract menu item IDs
    const menuItemIds = items.map(i => i.menu_item_id).filter(Boolean);
    
    // Fetch menu items from database
    const menuDocs = await menuRepository.findItemsByIds(menuItemIds);
    const menuMap = new Map(menuDocs.map(m => [String(m._id), m]));

    let subtotal = 0;
    const lineItems = [];

    // Calculate prices from database (never trust client prices)
    for (const line of items) {
      const menuItem = menuMap.get(String(line.menu_item_id));
      if (!menuItem) continue; // Skip invalid items
      
      const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
      subtotal += menuItem.price * qty;
      
      lineItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty
      });
    }

    if (lineItems.length === 0) {
      throw new Error('No valid items in cart');
    }

    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return { subtotal, tax, total, lineItems };
  }

  /**
   * Create a new order
   */
  async createOrder(orderData, userId = null) {
    const { customer_name, customer_phone, customer_email, order_type, address, notes, items } = orderData;

    // Validate order type
    const orderType = order_type === 'delivery' ? 'delivery' : 'pickup';

    // Calculate pricing from database
    const { subtotal, tax, total, lineItems } = await this.calculateOrderPricing(items);

    // Generate unique order code (retry on collision)
    let orderCode;
    let order;
    
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
      orderCode = this.generateOrderCode();
      
      try {
        order = await orderRepository.create({
          orderCode,
          user: userId,
          customerName: customer_name,
          customerPhone: customer_phone,
          customerEmail: customer_email || null,
          orderType,
          address: address || null,
          notes: notes || null,
          items: lineItems,
          subtotal,
          tax,
          total,
          status: 'received',
        });
      } catch (err) {
        if (err.code !== 11000) throw err; // Not a duplicate key error
      }
    }

    if (!order) {
      throw new Error('Could not generate unique order code, try again');
    }

    return {
      order_id: order._id,
      order_code: order.orderCode,
      order_type: order.orderType,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
    };
  }

  /**
   * Get order by tracking code (PUBLIC - masks sensitive data)
   */
  async getOrderByCode(orderCode) {
    const order = await orderRepository.findByOrderCode(orderCode);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const orderData = {
      id: order._id,
      order_code: order.orderCode,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      order_type: order.orderType,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
      status_flow: ['received', 'preparing', 'ready', 'completed'],
    };

    // Mask sensitive data for public tracking
    return maskOrderData(orderData);
  }

  /**
   * Get order by ID (ADMIN - full data, no masking)
   */
  async getOrderById(orderId) {
    const order = await orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order._id,
      order_code: order.orderCode,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      order_type: order.orderType,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      status_history: order.statusHistory || [],
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    };
  }

  /**
   * Get user's order history
   */
  async getUserOrderHistory(userId) {
    const orders = await orderRepository.findByUserId(userId);

    return orders.map(order => ({
      id: order._id,
      order_code: order.orderCode,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      order_type: order.orderType,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
    }));
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(status = null) {
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await orderRepository.findOrders(filter);

    return orders.map(o => ({
      id: o._id,
      order_code: o.orderCode,
      customer_name: o.customerName,
      customer_phone: o.customerPhone,
      order_type: o.orderType,
      address: o.address,
      items: o.items,
      subtotal: o.subtotal,
      tax: o.tax,
      total: o.total,
      status: o.status,
      created_at: o.createdAt,
    }));
  }

  /**
   * Update order status (admin)
   */
  async updateOrderStatus(orderId, newStatus, adminUserId = null) {
    const validStatuses = ['received', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }

    // Get current order to check transition validity
    const currentOrder = await orderRepository.findById(orderId);
    
    if (!currentOrder) {
      throw new Error('Order not found');
    }

    // Check if transition is valid
    const STATUS_TRANSITIONS = {
      received: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed', 'cancelled'],
      completed: [], // Final state - cannot change
      cancelled: [], // Final state - cannot change
    };

    const allowedTransitions = STATUS_TRANSITIONS[currentOrder.status] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Cannot change status from ${currentOrder.status} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ') || 'none (final state)'}`
      );
    }

    const order = await orderRepository.updateStatus(orderId, newStatus, adminUserId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return { ok: true };
  }

  /**
   * Get order statistics
   */
  async getStatistics() {
    return orderRepository.getStatistics();
  }
}

module.exports = new OrderService();
