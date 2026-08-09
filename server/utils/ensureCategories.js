const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  {
    name: 'Coffees & Teas',
    eyebrow: 'Best Drinks',
    slug: 'coffees-teas',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Bakery & Lunch',
    eyebrow: 'Delicious Food',
    slug: 'bakery-lunch',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'All-Day Brunch',
    eyebrow: 'We Also Have',
    slug: 'all-day-brunch',
    sortOrder: 3,
    isActive: true,
  },
];

const SLUG_BY_NAME = Object.fromEntries(
  DEFAULT_CATEGORIES.map((c) => [c.name.toLowerCase(), c.slug])
);

async function ensureDefaultCategories() {
  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await Category.findOne({
      $or: [{ slug: cat.slug }, { name: cat.name }],
    });

    if (existing) {
      const updates = {};
      if (!existing.slug) updates.slug = cat.slug;
      if (!existing.eyebrow) updates.eyebrow = cat.eyebrow;
      if (existing.sortOrder == null) updates.sortOrder = cat.sortOrder;
      if (existing.isActive == null) updates.isActive = true;

      if (Object.keys(updates).length > 0) {
        await Category.updateOne({ _id: existing._id }, { $set: updates });
      }
      continue;
    }

    await Category.create(cat);
  }

  // Backfill slug on any legacy categories matched by name only
  const legacy = await Category.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
  for (const doc of legacy) {
    const slug = SLUG_BY_NAME[doc.name?.toLowerCase()];
    if (slug) {
      await Category.updateOne({ _id: doc._id }, { $set: { slug } });
    }
  }
}

async function resolveCategoryId(category) {
  const mongoose = require('mongoose');

  if (!category) return null;

  if (mongoose.Types.ObjectId.isValid(category)) {
    const byId = await Category.findById(category);
    if (byId) return byId._id;
  }

  let doc = await Category.findOne({ slug: category });
  if (doc) return doc._id;

  doc = await Category.findOne({ name: new RegExp(`^${category.replace(/-/g, '[\\s-]?')}$`, 'i') });
  if (doc) return doc._id;

  // Known slug → ensure DB has defaults, then retry
  const known = DEFAULT_CATEGORIES.find((c) => c.slug === category);
  if (known) {
    await ensureDefaultCategories();
    doc = await Category.findOne({ slug: category });
    if (doc) return doc._id;
  }

  return null;
}

module.exports = {
  DEFAULT_CATEGORIES,
  ensureDefaultCategories,
  resolveCategoryId,
};
