# Testing Guide - PatioTime Cafe Backend

## Quick Start

### 1. Install Test Dependencies

```bash
cd server
npm install
```

This will install:
- `jest@^29.7.0` - Testing framework
- `supertest@^6.3.4` - HTTP testing library

### 2. Setup Test Database

Tests use a separate database to avoid corrupting your development data.

**Option A: Use Local MongoDB (Recommended for testing)**
```bash
# Make sure MongoDB is running locally
# Tests will use: mongodb://localhost:27017/patiotime-test
```

**Option B: Use MongoDB Atlas Test Database**
Create a `.env.test` file in server directory:
```env
MONGODB_TEST_URI=mongodb+srv://your-test-db-connection-string
JWT_SECRET=your-jwt-secret
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## Test Structure

```
server/tests/
├── setup.js                          # Test configuration
├── helpers/
│   └── testDb.js                     # Database test utilities
├── auth.test.js                      # Authentication tests (23 tests)
├── orders.test.js                    # Order tests (18 tests)
├── authorization.test.js             # Authorization tests (22 tests)
├── validation.test.js                # Validation tests (25 tests)
└── integration/
    ├── orderFlow.test.js             # Order flow integration (8 tests)
    └── statusTransitions.test.js     # Status transition tests (16 tests)

TOTAL: 112 tests
```

---

## What Each Test Suite Covers

### auth.test.js (23 tests)
- ✅ User registration (valid data, duplicate email, invalid formats)
- ✅ User login (correct credentials, wrong password, invalid data)
- ✅ Token validation (valid token, invalid token, missing token)
- ✅ Admin role verification
- ✅ Password security (hashing, no plaintext exposure)

### orders.test.js (18 tests)
- ✅ Order creation (guest, authenticated, validation)
- ✅ Server-side price calculation (never trust client)
- ✅ Order tracking with order code
- ✅ Data masking (phone, email, address)
- ✅ IDOR protection (users can't see others' orders)
- ✅ Order history (authenticated users only)

### authorization.test.js (22 tests)
- ✅ Admin can access admin routes
- ✅ Regular users cannot access admin routes
- ✅ Unauthenticated users blocked from protected routes
- ✅ Admin can manage orders, menu items, view stats
- ✅ Token validation on admin routes
- ✅ Role persistence

### validation.test.js (25 tests)
- ✅ Registration validation (name, email, password)
- ✅ Login validation
- ✅ Order validation (phone, email, items, order type)
- ✅ Menu item validation (name, price, category)
- ✅ Status update validation
- ✅ Data sanitization (trim, lowercase, escape HTML)

### orderFlow.test.js (8 integration tests)
- ✅ Complete guest order journey
- ✅ Complete authenticated user order journey
- ✅ Multiple orders management
- ✅ Order cancellation flow
- ✅ Pickup vs delivery orders
- ✅ Price consistency throughout lifecycle

### statusTransitions.test.js (16 integration tests)
- ✅ Valid status transitions (received→preparing→ready→completed)
- ✅ Invalid transitions blocked with clear errors
- ✅ Status history tracking in database
- ✅ Admin attribution (who changed the status)
- ✅ Final states are immutable (completed, cancelled)

---

## Expected Test Output

When tests pass, you should see:

```
PASS  tests/auth.test.js (12.5s)
  Authentication Tests
    POST /api/auth/register
      ✓ should register a new user with valid data (245ms)
      ✓ should reject registration with duplicate email (198ms)
      ...
    POST /api/auth/login
      ✓ should login with correct credentials (156ms)
      ...

PASS  tests/orders.test.js (15.2s)
  Order Tests
    POST /api/orders
      ✓ should create order as guest user (234ms)
      ✓ should calculate prices server-side (189ms)
      ...

PASS  tests/authorization.test.js (14.8s)
PASS  tests/validation.test.js (11.3s)
PASS  tests/integration/orderFlow.test.js (18.7s)
PASS  tests/integration/statusTransitions.test.js (17.9s)

Test Suites: 6 passed, 6 total
Tests:       112 passed, 112 total
Snapshots:   0 total
Time:        90.4s
```

---

## Troubleshooting

### Issue: Tests hang or don't complete

**Solution 1:** Make sure no dev server is running
```bash
# Stop any running Node processes
# Windows: Check Task Manager and close node.exe
# Or use: taskkill /F /IM node.exe
```

**Solution 2:** Clear Jest cache
```bash
npx jest --clearCache
```

### Issue: MongoDB connection errors

**Solution:** Check your MongoDB connection string
```bash
# For local MongoDB:
MONGODB_TEST_URI=mongodb://localhost:27017/patiotime-test

