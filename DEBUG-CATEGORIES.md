# Debug: Categories Not Showing

## Step-by-Step Debugging

### Step 1: Check if Categories Exist in Database

Run this command in the `server` folder:

```bash
cd server
node check-categories.js
```

**Expected Output (if categories exist):**
```
✅ Connected successfully!

Found 3 categories:

1. Coffees & Teas
   ID: 507f1f77bcf86cd799439011
   Eyebrow: Best Drinks
   Sort Order: 1

2. Bakery & Lunch
   ...

3. All-Day Brunch
   ...

✅ Categories exist in database!
```

**If you see "NO CATEGORIES FOUND":**
- Continue to Step 2 to seed the database

**If you see connection errors:**
- Check that your MongoDB Atlas connection string is correct in `.env`
- Make sure you replaced `<db_username>` with actual username
- Check that your IP address is whitelisted in MongoDB Atlas

---

### Step 2: Seed the Database

Run this in the `server` folder:

```bash
cd server
npm run seed
```

**Expected Output:**
```
Connecting to MongoDB...
URI: mongodb+srv://****@cluster0.xzvykuv.mongodb.net/...
✅ Connected successfully!

Deleting existing data...
✅ Old data cleared

Creating categories...
✅ Created 3 categories

Creating menu items...
✅ Created 18 menu items

✅✅✅ Seed complete: 3 categories, 18 menu items. ✅✅✅

Categories created:
  1. Coffees & Teas
  2. Bakery & Lunch
  3. All-Day Brunch

✅ Disconnected from database
```

**If seed fails:**
- Check error message carefully
- Verify MongoDB connection string in `.env`
- Make sure MongoDB Atlas cluster is running

---

### Step 3: Test the API Endpoint

**Option A: Open in Browser**
```
http://localhost:5000/api/admin/categories
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Coffees & Teas",
    "eyebrow": "Best Drinks",
    "sortOrder": 1
  },
  {
    "_id": "...",
    "name": "Bakery & Lunch",
    "eyebrow": "Delicious Food",
    "sortOrder": 2
  },
  {
    "_id": "...",
    "name": "All-Day Brunch",
    "eyebrow": "We Also Have",
    "sortOrder": 3
  }
]
```

**Option B: Use PowerShell/CMD**
```powershell
curl http://localhost:5000/api/admin/categories
```

**If API returns empty array `[]`:**
- Categories don't exist in database → Run seed (Step 2)

**If API returns error or doesn't connect:**
- Server not running → Start server: `cd server && npm run dev`
- Wrong port → Check `.env` file for PORT

---

### Step 4: Check Browser Console

1. Open admin panel: http://localhost:5173/admin
2. Click "Menu Items" tab
3. Click "+ Add New Item"
4. Press `F12` to open Developer Tools
5. Go to "Console" tab

**Look for these messages:**
```
Loading categories...
Categories loaded: Array(3)
```

**If you see errors:**
- Note the error message
- Check Network tab for failed requests
- See troubleshooting below

---

### Step 5: Check Network Tab

1. Keep Developer Tools open (F12)
2. Go to "Network" tab
3. Refresh the page
4. Click "+ Add New Item"
5. Look for request to `/api/admin/categories`

**Check the response:**
- Status should be `200 OK`
- Response should show 3 categories
- If status is 404/500 → Server issue
- If request is missing → Frontend issue

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"

**Cause:** MongoDB Atlas connection string is incorrect

**Solution:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Copy the connection string
4. Update `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority
   ```
5. Replace `username` and `password` with actual values
6. Add database name: `/patiotime` before the `?`

### Issue 2: Empty array from API `[]`

**Cause:** No categories in database

**Solution:**
```bash
cd server
npm run seed
```

### Issue 3: "Failed to load categories" alert

**Cause:** Frontend can't reach API

**Solution:**
1. Check server is running on port 5000
2. Check no CORS errors in browser console
3. Verify API URL in `client/src/api.js`

### Issue 4: Categories exist but dropdown is empty

**Cause:** Frontend state not updating

**Solution:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear cache and refresh
3. Check React DevTools for state
4. Check console for errors

### Issue 5: Network request fails

**Cause:** Server not running or wrong port

**Solution:**
1. Check server is running:
   ```bash
   cd server
   npm run dev
   ```
2. Server should show:
   ```
   API server running on http://localhost:5000
   MongoDB connected: mongodb+srv://...
   ```

---

## Full Reset Procedure

If nothing works, do a complete reset:

### 1. Stop Everything
- Stop server (Ctrl+C in server terminal)
- Stop client (Ctrl+C in client terminal)

### 2. Clear and Reinstall
```bash
# Server
cd server
rm -rf node_modules
npm install

# Client
cd ../client
rm -rf node_modules
npm install
```

### 3. Check Environment
```bash
cd ../server
cat .env
```

Make sure it has:
```
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
```

### 4. Seed Database
```bash
cd server
node seed.js
```

Wait for success message.

### 5. Start Server
```bash
cd server
npm run dev
```

Should see:
```
MongoDB connected: mongodb+srv://...
API server running on http://localhost:5000
```

### 6. Test API
Open: http://localhost:5000/api/admin/categories

Should see 3 categories in JSON.

### 7. Start Client
```bash
cd client
npm run dev
```

### 8. Test Admin Panel
1. Open: http://localhost:5173/admin
2. Click "Menu Items"
3. Click "+ Add New Item"
4. Categories should appear!

---

## Verify Connection String

Your `.env` file should look like this:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your database user password
- Add `/patiotime` before the `?` to specify database name
- Keep `?retryWrites=true&w=majority` at the end

**Example:**
```env
MONGO_URI=mongodb+srv://admin:MyPass123@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority
```

---

## Quick Diagnostic Commands

Run these in order:

```bash
# 1. Check categories in DB
cd server
node check-categories.js

# 2. If none found, seed
npm run seed

# 3. Check again
node check-categories.js

# 4. Test API (with server running)
curl http://localhost:5000/api/admin/categories

# 5. Check server logs
# Should see no errors when you open admin panel
```

---

## Still Not Working?

1. **Share these outputs:**
   - Output of `node check-categories.js`
   - Output of `npm run seed`
   - Browser console errors (F12 → Console)
   - Network tab response for `/api/admin/categories`

2. **Check MongoDB Atlas:**
   - Is cluster running?
   - Is IP address whitelisted?
   - Are database credentials correct?
   - Does database user have read/write permissions?

3. **Verify server logs:**
   - Any errors when starting server?
   - Any errors when opening admin panel?
   - Any errors when clicking "+ Add New Item"?

---

## Expected Behavior

When everything is working:

1. **Server starts:**
   ```
   MongoDB connected: mongodb+srv://...
   API server running on http://localhost:5000
   ```

2. **Seed creates data:**
   ```
   ✅ Created 3 categories
   ✅ Created 18 menu items
   ```

3. **API returns categories:**
   ```
   http://localhost:5000/api/admin/categories
   → Array with 3 categories
   ```

4. **Admin panel shows dropdown:**
   - Click "+ Add New Item"
   - Category dropdown has 3 options
   - Can select and submit

---

**Run the diagnostic commands above and let me know what you see!**
