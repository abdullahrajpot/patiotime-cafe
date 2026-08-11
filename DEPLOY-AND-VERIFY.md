# 🚀 Deploy Latest Code & Verify Security

## Current Status

All security issues identified by the team have been addressed. Now we need to ensure the latest code is deployed to production.

## Step 1: Verify Local Code

### Check Current Branch and Commits
```bash
# Check which branch you're on
git branch

# Check latest commit
git log --oneline -5

# Check if there are uncommitted changes
git status
```

## Step 2: Commit All Changes

```bash
# Add all files (including documentation)
git add .

# Commit with descriptive message
git commit -m "security: Verify all security measures are in place

- JWT_SECRET required (process.exit if missing)
- Order history uses JWT authentication (no userId in URL)
- Order creation uses req.user.userId from JWT
- All admin API calls send Authorization header
- Category implementation consistent (ObjectId references)
- Add comprehensive security audit documentation"

# Push to GitHub
git push origin main
```

## Step 3: Verify Deployments

### Vercel (Frontend)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check deployment status
3. Should auto-deploy from GitHub push (takes 2-3 minutes)
4. Look for "Ready" status with latest commit message

### Railway (Backend)
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Check deployment status
3. Should auto-deploy from GitHub push (takes 3-5 minutes)
4. Look for "Success" status with latest commit message

## Step 4: Test Production Security

### Test 1: JWT Secret Required ✅
Backend should have `JWT_SECRET` environment variable set.

**Verify in Railway**:
1. Go to Railway dashboard
2. Select your backend service
3. Click "Variables"
4. Verify `JWT_SECRET` is set (and is NOT a default/weak value)

**Expected**: Backend runs successfully with strong JWT_SECRET

### Test 2: Order History Authentication ✅
```bash
# Test WITHOUT authentication (should fail)
curl https://patiotime-cafe-production.up.railway.app/api/orders/history

# Expected Response:
# {"error":"Access token required"}
# Status: 401

# Test WITH authentication (should work)
# First login to get token:
curl -X POST https://patiotime-cafe-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@patiotime.com","password":"admin123"}'

# Copy the token from response, then:
curl https://patiotime-cafe-production.up.railway.app/api/orders/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: Returns user's orders (or empty array if no orders)
```

### Test 3: Order History IDOR Prevention ✅
The `/api/orders/history` endpoint should:
- ✅ NOT accept userId as a parameter
- ✅ Derive userId from JWT token
- ✅ Only return authenticated user's orders

**URL Structure**:
- ❌ `/api/orders/history/:userId` (OLD - vulnerable to IDOR)
- ✅ `/api/orders/history` (CURRENT - secure)

**Test in Browser**:
1. Open https://patiotime-cafe.vercel.app/admin
2. Login with admin credentials
3. Open DevTools → Network tab
4. Look for request to `/api/orders/history`
5. Verify:
   - URL is `/api/orders/history` (no userId parameter)
   - Request has `Authorization: Bearer <token>` header
   - Response contains only your orders

### Test 4: Admin API Authorization ✅
All admin endpoints should require JWT with admin role.

```bash
# Try admin endpoint WITHOUT token (should fail)
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders

# Expected Response:
# {"error":"Access token required"}
# Status: 401

# Try admin endpoint WITH regular user token (should fail)
# (Create regular user account first, then get token)
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders \
  -H "Authorization: Bearer REGULAR_USER_TOKEN"

# Expected Response:
# {"error":"Admin access required..."}
# Status: 403

# Try admin endpoint WITH admin token (should work)
curl https://patiotime-cafe-production.up.railway.app/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Expected: Returns orders list
```

### Test 5: Order Creation User Binding ✅
When creating an order with authentication, user should be bound from JWT, not client data.

```bash
# Create order with malicious user_id in body
curl -X POST https://patiotime-cafe-production.up.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": "MALICIOUS_USER_ID",
    "customer_name": "Test User",
    "customer_phone": "1234567890",
    "order_type": "pickup",
    "items": [
      {
        "menu_item_id": "VALID_MENU_ITEM_ID",
        "quantity": 1
      }
    ]
  }'

# Expected Behavior:
# - Order is created successfully
# - user_id from body is IGNORED
# - Order is linked to authenticated user from JWT
# - Verify by checking order in admin panel
```

### Test 6: Frontend Authorization Headers ✅
Open browser DevTools and check Network tab for admin API calls:

1. Visit https://patiotime-cafe.vercel.app/admin
2. Login
3. Navigate through admin panel (Orders, Menu, Reservations)
4. Check Network tab for each API call
5. Verify EVERY request has: `Authorization: Bearer <token>`

**Example Requests to Check**:
- GET /api/admin/orders
- GET /api/admin/menu
- POST /api/admin/menu
- PUT /api/admin/menu/:id
- PATCH /api/admin/orders/:id/status
- GET /api/admin/reservations
- GET /api/admin/contacts

**All should have Authorization header** ✅

## Step 5: Verify Category Implementation

