const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Changed to String for hardcoded categories
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  badge: { type: String, default: null },
  image: { type: String, default: null },
  sortOrder: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
