const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  eyebrow: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sortOrder: { type: Number, required: true, default: 1 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================
// Note: unique indexes already defined in schema

// Single field indexes
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ isActive: 1 });

// Compound index for filtered + sorted queries
categorySchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
