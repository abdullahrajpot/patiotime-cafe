/**
 * Menu Controller - Handle HTTP requests for menu and categories
 */

const menuService = require('../services/menuService');

class MenuController {
  /**
   * Get full menu with categories OR filter by category
   * GET /api/menu
   * GET /api/menu?category=slug
   */
  async getMenu(req, res) {
    try {
      const { category } = req.query;
      
      // If category query parameter provided, filter by category
      if (category) {
        const items = await menuService.getMenuByCategory(category);
        return res.json(items);
      }
      
      // Otherwise return full menu with categories
      const menu = await menuService.getFullMenu();
      res.json(menu);
    } catch (err) {
      console.error('Get menu error:', err);
      res.status(500).json({ error: 'Failed to load menu', details: err.message });
    }
  }

  /**
   * Get all categories
   * GET /api/menu/categories
   */
  async getCategories(req, res) {
    try {
      const categories = await menuService.getActiveCategories();
      res.json(categories);
    } catch (err) {
      console.error('Get categories error:', err);
      res.status(500).json({ error: 'Failed to load categories' });
    }
  }

  /**
   * Get all menu items (admin)
   * GET /api/admin/menu
   */
  async getAllMenuItems(req, res) {
    try {
      const items = await menuService.getAllMenuItems();
      res.json(items);
    } catch (err) {
      console.error('Get menu items error:', err);
      res.status(500).json({ error: 'Failed to load menu items' });
    }
  }

  /**
   * Get menu item by ID (admin)
   * GET /api/admin/menu/:id
   */
  async getMenuItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await menuService.getMenuItemById(id);
      res.json(item);
    } catch (err) {
      console.error('Get menu item error:', err);
      
      if (err.message === 'Menu item not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to load menu item' });
    }
  }

  /**
   * Create menu item (admin)
   * POST /api/admin/menu
   */
  async createMenuItem(req, res) {
    try {
      const item = await menuService.createMenuItem(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error('Create menu item error:', err);
      
      if (err.message === 'Category not found') {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  }

  /**
   * Update menu item (admin)
   * PUT /api/admin/menu/:id
   */
  async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const item = await menuService.updateMenuItem(id, req.body);
      res.json(item);
    } catch (err) {
      console.error('Update menu item error:', err);
      
      if (err.message === 'Category not found' || err.message === 'Menu item not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }

  /**
   * Delete menu item (admin)
   * DELETE /api/admin/menu/:id
   */
  async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      const result = await menuService.deleteMenuItem(id);
      res.json(result);
    } catch (err) {
      console.error('Delete menu item error:', err);
      
      if (err.message === 'Menu item not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }

  /**
   * Get all categories (admin)
   * GET /api/admin/categories
   */
  async getAllCategories(req, res) {
    try {
      const categories = await menuService.getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error('Get all categories error:', err);
      res.status(500).json({ error: 'Failed to load categories' });
    }
  }

  /**
   * Create category (admin)
   * POST /api/admin/categories
   */
  async createCategory(req, res) {
    try {
      const category = await menuService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      console.error('Create category error:', err);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }

  /**
   * Update category (admin)
   * PUT /api/admin/categories/:id
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await menuService.updateCategory(id, req.body);
      res.json(category);
    } catch (err) {
      console.error('Update category error:', err);
      
      if (err.message === 'Category not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  /**
   * Delete category (admin)
   * DELETE /api/admin/categories/:id
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await menuService.deleteCategory(id);
      res.json(result);
    } catch (err) {
      console.error('Delete category error:', err);
      
      if (err.message === 'Category not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message.includes('existing menu items')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
}

module.exports = new MenuController();
