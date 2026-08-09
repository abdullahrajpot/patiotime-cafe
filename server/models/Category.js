const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  eyebrow: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // For URL-friendly names
  sortOrder: { type: Number, required: true, default: 1 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Unique indexes (already enforced by unique: true in schema)
categorySchema.index({ slug: 1 }, { unique: true }); // URL lookup

// Single field indexes
categorySchema.index({ sortOrder: 1 }); // Already exists - for display order
categorySchema.index({ isActive: 1 }); // Filter active categories
categorySchema.index({ name: 1 }); // Lookup by name

// Compound index for filtered + sorted queries
categorySchema.index({ isActive: 1, sortOrder: 1 }); // Active categories in order

module.exports = mongoose.model('Category', categorySchema);
