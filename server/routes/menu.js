const express = require('express');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET /api/menu -> categories with their available items, nested
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 }).lean();
    const items = await MenuItem.find({ isAvailable: true }).sort({ sortOrder: 1 }).lean();

    const result = categories.map((cat) => ({
      ...cat,
      items: items.filter((i) => String(i.category) === String(cat._id)),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load menu.' });
  }
});

module.exports = router;