# For MongoDB Atlas:
MONGODB_TEST_URI=mongodb+srv://user:pass@cluster.mongodb.net/patiotime-test
```

### Issue: JWT_SECRET errors

**Solution:** Set JWT_SECRET in environment
```bash
# Tests automatically set this, but if you see errors:
export JWT_SECRET=test-jwt-secret-key  # Mac/Linux
set JWT_SECRET=test-jwt-secret-key     # Windows CMD
$env:JWT_SECRET="test-jwt-secret-key"  # Windows PowerShell
```

### Issue: Port already in use

Tests use port 5001 (different from dev server port 5000). If still seeing port errors:
```bash
# Change PORT in tests/setup.js to a different port
process.env.PORT = '5002';
```

### Issue: Tests fail with "ValidationError"

This usually means:
1. Test database has old data → Tests clear DB before each run, but check manually:
```bash
# Connect to MongoDB and drop test database
mongo
use patiotime-test
db.dropDatabase()
```

2. Models have validation issues → Check that seed data in `testDb.js` matches model schemas

### Issue: Timeout errors

Some tests take time due to bcrypt hashing. If seeing timeouts:
1. Check `jest.config.js` has `testTimeout: 30000` (30 seconds)
2. Check your machine isn't under heavy load
3. Consider using faster bcrypt rounds for tests (modify User model for test env)

---

## Running Individual Test Suites

```bash
# Run only auth tests
npx jest tests/auth.test.js

# Run only order tests
npx jest tests/orders.test.js

# Run only integration tests
npx jest tests/integration/

# Run tests matching a pattern
npx jest --testNamePattern="should register"

# Run with verbose output
npx jest --verbose
```

---

## Coverage Report

After running `npm run test:coverage`, view the HTML report:

```bash
# Report generated at: server/coverage/lcov-report/index.html
# Open in browser to see detailed coverage
```

Coverage goals:
- ✅ Overall: >85%
- ✅ Services: >90%
- ✅ Controllers: >90%
- ✅ Middleware: >85%

---

## Adding New Tests

### 1. Create new test file
```javascript
// tests/myFeature.test.js
const request = require('supertest');
const app = require('../server');
const testDb = require('./helpers/testDb');

describe('My Feature Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  test('should do something', async () => {
    const response = await request(app)
      .get('/api/my-feature')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

### 2. Run your new tests
```bash
npx jest tests/myFeature.test.js
```

### 3. Update coverage goals if needed

---

## Continuous Integration

To add tests to CI/CD (GitHub Actions example):

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd server && npm install
      
      - name: Run tests
        run: cd server && npm test
        env:
          MONGODB_TEST_URI: mongodb://localhost:27017/patiotime-test
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          directory: ./server/coverage
```

---

## Best Practices

### Before Committing
1. Run full test suite: `npm test`
2. Check coverage: `npm run test:coverage`
3. Fix any failing tests
4. Ensure coverage doesn't drop

### When Adding Features
1. Write tests FIRST (TDD approach)
2. Write failing test
3. Implement feature
4. Make test pass
5. Refactor

### When Fixing Bugs
1. Write test that reproduces bug
2. Verify test fails
3. Fix bug
4. Verify test passes
5. Commit both fix and test

---

## Manual Testing

Automated tests don't cover everything. Use `MANUAL-QA-TEST-PLAN.md` for:
- UI/UX testing
- Cross-browser compatibility
- Mobile responsive design
- Accessibility testing
- Visual regression testing

---

## Getting Help

If tests are failing and you're stuck:

1. Check test output carefully - it usually tells you what's wrong
2. Run individual test file to isolate issue
3. Use `console.log()` in test to debug
4. Check that database is clean between tests
5. Verify environment variables are set correctly
6. Review `PHASE-3-COMPLETED.md` for detailed test documentation

---

## Summary

✅ **112 automated tests** ensure code quality  
✅ **~90% code coverage** of critical features  
✅ **Fast feedback** - tests run in ~90 seconds  
✅ **Reliable** - tests clean up after themselves  
✅ **Maintainable** - well-organized and documented  

**Run tests before every deployment!**
