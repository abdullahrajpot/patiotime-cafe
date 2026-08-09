/**
 * Authorization Tests
 * Tests role-based access control and admin permissions
 */

const request = require('supertest');
const app = require('../server');
const testDb = require('./helpers/testDb');

describe('Authorization Tests', () => {
  let adminToken;
  let userToken;
  let menuItem;
  let orderId;

  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
    
    // Seed database
    const seedData = await testDb.seedDatabase();
    menuItem = seedData.menuItems[0];

    // Register regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'Test123!',
      });
    userToken = userResponse.body.token;

    // Create admin user and login
    await testDb.createAdmin({ email: 'admin@example.com' });
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!',
      });
    adminToken = adminResponse.body.token;

    // Create a test order
    const orderResponse = await request(app)
      .post('/api/orders')
      .send({
        customer_name: 'Test Customer',
        customer_phone: '555-999-0000',
        order_type: 'pickup',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 1,
          },
        ],
      });
    orderId = orderResponse.body.order_id;
  });

  describe('Admin Access Control', () => {
    test('admin can access admin dashboard', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('admin can view all orders', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('admin can view order by ID with full data', async () => {
      const response = await request(app)
        .get(`/api/admin/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('customer_name');
      expect(response.body).toHaveProperty('customer_phone');
      expect(response.body).toHaveProperty('status_history');
      
      // Admin should see full, unmasked data
      expect(response.body.customer_phone).not.toContain('***');
    });

    test('admin can update order status', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(true);
    });

    test('admin can create menu items', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Coffee',
          description: 'Delicious new coffee',
          price: 5.50,
          category: menuItem.category.toString(),
          image: '/images/new-coffee.jpg',
          sortOrder: 1,
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('New Coffee');
    });

    test('admin can update menu items', async () => {
      const response = await request(app)
        .put(`/api/admin/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Espresso',
          description: menuItem.description,
          price: 4.00,
          category: menuItem.category.toString(),
          image: menuItem.image,
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Espresso');
      expect(response.body.price).toBe(4.00);
    });

    test('admin can delete menu items', async () => {
      const response = await request(app)
        .delete(`/api/admin/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');
    });

    test.skip('admin can view statistics', async () => {
      // TODO: Implement /api/admin/stats endpoint
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total_orders');
      expect(response.body).toHaveProperty('total_revenue');
    });
  });

  describe('Regular User Access Restrictions', () => {
    test('regular user cannot access admin orders', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Admin access required');
    });

    test('regular user cannot view order by ID (admin endpoint)', async () => {
      const response = await request(app)
        .get(`/api/admin/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Admin access required');
    });

    test('regular user cannot update order status', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'preparing' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Admin access required');
    });

    test('regular user cannot create menu items', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Item',
          description: 'Should not be created',
          price: 5.00,
          category: menuItem.category.toString(),
        })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('regular user cannot update menu items', async () => {
      const response = await request(app)
        .put(`/api/admin/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Update',
          price: 999.99,
        })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('regular user cannot delete menu items', async () => {
      const response = await request(app)
        .delete(`/api/admin/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test.skip('regular user cannot view statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Unauthenticated Access Restrictions', () => {
    test('unauthenticated cannot access admin orders', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token required');
    });

    test('unauthenticated cannot update order status', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .send({ status: 'preparing' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('unauthenticated cannot create menu items', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .send({
          name: 'Unauthorized Item',
          price: 5.00,
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('unauthenticated cannot access protected user routes', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Token Validation in Admin Routes', () => {
    test('should reject invalid token on admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', 'Bearer invalid-token-12345')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid or expired token');
    });

    test('should reject malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject missing bearer prefix', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', adminToken) // Missing "Bearer " prefix
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Role Persistence', () => {
    test('user role should not change after registration', async () => {
      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Role Test User',
          email: 'roletest@example.com',
          password: 'Test123!',
        });

      expect(registerResponse.body.user.role).toBe('customer');

      // Login again
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'roletest@example.com',
          password: 'Test123!',
        });

      expect(loginResponse.body.user.role).toBe('customer');
    });

    test('admin role should persist after login', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!',
        });

      expect(loginResponse.body.user.role).toBe('admin');
    });
  });
});
