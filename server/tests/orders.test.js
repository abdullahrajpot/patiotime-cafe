/**
 * Order Tests
 * Tests order creation, tracking, history, and security (IDOR protection)
 */

const request = require('supertest');
const app = require('../server');
const testDb = require('./helpers/testDb');

describe('Order Tests', () => {
  let menuItem;
  let category;
  let userToken;
  let userId;

  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
    
    // Seed database with test data
    const seedData = await testDb.seedDatabase();
    category = seedData.categories[0];
    menuItem = seedData.menuItems[0];

    // Register a user and get token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!',
      });
    
    userToken = userResponse.body.token;
    userId = userResponse.body.user._id;
  });

  describe('POST /api/orders', () => {
    test('should create order as guest user', async () => {
      const orderData = {
        customer_name: 'Guest User',
        customer_phone: '555-999-8888',
        customer_email: 'guest@example.com',
        order_type: 'pickup',
        notes: 'Please call when ready',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 2,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body).toHaveProperty('order_code');
      expect(response.body).toHaveProperty('total');
      expect(response.body.status).toBe('received');
      expect(response.body.order_code).toMatch(/^PT-/);
    });

    test('should create order as authenticated user', async () => {
      const orderData = {
        customer_name: 'Auth User',
        customer_phone: '555-111-2222',
        customer_email: 'auth@example.com',
        order_type: 'delivery',
        address: '123 Main St, City, State 12345',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body).toHaveProperty('order_code');
      expect(response.body.order_type).toBe('delivery');
    });

    test('should calculate prices server-side (never trust client)', async () => {
      const orderData = {
        customer_name: 'Price Test User',
        customer_phone: '555-333-4444',
        order_type: 'pickup',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 2,
            price: 999.99, // Client sends fake price
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      // Server should calculate from database price (menuItem.price = 3.50)
      const expectedSubtotal = menuItem.price * 2; // 7.00
      const expectedTax = Math.round(expectedSubtotal * 0.08 * 100) / 100; // 0.56
      const expectedTotal = Math.round((expectedSubtotal + expectedTax) * 100) / 100; // 7.56

      expect(response.body.subtotal).toBe(expectedSubtotal);
      expect(response.body.tax).toBe(expectedTax);
      expect(response.body.total).toBe(expectedTotal);
    });

    test('should reject order with invalid menu item', async () => {
      const orderData = {
        customer_name: 'Invalid Item User',
        customer_phone: '555-555-6666',
        order_type: 'pickup',
        items: [
          {
            menu_item_id: '507f1f77bcf86cd799439011', // Non-existent ID
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('No valid items');
    });

    test('should reject order with missing required fields', async () => {
      const orderData = {
        // Missing customer_name and customer_phone
        order_type: 'pickup',
        items: [],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    test('should reject order with empty items array', async () => {
      const orderData = {
        customer_name: 'Empty Cart User',
        customer_phone: '555-777-8888',
        order_type: 'pickup',
        items: [],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    test('should validate phone number format', async () => {
      const orderData = {
        customer_name: 'Phone Test User',
        customer_phone: 'invalid-phone',
        order_type: 'pickup',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'customer_phone')).toBe(true);
    });

    test('should validate email format if provided', async () => {
      const orderData = {
        customer_name: 'Email Test User',
        customer_phone: '555-999-0000',
        customer_email: 'invalid-email',
        order_type: 'pickup',
        items: [
          {
            menu_item_id: menuItem._id.toString(),
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'customer_email')).toBe(true);
    });
  });

  describe('GET /api/orders/track/:code', () => {
    let orderCode;

    beforeEach(async () => {
      // Create an order to track
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Track Test User',
          customer_phone: '555-888-9999',
          customer_email: 'track@example.com',
          order_type: 'pickup',
          address: '456 Secret St, City, State 99999',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        });
      
      orderCode = response.body.order_code;
    });

    test('should track order with valid code', async () => {
      const response = await request(app)
        .get(`/api/orders/track/${orderCode}`)
        .expect(200);

      expect(response.body).toHaveProperty('order_code');
      expect(response.body.order_code).toBe(orderCode);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('total');
    });

    test('should mask sensitive data in public tracking', async () => {
      const response = await request(app)
        .get(`/api/orders/track/${orderCode}`)
        .expect(200);

      // Phone should be masked (***-***-9999)
      expect(response.body.customer_phone).toContain('***');
      
      // Email should be masked (t***@example.com)
      expect(response.body.customer_email).toContain('***');
      
      // Address should show only city/state (not full address)
      expect(response.body.address).not.toContain('456 Secret St');
    });

    test('should return 404 for invalid order code', async () => {
      const response = await request(app)
        .get('/api/orders/track/INVALID-CODE')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /api/orders/history - IDOR Protection', () => {
    let user1Token;
    let user2Token;
    let user1Order;

    beforeEach(async () => {
      // Create two users
      const user1Response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'user1@example.com',
          password: 'Test123!',
        });
      user1Token = user1Response.body.token;

      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Two',
          email: 'user2@example.com',
          password: 'Test123!',
        });
      user2Token = user2Response.body.token;

      // User 1 creates an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          customer_name: 'User One',
          customer_phone: '555-111-0001',
          order_type: 'pickup',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        });
      
      user1Order = orderResponse.body;
    });

    test('should return only authenticated user\'s orders', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].order_code).toBe(user1Order.order_code);
    });

    test('should not return other user\'s orders (IDOR protection)', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0); // User 2 has no orders
      
      // Make sure User 2 cannot see User 1's orders
      const hasUser1Order = response.body.some(o => o.order_code === user1Order.order_code);
      expect(hasUser1Order).toBe(false);
    });

    test('should require authentication for order history', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token required');
    });
  });

  describe('Order Status Tracking', () => {
    let orderCode;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Status Test User',
          customer_phone: '555-123-7890',
          order_type: 'pickup',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        });
      
      orderCode = response.body.order_code;
    });

    test('should return status flow information', async () => {
      const response = await request(app)
        .get(`/api/orders/track/${orderCode}`)
        .expect(200);

      expect(response.body).toHaveProperty('status_flow');
      expect(Array.isArray(response.body.status_flow)).toBe(true);
      expect(response.body.status_flow).toContain('received');
      expect(response.body.status_flow).toContain('preparing');
      expect(response.body.status_flow).toContain('ready');
      expect(response.body.status_flow).toContain('completed');
    });

    test('new orders should have status "received"', async () => {
      const response = await request(app)
        .get(`/api/orders/track/${orderCode}`)
        .expect(200);

      expect(response.body.status).toBe('received');
    });
  });
});
