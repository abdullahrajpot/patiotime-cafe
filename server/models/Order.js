const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['received', 'preparing', 'ready', 'completed', 'cancelled'],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who updated
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Link to logged-in user
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: null },
    orderType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    address: { type: String, default: null },
    notes: { type: String, default: null },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['received', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'received',
    },
    statusHistory: { type: [statusHistorySchema], default: [] }, // Track status changes
  },
  { timestamps: true }
);

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Single field indexes for common queries
orderSchema.index({ orderCode: 1 }); // Already exists - for order tracking (unique)
orderSchema.index({ user: 1 }); // Already exists - for user order history
orderSchema.index({ status: 1 }); // Already exists - for filtering by status
orderSchema.index({ createdAt: -1 }); // Already exists - for sorting by date

// Compound indexes for complex queries
orderSchema.index({ user: 1, status: 1 }); // User's orders filtered by status
orderSchema.index({ user: 1, createdAt: -1 }); // User's orders sorted by date
orderSchema.index({ status: 1, createdAt: -1 }); // Admin view: filter + sort
orderSchema.index({ customerEmail: 1, createdAt: -1 }); // Guest order lookup by email

// Text index for search functionality (future)
orderSchema.index({ customerName: 'text', customerEmail: 'text', orderCode: 'text' });

module.exports = mongoose.model('Order', orderSchema);
