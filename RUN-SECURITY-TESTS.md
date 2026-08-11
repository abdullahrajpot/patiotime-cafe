# 🔒 Run Security Tests

## Overview

This document explains how to run the comprehensive security tests that verify all 6 security concerns raised by your team.

## Test File Created

**Location**: `server/tests/security.test.js`

**What it tests**:
1. ✅ Order creation ignores `user_id` from client (uses JWT)
2. ✅ Order history prevents IDOR attacks (no userId in URL)
3. ✅ JWT secret is required (no fallback)
4. ✅ Admin routes require proper authentication
5. ✅ Category implementation is consistent (ObjectId references)
6. ✅ Admin category endpoint verified

## Prerequisites

Ensure you have:
- MongoDB running (or MongoDB Atlas connection)
- Node.js installed
- Dependencies installed (`npm install` in `server/` directory)
- JWT_SECRET set in `.env` file

## Running the Tests

### Method 1: Run Security Tests Only

```bash
cd server

# Run just the security tests
npm test -- tests/security.test.js

# Or with verbose output
npm test -- tests/security.test.js --verbose
```

### Method 2: Run All Tests

```bash
cd server

# Run all tests including security tests
npm test

# With coverage
npm run test:coverage
```

### Method 3: Watch Mode (for development)

```bash
cd server

# Run tests in watch mode
npm run test:watch

# Then press 'p' to filter by filename
# Type: security.test.js
```

## Expected Output

When all tests pass, you should see:

```
🔒 Security Tests
  Test 1: Order Creation - User ID from JWT (Not Client)
    ✓ should ignore user_id from request body and use JWT user (XXms)
    ✓ should create order for JWT user when user_id is missing from body (XXms)
    ✓ should allow guest orders (no JWT token) (XXms)
    
  Test 2: Order History IDOR Prevention
    ✓ should require authentication for order history (XXms)
    ✓ should only return authenticated user's orders (XXms)
    ✓ should prevent User A from accessing User B's orders (XXms)
    ✓ should NOT have userId in the route URL (XXms)
    
  Test 3: JWT Secret Required (No Fallback)
    ✓ should have JWT_SECRET environment variable set (XXms)
    ✓ should reject invalid JWT tokens (XXms)
    ✓ should reject malformed Authorization headers (XXms)
    
  Test 4: Admin API Authentication
    ✓ should require authentication for admin endpoints (XXms)
    ✓ should require admin role for admin endpoints (XXms)
    ✓ should allow admin users to access admin endpoints (XXms)
    ✓ should require admin auth for menu management (XXms)
    ✓ should require admin auth for category management (XXms)
    
  Test 5: Category Implementation Consistency
    ✓ should have category as ObjectId in database (XXms)
    ✓ should populate category correctly (XXms)
    ✓ should support category filtering by slug (XXms)
    ✓ should not have hardcoded category values in menu items (XXms)
    ✓ should have consistent category schema (XXms)
    
  Test 6: Admin Category Endpoint Verification
    ✓ should use correct Category model (XXms)
    ✓ should return categories with correct structure (XXms)
    
  Summary: Security Test Results
    ✓ should pass all security tests (XXms)

🎉 ========================================
🎉 ALL SECURITY TESTS PASSED!
🎉 ========================================

✅ Test 1: Order creation ignores client user_id
✅ Test 2: Order history prevents IDOR attacks
✅ Test 3: JWT secret is required (no fallback)
✅ Test 4: Admin routes require proper authentication
✅ Test 5: Category implementation is consistent
✅ Test 6: Admin category endpoint verified

🔒 Application security: VERIFIED
🚀 Production readiness: CONFIRMED

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
```

## If Tests Fail

### Common Issues and Solutions

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
- Start MongoDB locally: `mongod`
- Or update MONGO_URI in `.env` to point to MongoDB Atlas
- Or run with test database: `MONGO_URI=mongodb://localhost:27017/patiotime_test npm test`

