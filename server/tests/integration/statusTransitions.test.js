/**
 * Status Transition Integration Tests
 * Tests order status validation, history tracking, and admin attribution
 */

const request = require('supertest');
const app = require('../../server');
const testDb = require('../helpers/testDb');
const Order = require('../../models/Order');

describe('Status Transition Integration Tests', () => {
  let adminToken;
  let admin2Token;
  let adminUserId;
  let admin2UserId;
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

    // Create two admin users for attribution testing
    const admin1 = await testDb.createAdmin({ email: 'admin1@example.com', name: 'Admin One' });
    adminUserId = admin1._id.toString();

    const admin2 = await testDb.createAdmin({ email: 'admin2@example.com', name: 'Admin Two' });
    admin2UserId = admin2._id.toString();

    // Login both admins
    const admin1Response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin1@example.com',
        password: 'Admin123!',
      });
    adminToken = admin1Response.body.token;

    const admin2Response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin2@example.com',
        password: 'Admin123!',
      });
    admin2Token = admin2Response.body.token;

    // Create a test order
    const orderResponse = await request(app)
      .post('/api/orders')
      .send({
        customer_name: 'Status Test Customer',
        customer_phone: '555-999-0000',
        order_type: 'pickup',
        items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
      });
    orderId = orderResponse.body.order_id;
  });

  describe('Valid Status Transitions', () => {
    test('received → preparing transition is allowed', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test('received → cancelled transition is allowed', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test('preparing → ready transition is allowed', async () => {
      // First move to preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Then to ready
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test('preparing → cancelled transition is allowed', async () => {
      // Move to preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Cancel from preparing
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test('ready → completed transition is allowed', async () => {
      // Move to preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Move to ready
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      // Complete
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test('ready → cancelled transition is allowed', async () => {
      // Move to preparing then ready
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      // Cancel from ready
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.ok).toBe(true);
    });
  });

  describe('Invalid Status Transitions', () => {
    test('received → ready transition is not allowed (must go through preparing)', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot change status from received to ready');
      expect(response.body.error).toContain('preparing, cancelled');
    });

    test('received → completed transition is not allowed', async () => {
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot change status');
    });

    test('preparing → completed transition is not allowed (must go through ready)', async () => {
      // Move to preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Try to jump to completed
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot change status from preparing to completed');
    });

    test('completed → any status transition is not allowed (final state)', async () => {
      // Move order to completed
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Try to change from completed
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('final state');
    });

    test('cancelled → any status transition is not allowed (final state)', async () => {
      // Cancel order
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      // Try to change from cancelled
      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot change status');
    });
  });

  describe('Status History Tracking', () => {
    test('should track status history in database', async () => {
      // Move through several statuses
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      // Check database for status history
      const order = await Order.findById(orderId);
      
      expect(order.statusHistory).toBeDefined();
      expect(Array.isArray(order.statusHistory)).toBe(true);
      expect(order.statusHistory.length).toBeGreaterThanOrEqual(2);
      
      // Check history entries
      const preparingEntry = order.statusHistory.find(h => h.status === 'preparing');
      expect(preparingEntry).toBeDefined();
      expect(preparingEntry.timestamp).toBeDefined();
      
      const readyEntry = order.statusHistory.find(h => h.status === 'ready');
      expect(readyEntry).toBeDefined();
      expect(readyEntry.timestamp).toBeDefined();
    });

    test('admin can view status history via admin endpoint', async () => {
      // Move through statuses
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      // Get order details with history
      const response = await request(app)
        .get(`/api/admin/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status_history');
      expect(Array.isArray(response.body.status_history)).toBe(true);
      expect(response.body.status_history.length).toBeGreaterThan(0);
    });

    test('status history should not be visible in public tracking', async () => {
      // Create order and get code
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'Public Track Test',
          customer_phone: '555-888-9999',
          order_type: 'pickup',
          items: [{ menu_item_id: menuItem._id.toString(), quantity: 1 }],
        });

      const orderCode = orderResponse.body.order_code;
      const orderId = orderResponse.body.order_id;

      // Update status
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Public tracking should not show detailed history
      const trackResponse = await request(app)
        .get(`/api/orders/track/${orderCode}`)
        .expect(200);

      expect(trackResponse.body).not.toHaveProperty('status_history');
      expect(trackResponse.body).toHaveProperty('status');
      expect(trackResponse.body.status).toBe('preparing');
    });
  });

  describe('Admin Attribution in Status Changes', () => {
    test('should track which admin changed the status', async () => {
      // Admin 1 changes status
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Admin 2 changes status
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${admin2Token}`)
        .send({ status: 'ready' })
        .expect(200);

      // Check database for admin attribution
      const order = await Order.findById(orderId);
      
      const preparingEntry = order.statusHistory.find(h => h.status === 'preparing');
      expect(preparingEntry.updatedBy).toBeDefined();
      expect(preparingEntry.updatedBy.toString()).toBe(adminUserId);
      
      const readyEntry = order.statusHistory.find(h => h.status === 'ready');
      expect(readyEntry.updatedBy).toBeDefined();
      expect(readyEntry.updatedBy.toString()).toBe(admin2UserId);
    });

    test('status history should include updatedBy in admin view', async () => {
      // Admin 1 changes status
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Get order with history
      const response = await request(app)
        .get(`/api/admin/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const history = response.body.status_history;
      const preparingEntry = history.find(h => h.status === 'preparing');
      
      expect(preparingEntry).toBeDefined();
      expect(preparingEntry.updatedBy).toBeDefined();
      expect(preparingEntry.updatedBy).toBe(adminUserId);
    });

    test('multiple status changes by different admins should all be tracked', async () => {
      // Admin 1: received → preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      // Admin 2: preparing → ready
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${admin2Token}`)
        .send({ status: 'ready' })
        .expect(200);

      // Admin 1: ready → completed
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Get full history
      const order = await Order.findById(orderId);
      
      expect(order.statusHistory.length).toBeGreaterThanOrEqual(3);
      
      const preparingEntry = order.statusHistory.find(h => h.status === 'preparing');
      expect(preparingEntry.updatedBy.toString()).toBe(adminUserId);
      
      const readyEntry = order.statusHistory.find(h => h.status === 'ready');
      expect(readyEntry.updatedBy.toString()).toBe(admin2UserId);
      
      const completedEntry = order.statusHistory.find(h => h.status === 'completed');
      expect(completedEntry.updatedBy.toString()).toBe(adminUserId);
    });
  });

  describe('Complete Status Flow Timeline', () => {
    test('full order lifecycle with proper transitions', async () => {
      // Initial state
      let order = await Order.findById(orderId);
      expect(order.status).toBe('received');

      // received → preparing
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' })
        .expect(200);

      order = await Order.findById(orderId);
      expect(order.status).toBe('preparing');

      // preparing → ready
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ready' })
        .expect(200);

      order = await Order.findById(orderId);
      expect(order.status).toBe('ready');

      // ready → completed
      await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' })
        .expect(200);

      order = await Order.findById(orderId);
      expect(order.status).toBe('completed');

      // Verify complete history
      expect(order.statusHistory.length).toBeGreaterThanOrEqual(3);
      
      const statuses = order.statusHistory.map(h => h.status);
      expect(statuses).toContain('preparing');
      expect(statuses).toContain('ready');
      expect(statuses).toContain('completed');
    });
  });
});
