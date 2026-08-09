const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now },
});

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Single field indexes
contactSchema.index({ status: 1 }); // Filter by status (new, read, replied)
contactSchema.index({ createdAt: -1 }); // Sort by creation date
contactSchema.index({ email: 1 }); // Lookup by email

// Compound indexes
contactSchema.index({ status: 1, createdAt: -1 }); // Filter + sort
contactSchema.index({ email: 1, createdAt: -1 }); // User's messages

// Text index for search
contactSchema.index({ subject: 'text', message: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
