const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

const STATUSES = ['received', 'preparing', 'ready', 'completed', 'cancelled'];

// GET /api/admin/orders?status= -> order board list
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    res.json(
      orders.map((o) => ({
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
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders.' });
  }
});

// PATCH /api/admin/orders/:id/status -> advance/change an order's status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order.' });
  }
});

module.exports = router;
