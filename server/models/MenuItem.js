const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  badge: { type: String, default: null },
  image: { type: String, default: null },
  sortOrder: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
}, {
  timestamps: true // Add timestamps for tracking
});

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Compound index for menu display (category + sort order)
menuItemSchema.index({ category: 1, sortOrder: 1 }); // Already exists - main menu query

// Single field indexes
menuItemSchema.index({ isAvailable: 1 }); // Already exists - filter available items
menuItemSchema.index({ badge: 1 }); // Filter by badge (new, popular, special)
menuItemSchema.index({ price: 1 }); // Sort by price (future feature)

// Compound indexes for filtered queries
menuItemSchema.index({ category: 1, isAvailable: 1 }); // Available items per category
menuItemSchema.index({ isAvailable: 1, sortOrder: 1 }); // Available items sorted

// Text index for search functionality (future)
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