### Test Category Consistency
```bash
# Get menu (should work)
curl https://patiotime-cafe-production.up.railway.app/api/menu

# Response should have categories with:
# - name (e.g., "Coffees & Teas")
# - items array
# Each item should have ObjectId in database

# Get categories (admin)
curl https://patiotime-cafe-production.up.railway.app/api/admin/categories \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Response should show categories with:
# - _id (ObjectId)
# - name
# - slug (e.g., "coffees-teas")
# - eyebrow
# - sortOrder
```

## Step 6: Production Checklist

### Environment Variables (Railway)
- [ ] `JWT_SECRET` is set (strong, random value)
- [ ] `MONGO_URI` is set (MongoDB Atlas connection)
- [ ] `CLIENT_URL` is set (https://patiotime-cafe.vercel.app)
- [ ] `NODE_ENV` is set to `production`
- [ ] `PORT` (optional, Railway provides)

### Environment Variables (Vercel)
- [ ] `VITE_API_URL` is set (https://patiotime-cafe-production.up.railway.app/api)

### Security Verification
- [ ] JWT_SECRET is strong (not "secret" or "test123")
- [ ] Order history endpoint is `/api/orders/history` (no userId param)
- [ ] Order history requires authentication
- [ ] Admin endpoints require admin role
- [ ] All admin API calls send JWT token
- [ ] Categories use ObjectId references
- [ ] No hardcoded category values

### Functional Verification
- [ ] Can create order as guest
- [ ] Can create order as authenticated user
- [ ] Can track order with order code
- [ ] Can view order history (authenticated)
- [ ] Cannot view other users' order history
- [ ] Admin can login
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Admin can manage menu items
- [ ] Admin can manage reservations
- [ ] Admin can manage contacts

## Step 7: Security Test Results Template

```markdown
## Production Security Test Results

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Environment**: Production (Vercel + Railway)

### Test 1: JWT Secret Required
- [ ] ✅ JWT_SECRET environment variable is set in Railway
- [ ] ✅ Backend starts successfully
- [ ] ✅ JWT_SECRET is strong (not default/weak value)

### Test 2: Order History Authentication
- [ ] ✅ GET /api/orders/history without token returns 401
- [ ] ✅ GET /api/orders/history with token returns user's orders
- [ ] ✅ URL does not contain userId parameter

### Test 3: IDOR Prevention
- [ ] ✅ Cannot access other users' order history
- [ ] ✅ Server derives userId from JWT
- [ ] ✅ No userId in URL or request body

### Test 4: Admin Authorization
- [ ] ✅ Admin endpoints require authentication
- [ ] ✅ Admin endpoints require admin role
- [ ] ✅ Regular users cannot access admin endpoints

### Test 5: Order User Binding
- [ ] ✅ Order creation ignores user_id from request body
- [ ] ✅ Order creation uses userId from JWT
- [ ] ✅ Cannot create orders for other users

### Test 6: Frontend Authorization
- [ ] ✅ All admin API calls send Authorization header
- [ ] ✅ Token format is "Bearer <token>"
- [ ] ✅ Consistent across all admin operations

### Test 7: Category Implementation
- [ ] ✅ Categories use ObjectId references
- [ ] ✅ Public API accepts slug queries
- [ ] ✅ Admin API uses ObjectIds
- [ ] ✅ No hardcoded category values

**Overall Status**: ✅ PASS / ❌ FAIL

**Issues Found**: (list any issues)

**Notes**: (additional observations)
```

## Step 8: Share Results with Team

After completing all tests:

1. Fill out the test results template
2. Take screenshots of successful tests
3. Document any issues found
4. Share with team via:
   - Email
   - Slack/Teams
   - GitHub issue
   - Project management tool

## Quick Verification Script

Save this as `verify-security.sh`:

```bash
#!/bin/bash

API_URL="https://patiotime-cafe-production.up.railway.app/api"

echo "🔒 Security Verification Script"
echo "================================"
echo ""

echo "Test 1: Order History Without Auth (should fail)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/orders/history")
if [ "$response" = "401" ]; then
  echo "✅ PASS: Returns 401 Unauthorized"
else
  echo "❌ FAIL: Expected 401, got $response"
fi
echo ""

echo "Test 2: Admin Endpoint Without Auth (should fail)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/admin/orders")
if [ "$response" = "401" ]; then
  echo "✅ PASS: Returns 401 Unauthorized"
else
  echo "❌ FAIL: Expected 401, got $response"
fi
echo ""

echo "Test 3: Public Menu Endpoint (should work)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/menu")
if [ "$response" = "200" ]; then
  echo "✅ PASS: Returns 200 OK"
else
  echo "❌ FAIL: Expected 200, got $response"
fi
echo ""

echo "Test 4: Health Check"
response=$(curl -s "$API_URL/health")
echo "Response: $response"
echo ""

echo "================================"
echo "Manual tests still required:"
echo "- Login and test with JWT token"
echo "- Verify admin operations"
echo "- Check frontend authorization headers"
echo "================================"
```

Run with:
```bash
chmod +x verify-security.sh
./verify-security.sh
```

## Summary

After completing these steps:
1. ✅ Latest code deployed to production
2. ✅ Security measures verified
3. ✅ All endpoints tested
4. ✅ Results documented
5. ✅ Team notified

**The application is secure and ready for production use!**

---

**Next**: Share SECURITY-AUDIT-RESPONSE.md with your team
