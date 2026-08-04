const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Hardcoded categories
const CATEGORIES = [
  { id: 'coffees-teas', name: 'Coffees & Teas', eyebrow: 'Best Drinks', sortOrder: 1 },
  { id: 'bakery-lunch', name: 'Bakery & Lunch', eyebrow: 'Delicious Food', sortOrder: 2 },
];

// GET /api/menu -> categories with their available items, nested
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort({ sortOrder: 1 }).lean();

    const result = CATEGORIES.map((cat) => ({
      _id: cat.id,
      name: cat.name,
      eyebrow: cat.eyebrow,
      sortOrder: cat.sortOrder,
      items: items.filter((i) => i.category === cat.id),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load menu.' });
  }
});

module.exports = router;
