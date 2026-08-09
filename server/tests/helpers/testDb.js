/**
 * Test Database Helper
 * Provides utilities for managing test database connections and cleanup
 */

const mongoose = require('mongoose');
const User = require('../../models/User');
const Order = require('../../models/Order');
const MenuItem = require('../../models/MenuItem');
const Category = require('../../models/Category');
const bcrypt = require('bcryptjs');

class TestDatabase {
  /**
   * Connect to test database
   */
  async connect() {
    if (mongoose.connection.readyState !== 0) {
      return; // Already connected
    }

    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/patiotime-test';
    
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Test database connected');
    } catch (err) {
      console.error('❌ Test database connection failed:', err.message);
      throw err;
    }
  }

  /**
   * Disconnect from test database
   */
  async disconnect() {
    if (mongoose.connection.readyState === 0) {
      return; // Already disconnected
    }

    try {
      await mongoose.disconnect();
      console.log('✅ Test database disconnected');
    } catch (err) {
      console.error('❌ Test database disconnect failed:', err.message);
      throw err;
    }
  }

  /**
   * Clear all data from test database
   */
  async clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  /**
   * Create a test user
   */
  async createUser(userData = {}) {
    const defaultUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'customer',
    };

    const user = new User({ ...defaultUser, ...userData });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    return user;
  }

  /**
   * Create a test admin user
   */
  async createAdmin(adminData = {}) {
    return this.createUser({
      name: 'Admin User',
      email: `admin-${Date.now()}@example.com`,
      password: 'Admin123!',
      role: 'admin',
      ...adminData,
    });
  }

  /**
   * Create test categories
   */
  async createCategories() {
    const categories = [
      {
        name: 'Coffee',
        eyebrow: 'HOT DRINKS',
        slug: 'coffee',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Food',
        eyebrow: 'FOOD',
        slug: 'food',
        sortOrder: 2,
        isActive: true,
      },
    ];

    return Category.insertMany(categories);
  }

  /**
   * Create test menu items
   */
  async createMenuItems(categoryId) {
    const items = [
      {
        name: 'Espresso',
        description: 'Strong coffee',
        price: 3.50,
        category: categoryId,
        image: '/images/espresso.jpg',
        sortOrder: 1,
        isAvailable: true,
      },
      {
        name: 'Latte',
        description: 'Smooth and creamy',
        price: 4.50,
        category: categoryId,
        image: '/images/latte.jpg',
        sortOrder: 2,
        isAvailable: true,
      },
    ];

    return MenuItem.insertMany(items);
  }

  /**
   * Create a test order
   */
  async createOrder(orderData = {}, userId = null) {
    const defaultOrder = {
      orderCode: `TEST-${Date.now().toString(36).toUpperCase()}`,
      user: userId,
      customerName: 'John Doe',
      customerPhone: '555-999-8888',
      customerEmail: 'john@example.com',
      orderType: 'pickup',
      items: [],
      subtotal: 10.00,
      tax: 0.80,
      total: 10.80,
      status: 'received',
    };

    const order = new Order({ ...defaultOrder, ...orderData });
    await order.save();
    return order;
  }

  /**
   * Seed database with test data
   */
  async seedDatabase() {
    // Create categories
    const categories = await this.createCategories();
    
    // Create menu items
    const menuItems = await this.createMenuItems(categories[0]._id);
    
    // Create test users
    const customer = await this.createUser();
    const admin = await this.createAdmin();

    return {
      categories,
      menuItems,
      customer,
      admin,
    };
  }
}

module.exports = new TestDatabase();
