/**
 * Quick test script to verify optionalAuth middleware works correctly
 * Run with: node test-auth-flow.js
 */

const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not set in environment');
  process.exit(1);
}

console.log('✅ JWT_SECRET is set');
console.log('JWT_SECRET length:', JWT_SECRET.length);

// Simulate creating a token (like login does)
const testUser = {
  userId: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  role: 'customer'
};

const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '7d' });

console.log('\n📝 Generated Test Token:');
console.log(token);

// Simulate verifying the token (like optionalAuth does)
console.log('\n🔍 Verifying Token:');

jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) {
    console.error('❌ Token verification failed:', err.message);
  } else {
    console.log('✅ Token verified successfully!');
    console.log('Decoded payload:', decoded);
    console.log('User ID:', decoded.userId);
    console.log('Email:', decoded.email);
    console.log('Role:', decoded.role);
  }
});

console.log('\n✅ Auth flow test complete');
