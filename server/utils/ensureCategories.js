const mongoose = require('mongoose');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

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
      if (existing.isActive !== true) updates.isActive = true;

      if (Object.keys(updates).length > 0) {
        await Category.updateOne({ _id: existing._id }, { $set: updates });
      }
      continue;
    }

    await Category.create(cat);
  }

  const legacy = await Category.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  });
  for (const doc of legacy) {
    const slug = SLUG_BY_NAME[doc.name?.toLowerCase()];
    if (slug) {
      await Category.updateOne({ _id: doc._id }, { $set: { slug, isActive: true } });
    }
  }
}

/** Convert legacy string category slugs on menu items to ObjectIds */
async function migrateLegacyMenuCategories() {
  await ensureDefaultCategories();

  const categories = await Category.find().lean();
  const slugToId = new Map(categories.filter((c) => c.slug).map((c) => [c.slug, c._id]));
  const nameToId = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));

  const items = await MenuItem.find().select('_id category').lean();

  for (const item of items) {
    const cat = item.category;
    if (!cat) continue;

    const asString = String(cat);
    if (mongoose.Types.ObjectId.isValid(asString) && asString.length === 24) {
      continue;
    }

    const newId =
      slugToId.get(asString) ||
      nameToId.get(asString.toLowerCase()) ||
      slugToId.get(asString.replace(/\s+/g, '-').toLowerCase());

    if (newId) {
      await MenuItem.updateOne({ _id: item._id }, { $set: { category: newId } });
    }
  }
}

function buildCategoryLookup(categories) {
  const byId = new Map();
  const bySlug = new Map();

  for (const cat of categories) {
    byId.set(String(cat._id), cat);
    if (cat.slug) bySlug.set(cat.slug, cat);
    if (cat.name) bySlug.set(cat.name.toLowerCase(), cat);
  }

  return { byId, bySlug };
}

function resolveCategoryRef(rawCategory, lookup) {
  if (!rawCategory) return null;

  if (typeof rawCategory === 'object' && rawCategory._id) {
    return lookup.byId.get(String(rawCategory._id)) || rawCategory;
  }

  const key = String(rawCategory);
  if (mongoose.Types.ObjectId.isValid(key) && key.length === 24) {
    return lookup.byId.get(key) || null;
  }

  return lookup.bySlug.get(key) || lookup.bySlug.get(key.toLowerCase()) || null;
}

function getCategoryIdString(rawCategory, lookup) {
  const resolved = resolveCategoryRef(rawCategory, lookup);
  if (!resolved) return null;
  return String(resolved._id || resolved);
}

async function resolveCategoryId(category) {
  if (!category) return null;

  if (mongoose.Types.ObjectId.isValid(category)) {
    const byId = await Category.findById(category);
    if (byId) return byId._id;
  }

  let doc = await Category.findOne({ slug: category });
  if (doc) return doc._id;

  doc = await Category.findOne({
    name: new RegExp(`^${String(category).replace(/-/g, '[\\s-]?')}$`, 'i'),
  });
  if (doc) return doc._id;

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
  migrateLegacyMenuCategories,
  buildCategoryLookup,
  resolveCategoryRef,
  getCategoryIdString,
  resolveCategoryId,
};
