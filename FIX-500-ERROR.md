# Fix 500 Error - Authentication Setup

## The Issue
The `/api/auth/register` endpoint is returning a 500 error because the authentication dependencies are not installed.

---

## Quick Fix (3 Steps)

### Step 1: Check Setup
```bash
cd server
node check-setup.js
```

This will show you what's missing.

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT tokens

### Step 3: Restart Server
```bash
npm run dev
```

Server should now start without errors!

---

## Verify It's Working

### Test 1: Server Running
Look for:
```
MongoDB connected: mongodb://127.0.0.1:27017/patiotime
API server running on http://localhost:5000
```

### Test 2: Test Registration
Open browser and go to: `http://localhost:5173/register`

Fill out the form and try to register. It should work!

### Test 3: Check Menu
Go to home page. The brunch carousel should load without errors.

---

## Common Errors & Solutions

### Error: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd server
npm install bcryptjs jsonwebtoken
npm run dev
```

### Error: "MongooseError: Operation `users.findOne()` buffering timed out"
**Solution:** MongoDB is not running
```bash
# Windows - Start MongoDB service
net start MongoDB
```

### Error: "EADDRINUSE: address already in use :::5000"
**Solution:** Port 5000 is in use
- Kill the process using port 5000
- Or change PORT in .env file

---

## Expected Server Console Output

When server starts correctly:
```
MongoDB connected: mongodb://127.0.0.1:27017/patiotime
API server running on http://localhost:5000
```

When you register a user:
```
POST /api/auth/register 201 - - 124.567 ms
```

When you login:
```
POST /api/auth/login 200 - - 98.234 ms
```

---

## Manual Dependency Installation

If `npm install` doesn't work, install one by one:

```bash
cd server
npm install bcryptjs@2.4.3
npm install jsonwebtoken@9.0.2
npm run dev
```

---

## Check Package.json

Your `server/package.json` should have:

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.9.1",
    "multer": "^1.4.5-lts.1"
  }
}
```

If `bcryptjs` or `jsonwebtoken` are missing, add them manually and run `npm install`.

---

## Still Not Working?

### Check 1: Server Logs
Look at the server console for error messages. The error will tell you what's wrong.

### Check 2: MongoDB
Make sure MongoDB is running:
```bash
mongosh
# Should connect without errors
```

### Check 3: File Permissions
Make sure you have write permissions in the server folder.

### Check 4: Node Version
```bash
node --version
# Should be v16 or higher
```

---

## Success Indicators

✅ Server starts without errors
✅ "MongoDB connected" message appears  
✅ No 500 errors in browser console
✅ Can register new user
✅ Can login
✅ Brunch carousel loads
✅ Menu items load

---

## Next Steps After Fix

1. ✅ Register a test user
2. ✅ Login with that user
3. ✅ See your name in navigation
4. ✅ Test logout
5. ✅ Browse the site

---

**If you still see errors after following these steps, share the server console output!**
