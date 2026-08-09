@echo off
echo ========================================
echo Phase 1 Quick API Tests
echo ========================================
echo.

echo Test 1: Server Health Check
curl -s http://localhost:5000/api/health
echo.
echo.

echo Test 2: Register with Invalid Email (should fail)
curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"invalid\",\"password\":\"test123\"}"
echo.
echo.

echo Test 3: Register with Short Password (should fail)
curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"123\"}"
echo.
echo.

echo Test 4: Admin Endpoint Without Token (should return 401)
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:5000/api/admin/orders
echo.
echo.

echo Test 5: Order History Without Token (should return 401)
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:5000/api/orders/history
echo.
echo.

echo ========================================
echo Quick tests completed!
echo Check the responses above for:
echo - Validation errors for invalid data
echo - 401 errors for protected endpoints
echo ========================================
pause
