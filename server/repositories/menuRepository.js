/**
 * Menu Repository - Database operations for menu items and categories
 */

const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const {
  ensureDefaultCategories,
  migrateLegacyMenuCategories,
  buildCategoryLookup,
  getCategoryIdString,
  resolveCategoryRef,
} = require('../utils/ensureCategories');

class MenuRepository {
  // ========== MENU ITEMS ==========

  /**
   * Find all menu items with optional filters
   */
  async findMenuItems(filter = {}, options = {}) {
    const { sort = { sortOrder: 1 }, populate = false } = options;
    
    let query = MenuItem.find(filter).sort(sort);
    
    if (populate) {
      query = query.populate('category');
    }
    
    return query.lean();
  }

  /**
   * Find menu item by ID
   */
  async findMenuItemById(id, populate = false) {
    let query = MenuItem.findById(id);
    
    if (populate) {
      query = query.populate('category');
    }
    
    return query.lean();
  }

  /**
   * Find available menu items
   */
  async findAvailableItems(populate = true) {
    let query = MenuItem.find({ isAvailable: true }).sort({ sortOrder: 1 });
    
    if (populate) {
      query = query.populate('category');
    }
    
    return query.lean();
  }

  /**
   * Find menu items by category
   */
  async findItemsByCategory(categoryId) {
    return MenuItem.find({ category: categoryId, isAvailable: true })
      .sort({ sortOrder: 1 })
      .lean();
  }

  /**
   * Find menu items by IDs
   */
  async findItemsByIds(ids) {
    return MenuItem.find({ _id: { $in: ids }, isAvailable: true }).lean();
  }

  /**
   * Create menu item
   */
  async createMenuItem(itemData) {
    return MenuItem.create(itemData);
  }

  /**
   * Update menu item
   */
  async updateMenuItem(itemId, updateData) {
    return MenuItem.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(itemId) {
    return MenuItem.findByIdAndDelete(itemId);
  }

  // ========== CATEGORIES ==========

  /**
   * Find all categories
   */
  async findCategories(filter = {}) {
    return Category.find(filter).sort({ sortOrder: 1 }).lean();
  }

  /**
   * Find active categories (includes legacy docs without isActive field)
   */
  async findActiveCategories() {
    return Category.find({ isActive: { $ne: false } }).sort({ sortOrder: 1 }).lean();
  }

  /**
   * Find category by ID
   */
  async findCategoryById(id) {
    return Category.findById(id).lean();
  }

  /**
   * Find category by slug
   */
  async findCategoryBySlug(slug) {
    return Category.findOne({ slug }).lean();
  }

  /**
   * Create category
   */
  async createCategory(categoryData) {
    return Category.create(categoryData);
  }

  /**
   * Update category
   */
  async updateCategory(categoryId, updateData) {
    return Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId) {
    return Category.findByIdAndDelete(categoryId);
  }

  /**
   * Get menu with categories and items grouped (no populate — safe for legacy data)
   */
  async getMenuWithCategories() {
    await ensureDefaultCategories();
    await migrateLegacyMenuCategories();

    let categories = await this.findActiveCategories();
    if (!categories.length) {
      categories = await this.findCategories();
    }

    const items = await MenuItem.find({ isAvailable: true }).sort({ sortOrder: 1 }).lean();
    const lookup = buildCategoryLookup(categories);

    return categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      eyebrow: cat.eyebrow,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      items: items
        .filter((item) => getCategoryIdString(item.category, lookup) === String(cat._id))
        .map(({ category, ...item }) => item),
    }));
  }

  /**
   * Attach populated category objects without Mongoose populate
   */
  async attachCategories(items) {
    const categories = await Category.find().lean();
    const lookup = buildCategoryLookup(categories);

    return items.map((item) => ({
      ...item,
      category: resolveCategoryRef(item.category, lookup),
    }));
  }
}

module.exports = new MenuRepository();
