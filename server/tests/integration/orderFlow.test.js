/**
 * Order Flow Integration Tests
 * Tests complete end-to-end order workflows from creation to completion
 */

const request = require('supertest');
const app = require('../../server');
const testDb = require('../helpers/testDb');

describe('Order Flow Integration Tests', () => {
  let adminToken;
  let userToken;
  let menuItem;
  let category;

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
    category = seedData.categories[0];
    menuItem = seedData.menuItems[0];

    // Create user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@example.com',
        password: 'Test123!',
      });
    userToken = userResponse.body.token;

    // Create admin
    await testDb.createAdmin({ email: 'admin@example.com' });
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!',
      });
    adminToken = adminResponse.body.token;
  });

  describe('Complete Guest Order Flow', () => {
    test('guest can complete full order journey: create → track → completion', async () => {
      // Step 1: Guest creates order
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Guest Customer',
          customer_phone: '555-111-2222',
          customer_email: 'guest@example.com',
          order_type: 'pickup',
          notes: 'Please call when ready',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 2,
            },
          ],
        })
        .expect(201);

      const { order_id, order_code } = orderResponse.body;

      expect(order_code).toBeTruthy();
      expect(order_code).toMatch(/^PT-/);

      // Step 2: Guest tracks order using code
      const trackResponse = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse.body.status).toBe('received');
      expect(trackResponse.body.customer_name).toBeTruthy();
      expect(trackResponse.body.customer_phone).toContain('***'); // Masked

      // Step 3: Admin updates order to preparing
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Step 4: Guest checks status again
      const trackResponse2 = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse2.body.status).toBe('preparing');

      // Step 5: Admin updates to ready
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      // Step 6: Guest checks final status
      const trackResponse3 = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse3.body.status).toBe('ready');

      // Step 7: Admin completes order
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Step 8: Verify final completed status
      const trackResponse4 = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse4.body.status).toBe('completed');
    });
  });

  describe('Complete Authenticated User Order Flow', () => {
    test('user can complete full order journey with history tracking', async () => {
      // Step 1: User creates order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          customer_name: 'Test Customer',
          customer_phone: '555-333-4444',
          customer_email: 'customer@example.com',
          order_type: 'delivery',
          address: '123 Main St, City, State 12345',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        })
        .expect(201);

      const { order_id, order_code } = orderResponse.body;

      // Step 2: User checks order history
      const historyResponse = await request(app)
        .get('/api/orders/history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(historyResponse.body.length).toBe(1);
      expect(historyResponse.body[0].order_code).toBe(order_code);

      // Step 3: Admin moves order through statuses
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Step 4: User checks order in history
      const historyResponse2 = await request(app)
        .get('/api/orders/history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(historyResponse2.body[0].status).toBe('completed');

      // Step 5: User can still track by code
      const trackResponse = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse.body.status).toBe('completed');
    });
  });

  describe('Multiple Orders Management', () => {
    test('admin can manage multiple orders concurrently', async () => {
      // Create multiple orders
      const order1 = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Customer 1',
          customer_phone: '555-001-0001',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      const order2 = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Customer 2',
          customer_phone: '555-002-0002',
          order_type: 'delivery',
          address: '456 Oak St',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 2 }],
        })
        .expect(201);

      const order3 = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Customer 3',
          customer_phone: '555-003-0003',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      // Admin views all orders
      const allOrdersResponse = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(allOrdersResponse.body.length).toBe(3);

      // Admin updates different orders to different statuses
      await request(app)
        .patch(`/api/admin/orders/${order1.body.order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order2.body.order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order3.body.order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Verify order statuses
      const track1 = await request(app)
        .get(`/api/orders/track/${order1.body.order_code}`)
        .expect(200);
      expect(track1.body.status).toBe('preparing');

      const track2 = await request(app)
        .get(`/api/orders/track/${order2.body.order_code}`)
        .expect(200);
      expect(track2.body.status).toBe('cancelled');

      const track3 = await request(app)
        .get(`/api/orders/track/${order3.body.order_code}`)
        .expect(200);
      expect(track3.body.status).toBe('preparing');
    });
  });

  describe('Order Cancellation Flow', () => {
    test('order can be cancelled at any non-final state', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Cancel Test Customer',
          customer_phone: '555-999-0000',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      const { order_id, order_code } = orderResponse.body;

      // Cancel from received state
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      // Verify cancelled status
      const trackResponse = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse.body.status).toBe('cancelled');

      // Try to change status after cancellation (should fail)
      const updateResponse = await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(400);

      expect(updateResponse.body).toHaveProperty('error');
      expect(updateResponse.body.error).toContain('Cannot change status');
    });
  });

  describe('Order Type Handling', () => {
    test('pickup order flow', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Pickup Customer',
          customer_phone: '555-100-0001',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      const trackResponse = await request(app)
        .get(`/api/orders/track/${orderResponse.body.order_code}`)
        .expect(200);

      expect(trackResponse.body.order_type).toBe('pickup');
      expect(trackResponse.body.address).toBeNull();
    });

    test('delivery order flow with address', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Delivery Customer',
          customer_phone: '555-200-0002',
          order_type: 'delivery',
          address: '789 Delivery Lane, City, State 54321',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        })
        .expect(201);

      const trackResponse = await request(app)
        .get(`/api/orders/track/${orderResponse.body.order_code}`)
        .expect(200);

      expect(trackResponse.body.order_type).toBe('delivery');
      expect(trackResponse.body.address).toBeTruthy();
      // Address should be masked in public tracking
      expect(trackResponse.body.address).not.toContain('789 Delivery Lane');
    });
  });

  describe('Price Calculation Throughout Flow', () => {
    test('prices remain consistent from creation to completion', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Price Consistency Test',
          customer_phone: '555-300-0003',
          order_type: 'pickup',
          items: [
            {
              menu_item_id: menuItem._id.toString(),
              quantity: 3,
            },
          ],
        })
        .expect(201);

      const { order_id, order_code, subtotal, tax, total } = orderResponse.body;

      // Track order - prices should match
      const trackResponse = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(trackResponse.body.subtotal).toBe(subtotal);
      expect(trackResponse.body.tax).toBe(tax);
      expect(trackResponse.body.total).toBe(total);

      // Move to completed
      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${order_id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Verify prices still match
      const finalTrackResponse = await request(app)
        .get(`/api/orders/track/${order_code}`)
        .expect(200);

      expect(finalTrackResponse.body.subtotal).toBe(subtotal);
      expect(finalTrackResponse.body.tax).toBe(tax);
      expect(finalTrackResponse.body.total).toBe(total);
    });
  });
});
