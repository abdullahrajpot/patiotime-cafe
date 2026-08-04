# Fix 502 Bad Gateway Error

## Problem
You're getting 502 errors because the server either:
1. Is not running, OR
2. Cannot connect to MongoDB

## Issue Found
Your `.env` file has `<db_username>` as a placeholder - you need to replace it with your actual MongoDB Atlas username!

## Solution

### Step 1: Fix MongoDB Connection String

Open `server/.env` and update the `MONGO_URI`:

**Current (WRONG):**
```
MONGO_URI=mongodb+srv://<db_username>:fwuxN83pfBZUjKuG@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority&appName=Cluster0
```

**Should be (replace `<db_username>` with your actual username):**
```
MONGO_URI=mongodb+srv://YOUR_ACTUAL_USERNAME:fwuxN83pfBZUjKuG@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority&appName=Cluster0
```

### How to Find Your MongoDB Username:

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com
2. Go to **Database Access** (left sidebar)
3. You'll see your database username there
4. Copy that username
5. Replace `<db_username>` in your `.env` file

### Example:

If your MongoDB username is `admin123`, your connection string should be:
```
MONGO_URI=mongodb+srv://admin123:fwuxN83pfBZUjKuG@cluster0.xzvykuv.mongodb.net/patiotime?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Restart the Server

After fixing the `.env` file:

1. **Stop the server** (if running): Press `Ctrl+C` in the server terminal
2. **Start it again**:
   ```bash
   cd server
   npm run dev
   ```

### Expected Output (if successful):

```
API server running on http://localhost:5000
MongoDB connected: mongodb+srv://username:****@cluster0.xzvykuv.mongodb.net/patiotime
```

### If You See Errors:

**Error: "Authentication failed"**
- Your password or username is wrong
- Check MongoDB Atlas credentials

**Error: "Could not connect to any servers"**
- Check your internet connection
- Check MongoDB Atlas IP whitelist (should allow your IP or 0.0.0.0/0 for development)

**Error: "ENOTFOUND"**
- Check the cluster URL is correct
- Check internet connection

## Step 3: Verify Server is Running

Open in browser: http://localhost:5000/api/health

Should return:
```json
{"ok": true}
```

## Step 4: Seed the Database

Once the server is running successfully:

```bash
cd server
npm run seed
```

Should output:
```
✅ Connected successfully!
✅ Old data cleared
✅ Created 3 categories
✅ Created 18 menu items
✅✅✅ Seed complete: 3 categories, 18 menu items. ✅✅✅
```

## Step 5: Test Categories API

Open in browser: http://localhost:5000/api/admin/categories

Should return:
```json
[
  {
    "_id": "...",
    "name": "Coffees & Teas",
    "eyebrow": "Best Drinks",
    "sortOrder": 1
  },
  ...
]
```

## Step 6: Refresh Admin Panel

Now go back to http://localhost:5173/admin and refresh. Categories should load!

## MongoDB Atlas Setup (If Not Done Yet)

If you haven't set up MongoDB Atlas properly:

### 1. Create Database User
1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password
5. Give "Read and write to any database" permissions
6. Click "Add User"

### 2. Whitelist Your IP
1. Go to Network Access
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Or add your specific IP address

### 3. Get Connection String
1. Go to Database → Clusters
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<db_username>` with your actual username
7. Add `/patiotime` after the cluster URL (database name)

## Alternative: Use Local MongoDB

If you want to use local MongoDB instead of Atlas:

### Install MongoDB Locally:
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service

### Update .env:
```
MONGO_URI=mongodb://127.0.0.1:27017/patiotime
```

### Restart Server and Seed

## Quick Checklist

- [ ] Replace `<db_username>` in `.env` with actual username
- [ ] Replace `<password>` if needed in `.env`
- [ ] Restart server (`Ctrl+C`, then `npm run dev`)
- [ ] Verify server starts without errors
- [ ] Test health endpoint: http://localhost:5000/api/health
- [ ] Run seed: `npm run seed` in server folder
- [ ] Test categories: http://localhost:5000/api/admin/categories
- [ ] Refresh admin panel
- [ ] Categories should now appear!

## Still Having Issues?

Check the server terminal for error messages. Common issues:

1. **Port 5000 already in use**: Change PORT in `.env` to 5001
2. **MongoDB timeout**: Check internet connection, MongoDB Atlas whitelist
3. **Authentication failed**: Double-check username and password
4. **Module not found**: Run `npm install` in server folder

## Summary

**The main issue is:** `<db_username>` needs to be replaced with your actual MongoDB username!

**Fix it:**
1. Open `server/.env`
2. Replace `<db_username>` with your real username from MongoDB Atlas
3. Restart server
4. Run seed
5. Refresh admin panel
6. Done! ✅
