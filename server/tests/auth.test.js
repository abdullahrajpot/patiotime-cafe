/**
 * Authentication Tests
 * Tests user registration, login, token validation, and role-based access
 */

const request = require('supertest');
const app = require('../server');
const testDb = require('./helpers/testDb');
const User = require('../models/User');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test123!',
        phone: '555-123-4567',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'Test123!',
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already registered');
    });

    test('should reject registration with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Test123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'email')).toBe(true);
    });

    test('should reject registration with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.some(e => e.field === 'password')).toBe(true);
    });

    test('should reject registration with missing required fields', async () => {
      const userData = {
        name: 'John Doe',
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
        });
    });

    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details.length).toBeGreaterThan(0);
    });
  });

  describe('Token Validation', () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
      // Register regular user
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@example.com',
          password: 'Test123!',
        });
      userToken = userResponse.body.token;

      // Create admin user
      const admin = await testDb.createAdmin({
        email: 'admin@example.com',
      });

      // Login as admin to get token
      const adminResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!',
        });
      adminToken = adminResponse.body.token;
    });

    test('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should reject protected route without token', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token required');
    });

    test('should reject protected route with invalid token', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .set('Authorization', 'Bearer invalid-token-12345')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid or expired token');
    });

    test('should reject protected route with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/orders/history')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Admin Role Verification', () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
      // Register regular user
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@example.com',
          password: 'Test123!',
        });
      userToken = userResponse.body.token;

      // Create admin user
      await testDb.createAdmin({
        email: 'admin@example.com',
      });

      // Login as admin
      const adminResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!',
        });
      adminToken = adminResponse.body.token;
    });

    test('admin should access admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('regular user should not access admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Admin access required');
    });

    test('unauthenticated user should not access admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Password Security', () => {
    test('should not return password in registration response', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(201);

      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should not return password in login response', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
        });

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should store hashed password in database', async () => {
      const password = 'Test123!';
      
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password,
        });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.password).not.toBe(password);
      expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });
});