#### 2. JWT_SECRET Not Set
```
❌ FATAL: JWT_SECRET environment variable is not set!
```

**Solution**:
```bash
# Add to server/.env
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
```

#### 3. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in .env
PORT=5001
```

#### 4. Test Timeout
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solution**:
```bash
# Increase timeout
npm test -- tests/security.test.js --testTimeout=10000
```

## Manual Testing (Production)

### Test 1: Order Creation IDOR

```bash
# Login as User A
curl -X POST https://patiotime-cafe-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"password123"}'

# Save token from response
TOKEN_A="<token_from_response>"

# Create order with malicious user_id in body
curl -X POST https://patiotime-cafe-production.up.railway.app/api/orders \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "MALICIOUS_USER_ID",
    "customer_name": "Test User",
    "customer_phone": "1234567890",
    "order_type": "pickup",
    "items": [{"menu_item_id": "VALID_ITEM_ID", "quantity": 1}]
  }'

# Expected: Order created for User A (JWT), not malicious user
```

### Test 2: Order History IDOR

```bash
# Try to access order history without auth
curl https://patiotime-cafe-production.up.railway.app/api/orders/history

# Expected: 401 Unauthorized
# Response: {"error":"Access token required"}

# Try with User A's token
curl https://patiotime-cafe-production.up.railway.app/api/orders/history \
  -H "Authorization: Bearer $TOKEN_A"

# Expected: Only User A's orders returned
# Verify: No orders from other users appear

# Try old vulnerable pattern (should not exist)
curl https://patiotime-cafe-production.up.railway.app/api/orders/history/OTHER_USER_ID \
  -H "Authorization: Bearer $TOKEN_A"

# Expected: 404 Not Found (route doesn't exist)
```

### Test 3: JWT Secret

```bash
# Try with invalid token
curl https://patiotime-cafe-production.up.railway.app/api/orders/history \
  -H "Authorization: Bearer invalid_token_123"

# Expected: 403 Forbidden
# Response: {"error":"Invalid or expired token"}
```

### Test 4: Admin Authentication

```bash
# Try admin endpoint without auth
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders

# Expected: 401 Unauthorized

# Try with regular user token
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders \
  -H "Authorization: Bearer $TOKEN_A"

# Expected: 403 Forbidden
# Response: {"error":"Admin access required..."}

# Login as admin
curl -X POST https://patiotime-cafe-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@patiotime.com","password":"admin123"}'

TOKEN_ADMIN="<admin_token_from_response>"

# Try with admin token
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders \
  -H "Authorization: Bearer $TOKEN_ADMIN"

# Expected: 200 OK with orders list
```

### Test 5 & 6: Category Consistency

```bash
# Get menu to verify category structure
curl https://patiotime-cafe-production.up.railway.app/api/menu

# Verify response has categories with:
# - name (string)
# - items (array)
# Each item should reference category by ObjectId

# Get categories (admin)
curl https://patiotime-cafe-production.up.railway.app/api/admin/categories \
  -H "Authorization: Bearer $TOKEN_ADMIN"

# Verify each category has:
# - _id (ObjectId)
# - name (string)
# - slug (string)
# - eyebrow (string)
# - sortOrder (number)
```

## Browser DevTools Testing

### Test Frontend Authorization Headers

1. **Open Application**:
   - Development: http://localhost:5173/admin
   - Production: https://patiotime-cafe.vercel.app/admin

2. **Login** with admin credentials

3. **Open DevTools** (F12) → Network tab

4. **Filter** by "Fetch/XHR"

5. **Click through admin features**:
   - View Orders
   - Add Menu Item
   - Edit Menu Item
   - Delete Menu Item
   - View Reservations
   - View Contacts

6. **For EACH request, verify**:
   ```
   Request Headers:
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

