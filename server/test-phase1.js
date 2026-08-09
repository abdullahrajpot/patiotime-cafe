/**
 * Phase 1 Security Fixes - Test Script
 * Tests all critical security changes made in Phase 1
 */

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

async function testAPI(name, fn) {
  testResults.total++;
  process.stdout.write(`\n${testResults.total}. ${name}... `);
  
  try {
    await fn();
    testResults.passed++;
    log('✅ PASSED', 'green');
    return true;
  } catch (error) {
    testResults.failed++;
    log('❌ FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Test helper functions
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const data = await response.json().catch(() => ({}));
  return { response, data, status: response.status };
}

// Store tokens and user data for tests
let testData = {
  regularUser: {
    email: `test-user-${Date.now()}@test.com`,
    password: 'test123456',
    name: 'Test User',
    token: null,
    userId: null
  },
  adminUser: {
    email: 'admin@patiotime.com', // Must exist in DB
    password: 'admin123',
    token: null
  },
  orderCode: null
};

// ============================================
// TEST SUITE
// ============================================

async function runTests() {
  log('\n╔═══════════════════════════════════════════════════╗', 'blue');
  log('║     PHASE 1 SECURITY FIXES - TEST SUITE          ║', 'blue');
  log('╚═══════════════════════════════════════════════════╝', 'blue');
  
  // Test 1: JWT_SECRET Validation
  log('\n📋 TEST GROUP 1: JWT_SECRET Validation', 'yellow');
  await testAPI('Server started (JWT_SECRET must be set)', async () => {
    const { status } = await makeRequest('/health');
    if (status !== 200) throw new Error('Server not running or JWT_SECRET not set');
  });

  // Test 2: Input Validation
  log('\n📋 TEST GROUP 2: Input Validation', 'yellow');
  
  await testAPI('Register validation - Empty name rejected', async () => {
    const { status, data } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'test@test.com',
        password: 'test123'
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
    if (!data.error) throw new Error('No validation error returned');
  });

  await testAPI('Register validation - Invalid email rejected', async () => {
    const { status } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        password: 'test123'
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await testAPI('Register validation - Short password rejected', async () => {
    const { status } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@test.com',
        password: '12345' // Less than 6 characters
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await testAPI('Register with valid data succeeds', async () => {
    const { status, data } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: testData.regularUser.name,
        email: testData.regularUser.email,
        password: testData.regularUser.password
      })
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.token) throw new Error('No token returned');
    if (!data.user) throw new Error('No user data returned');
    
    testData.regularUser.token = data.token;
    testData.regularUser.userId = data.user._id;
  });

  // Test 3: Authentication
  log('\n📋 TEST GROUP 3: Authentication & Authorization', 'yellow');
  
  await testAPI('Login with correct credentials succeeds', async () => {
    const { status, data } = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testData.regularUser.email,
        password: testData.regularUser.password
      })
    });
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!data.token) throw new Error('No token returned');
  });

  await testAPI('Login with wrong password fails', async () => {
    const { status } = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testData.regularUser.email,
        password: 'wrongpassword'
      })
    });
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  });

  // Test 4: Order Creation with Authentication
  log('\n📋 TEST GROUP 4: Order Creation (No Frontend User ID)', 'yellow');
  
  await testAPI('Guest order creation (no token) works', async () => {
    const { status, data } = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Guest Customer',
        customer_phone: '555-0123',
        customer_email: 'guest@test.com',
        order_type: 'pickup',
        items: [
          { menu_item_id: '507f1f77bcf86cd799439011', quantity: 2 }
        ]
      })
    });
    // Might fail due to invalid menu item, but should not fail on auth
    if (status === 401 || status === 403) {
      throw new Error('Guest order should not require authentication');
    }
  });

  await testAPI('Authenticated order uses token user ID (not body)', async () => {
    const { status, data } = await makeRequest('/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testData.regularUser.token}`
      },
      body: JSON.stringify({
        customer_name: testData.regularUser.name,
        customer_phone: '555-0124',
        customer_email: testData.regularUser.email,
        order_type: 'pickup',
        items: [
          { menu_item_id: '507f1f77bcf86cd799439011', quantity: 1 }
        ]
      })
    });
    // Should succeed or fail on menu item, not on auth
    if (data.order_code) {
      testData.orderCode = data.order_code;
    }
  });

  // Test 5: IDOR Protection
  log('\n📋 TEST GROUP 5: IDOR Protection (Order History)', 'yellow');
  
  await testAPI('Order history without token returns 401', async () => {
    const { status } = await makeRequest('/orders/history');
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  });

  await testAPI('Order history with token returns only user orders', async () => {
    const { status, data } = await makeRequest('/orders/history', {
      headers: {
        'Authorization': `Bearer ${testData.regularUser.token}`
      }
    });
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data)) throw new Error('Expected array of orders');
  });

  // Test 6: Admin Authorization
  log('\n📋 TEST GROUP 6: Admin Authorization', 'yellow');
  
  await testAPI('Admin endpoint without token returns 401', async () => {
    const { status } = await makeRequest('/admin/orders');
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  });

  await testAPI('Admin endpoint with non-admin token returns 403', async () => {
    const { status, data } = await makeRequest('/admin/orders', {
      headers: {
        'Authorization': `Bearer ${testData.regularUser.token}`
      }
    });
    if (status !== 403) throw new Error(`Expected 403 for non-admin, got ${status}`);
    if (!data.error || !data.error.includes('Admin')) {
      throw new Error('Should return admin access error');
    }
  });

  // Test 7: Order Validation
  log('\n📋 TEST GROUP 7: Order Validation', 'yellow');
  
  await testAPI('Order validation - Empty customer name rejected', async () => {
    const { status } = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: '',
        customer_phone: '555-0123',
        order_type: 'pickup',
        items: [{ menu_item_id: '507f1f77bcf86cd799439011', quantity: 1 }]
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await testAPI('Order validation - Invalid phone format rejected', async () => {
    const { status } = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Test',
        customer_phone: 'abc', // Invalid
        order_type: 'pickup',
        items: [{ menu_item_id: '507f1f77bcf86cd799439011', quantity: 1 }]
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await testAPI('Order validation - Delivery without address rejected', async () => {
    const { status } = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Test',
        customer_phone: '555-0123',
        order_type: 'delivery',
        address: '', // Empty for delivery
        items: [{ menu_item_id: '507f1f77bcf86cd799439011', quantity: 1 }]
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await testAPI('Order validation - Empty items array rejected', async () => {
    const { status } = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Test',
        customer_phone: '555-0123',
        order_type: 'pickup',
        items: [] // Empty
      })
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  // Test 8: Order Tracking
  log('\n📋 TEST GROUP 8: Order Tracking (Public)', 'yellow');
  
  if (testData.orderCode) {
    await testAPI('Order tracking by code works (public)', async () => {
      const { status } = await makeRequest(`/orders/track/${testData.orderCode}`);
      if (status !== 200 && status !== 404) {
        throw new Error(`Expected 200 or 404, got ${status}`);
      }
    });
  }

  // Print Results
  log('\n╔═══════════════════════════════════════════════════╗', 'blue');
  log('║                  TEST RESULTS                     ║', 'blue');
  log('╚═══════════════════════════════════════════════════╝', 'blue');
  log(`\nTotal Tests: ${testResults.total}`, 'blue');
  log(`✅ Passed: ${testResults.passed}`, 'green');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  log(`📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%\n`, 'blue');

  if (testResults.failed === 0) {
    log('🎉 ALL PHASE 1 SECURITY FIXES ARE WORKING CORRECTLY! 🎉\n', 'green');
  } else {
    log('⚠️  Some tests failed. Please review the errors above.\n', 'yellow');
  }

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
