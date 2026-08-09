const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  specialRequests: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
});

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Single field indexes
reservationSchema.index({ date: 1 }); // Filter by reservation date
reservationSchema.index({ status: 1 }); // Filter by status
reservationSchema.index({ email: 1 }); // Lookup by email
reservationSchema.index({ createdAt: -1 }); // Sort by creation date

// Compound indexes for complex queries
reservationSchema.index({ date: 1, time: 1 }); // Check availability by date+time
reservationSchema.index({ status: 1, date: 1 }); // Filter status + date
reservationSchema.index({ email: 1, date: -1 }); // User's reservations

module.exports = mongoose.model('Reservation', reservationSchema);