7. **Check these endpoints specifically**:
   - ✅ GET /api/admin/orders
   - ✅ GET /api/admin/menu
   - ✅ POST /api/admin/menu
   - ✅ PUT /api/admin/menu/:id
   - ✅ DELETE /api/admin/menu/:id
   - ✅ PATCH /api/admin/orders/:id/status
   - ✅ GET /api/admin/categories
   - ✅ GET /api/admin/reservations
   - ✅ GET /api/admin/contacts

**All should have Authorization header!**

## Test Report Template

After running tests, fill out this template:

```markdown
# Security Test Report

**Date**: YYYY-MM-DD
**Environment**: Development / Production
**Tester**: Your Name

## Automated Test Results

**Command**: `npm test -- tests/security.test.js`

**Results**:
- Total Tests: 24
- Passed: __
- Failed: __
- Skipped: __

## Test Details

### Test 1: Order Creation User Binding
- [ ] ✅ Ignores user_id from request body
- [ ] ✅ Uses userId from JWT token
- [ ] ✅ Allows guest orders without JWT

**Status**: PASS / FAIL
**Notes**:

### Test 2: Order History IDOR Prevention
- [ ] ✅ Requires authentication
- [ ] ✅ Returns only user's own orders
- [ ] ✅ Route has no userId parameter
- [ ] ✅ Cannot access other users' orders

**Status**: PASS / FAIL
**Notes**:

### Test 3: JWT Secret Required
- [ ] ✅ JWT_SECRET environment variable set
- [ ] ✅ Invalid tokens rejected
- [ ] ✅ Malformed headers rejected

**Status**: PASS / FAIL
**Notes**:

### Test 4: Admin API Authentication
- [ ] ✅ Admin endpoints require authentication
- [ ] ✅ Admin endpoints require admin role
- [ ] ✅ Regular users cannot access admin endpoints
- [ ] ✅ All admin endpoints protected

**Status**: PASS / FAIL
**Notes**:

### Test 5: Category Implementation
- [ ] ✅ Categories use ObjectId references
- [ ] ✅ Category population works
- [ ] ✅ Slug-based filtering works
- [ ] ✅ No hardcoded category values

**Status**: PASS / FAIL
**Notes**:

### Test 6: Admin Category Endpoint
- [ ] ✅ Uses correct Category model
- [ ] ✅ Returns correct structure
- [ ] ✅ Protected by admin auth

**Status**: PASS / FAIL
**Notes**:

## Manual Testing Results

### Browser DevTools Check
- [ ] All admin API calls send Authorization header
- [ ] Token format is "Bearer <token>"
- [ ] Consistent across all operations

**Status**: PASS / FAIL
**Notes**:

### Production API Tests
- [ ] Order creation IDOR test passed
- [ ] Order history IDOR test passed
- [ ] JWT validation test passed
- [ ] Admin auth test passed

**Status**: PASS / FAIL
**Notes**:

## Overall Assessment

**Security Status**: PASS / FAIL

**Issues Found**: (list any)

**Recommendations**: (any improvements)

## Sign-off

**Tested by**: _______________
**Date**: _______________
**Approved by**: _______________
**Date**: _______________
```

## Next Steps

After running tests:

1. **If all tests pass**:
   - ✅ Share test report with team
   - ✅ Mark security audit as complete
   - ✅ Deploy to production with confidence

2. **If any tests fail**:
   - ❌ Review failed test output
   - ❌ Fix identified issues
   - ❌ Re-run tests
   - ❌ Document fixes

## CI/CD Integration (Future)

Add to `.github/workflows/security-tests.yml`:

```yaml
name: Security Tests

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd server
          npm install
      
      - name: Run security tests
        run: |
          cd server
          npm test -- tests/security.test.js
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET_TEST }}
          MONGO_URI: ${{ secrets.MONGO_URI_TEST }}
          NODE_ENV: test
```

---

**Status**: Security tests ready to run
**Command**: `cd server && npm test -- tests/security.test.js`
**Expected**: All 24 tests pass ✅
