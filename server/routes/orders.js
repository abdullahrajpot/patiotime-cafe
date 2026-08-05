const express = require('express');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const router = express.Router();

const TAX_RATE = 0.08;

function genOrderCode() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `PT-${stamp}${rand}`;
}

// POST /api/orders -> create an order (checkout)
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, order_type, address, notes, items, user_id } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    const orderType = order_type === 'delivery' ? 'delivery' : 'pickup';
    if (orderType === 'delivery' && !address) {
      return res.status(400).json({ error: 'Address is required for delivery.' });
    }

    // Re-price server-side from the DB — never trust client-sent prices
    const menuItemIds = items.map((i) => i.menu_item_id).filter(Boolean);
    const menuDocs = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true });
    const menuMap = new Map(menuDocs.map((m) => [String(m._id), m]));

    let subtotal = 0;
    const lineItems = [];
    for (const line of items) {
      const menuItem = menuMap.get(String(line.menu_item_id));
      if (!menuItem) continue;
      const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
      subtotal += menuItem.price * qty;
      lineItems.push({ menuItem: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: qty });
    }
    if (lineItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart.' });
    }

    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    let orderCode;
    let order;
    // Retry on the rare chance of a code collision
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
      orderCode = genOrderCode();
      try {
        order = await Order.create({
          orderCode,
          user: user_id || null, // Save logged-in user ID
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
        if (err.code !== 11000) throw err; // not a duplicate-key error, rethrow
      }
    }
    if (!order) return res.status(500).json({ error: 'Could not generate a unique order code, try again.' });

    res.status(201).json({
      order_id: order._id,
      order_code: order.orderCode,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET /api/orders/track/:code -> customer order tracking
router.get('/track/:code', async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.code.toUpperCase() }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    res.json({
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
      status_flow: ['received', 'preparing', 'ready', 'completed'],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up order.' });
  }
});

// GET /api/orders/history/:userId -> get user order history
router.get('/history/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    const formattedOrders = orders.map(order => ({
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

    res.json(formattedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order history.' });
  }
});

module.exports = router;
