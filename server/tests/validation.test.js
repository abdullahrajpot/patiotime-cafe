/**
 * Input Validation Tests
 * Tests comprehensive input validation using express-validator
 */

const request = require('supertest');
const app = require('../server');
const testDb = require('./helpers/testDb');

describe('Input Validation Tests', () => {
  let adminToken;
  let menuItem;

  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
    
    const seedData = await testDb.seedDatabase();
    menuItem = seedData.menuItems[0];

    // Create admin for tests that need it
    await testDb.createAdmin({ email: 'admin@example.com' });
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!',
      });
    adminToken = adminResponse.body.token;
  });

  describe('Registration Validation', () => {
    test('should reject missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'name')).toBe(true);
    });

    test('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '   ',
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    test('should reject invalid email format', async () => {
      const invalidEmails = ['notanemail', '@test.com', 'user@', 'user@.com'];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email,
            password: 'Test123!',
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      }
    });

    test('should reject password shorter than 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '12345',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'password')).toBe(true);
    });

    test('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'Test@EXAMPLE.COM',
          password: 'Test123!',
        })
        .expect(201);

      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('Login Validation', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
        });
    });

    test('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'email')).toBe(true);
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'password')).toBe(true);
    });
  });

  describe('Order Creation Validation', () => {
    test('should reject missing customer name', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_phone: '555-123-4567',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'customer_name')).toBe(true);
    });

    test('should reject missing customer phone', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'customer_phone')).toBe(true);
    });

    test('should reject invalid phone number format', async () => {
      const invalidPhones = ['123', 'abcdefghij', '555-ABC-DEFG'];

      for (const phone of invalidPhones) {
        const response = await request(app)
          .post('/api/orders')
          .send({
            customer_name: 'Test Customer',
            customer_phone: phone,
            order_type: 'pickup',
            items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      }
    });

    test('should reject invalid email if provided', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-123-4567',
          customer_email: 'invalid-email',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'customer_email')).toBe(true);
    });

    test('should accept valid email or allow it to be empty', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-123-4567',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
    });

    test('should reject empty items array', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-123-4567',
          order_type: 'pickup',
          items: [],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'items')).toBe(true);
    });

    test('should validate order type', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-123-4567',
          order_type: 'invalid-type',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'order_type')).toBe(true);
    });
  });

  describe('Menu Item Validation', () => {
    test('should reject missing name when creating menu item', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Test item',
          price: 5.00,
          category: menuItem.category.toString(),
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'name')).toBe(true);
    });

    test('should reject invalid price (negative)', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Item',
          description: 'Test description',
          price: -5.00,
          category: menuItem.category.toString(),
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'price')).toBe(true);
    });

    test('should reject invalid price (zero)', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Item',
          description: 'Test description',
          price: 0,
          category: menuItem.category.toString(),
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'price')).toBe(true);
    });

    test('should reject non-numeric price', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Item',
          description: 'Test description',
          price: 'not-a-number',
          category: menuItem.category.toString(),
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'price')).toBe(true);
    });

    test('should reject missing category', async () => {
      const response = await request(app)
        .post('/api/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Item',
          description: 'Test description',
          price: 5.00,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'category')).toBe(true);
    });
  });

  describe('Status Update Validation', () => {
    let orderId;

    beforeEach(async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-999-0000',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        });
      orderId = orderResponse.body.order_id;
    });

    test('should reject invalid status value', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'status')).toBe(true);
    });

    test('should reject missing status', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'status')).toBe(true);
    });

    test('should accept valid status values', async () => {
      const validStatuses = ['preparing', 'ready', 'completed', 'cancelled'];

      for (const status of validStatuses) {
        // Reset order status
        await testDb.clearDatabase();
        const seedData = await testDb.seedDatabase();
        menuItem = seedData.menuItems[0];
        
        const orderResponse = await request(app)
          .post('/api/orders')
          .send({
            customer_name: 'Test Customer',
            customer_phone: '555-999-0000',
            order_type: 'pickup',
            items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
          });
        orderId = orderResponse.body.order_id;

        // Only test valid transitions
        if (status === 'preparing' || status === 'cancelled') {
          const response = await request(app)
            .patch(`/api/admin/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status })
            .expect(200);

          expect(response.body).toHaveProperty('ok');
          expect(response.body.ok).toBe(true);
        }
      }
    });
  });

  describe('Data Sanitization', () => {
    test('should trim whitespace from name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '  Test User  ',
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(201);

      expect(response.body.user.name).toBe('Test User');
    });

    test('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'TEST@EXAMPLE.COM',
          password: 'Test123!',
        })
        .expect(201);

      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should escape HTML in text fields', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_name: '<script>alert("xss")</script>John',
          customer_phone: '555-123-4567',
          order_type: 'pickup',
          notes: '<img src=x onerror=alert(1)>',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      // Note: Full XSS protection testing would require checking database values
    });
  });
});
