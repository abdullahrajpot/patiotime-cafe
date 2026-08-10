/**
 * Menu Service - Business logic for menu items and categories
 */

const menuRepository = require('../repositories/menuRepository');

class MenuService {
  /**
   * Get full menu with categories and items
   */
  async getFullMenu() {
    return menuRepository.getMenuWithCategories();
  }

  /**
   * Get menu items by category slug
   */
  async getMenuByCategory(categorySlug) {
    // Find category by slug
    const category = await menuRepository.findCategoryBySlug(categorySlug);
    
    if (!category) {
      return []; // Return empty array if category not found
    }

    // Get items for this category
    const items = await menuRepository.findItemsByCategory(category._id);
    
    return items.map(item => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      badge: item.badge,
      image: item.image,
      sortOrder: item.sortOrder
    }));
  }

  /**
   * Get all menu items (admin)
   */
  async getAllMenuItems() {
    const items = await menuRepository.findMenuItems({}, { sort: { sortOrder: 1 } });
    return menuRepository.attachCategories(items);
  }

  /**
   * Get menu item by ID
   */
  async getMenuItemById(itemId) {
    const item = await menuRepository.findMenuItemById(itemId, true);
    
    if (!item) {
      throw new Error('Menu item not found');
    }
    
    return item;
  }

  /**
   * Create menu item
   */
  async createMenuItem(itemData) {
    const { name, description, price, category, badge, image, sortOrder } = itemData;

    // Validate category exists
    const categoryExists = await menuRepository.findCategoryById(category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    const item = await menuRepository.createMenuItem({
      name,
      description: description || '',
      price,
      category,
      badge: badge || null,
      image: image || null,
      sortOrder: sortOrder || 1,
      isAvailable: true,
    });

    return menuRepository.findMenuItemById(item._id, true);
  }

  /**
   * Update menu item
   */
  async updateMenuItem(itemId, updateData) {
    const { name, description, price, category, badge, image, sortOrder, isAvailable } = updateData;

    // If category is being updated, validate it exists
    if (category) {
      const categoryExists = await menuRepository.findCategoryById(category);
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }

    const item = await menuRepository.updateMenuItem(itemId, {
      name,
      description,
      price,
      category,
      badge: badge || null,
      image: image || null,
      sortOrder,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    if (!item) {
      throw new Error('Menu item not found');
    }

    return item;
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(itemId) {
    const item = await menuRepository.deleteMenuItem(itemId);
    
    if (!item) {
      throw new Error('Menu item not found');
    }

    return { ok: true, message: 'Item deleted successfully' };
  }

  /**
   * Get all categories
   */
  async getAllCategories() {
    return menuRepository.findCategories();
  }

  /**
   * Get active categories
   */
  async getActiveCategories() {
    return menuRepository.findActiveCategories();
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId) {
    const category = await menuRepository.findCategoryById(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  }

  /**
   * Create category
   */
  async createCategory(categoryData) {
    const { name, eyebrow, slug, sortOrder } = categoryData;

    return menuRepository.createCategory({
      name,
      eyebrow,
      slug,
      sortOrder: sortOrder || 1,
      isActive: true,
    });
  }

  /**
   * Update category
   */
  async updateCategory(categoryId, updateData) {
    const category = await menuRepository.updateCategory(categoryId, updateData);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId) {
    // Check if category has menu items
    const items = await menuRepository.findItemsByCategory(categoryId);
    
    if (items.length > 0) {
      throw new Error('Cannot delete category with existing menu items');
    }

    const category = await menuRepository.deleteCategory(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    return { ok: true, message: 'Category deleted successfully' };
  }
}

module.exports = new MenuService();
