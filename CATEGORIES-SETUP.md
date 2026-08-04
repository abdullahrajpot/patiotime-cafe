# Categories Setup Guide

## Why Are Categories Missing?

The category dropdown is empty because your MongoDB database doesn't have any categories yet. The admin panel is working correctly - it's just waiting for data!

## Quick Fix (3 Easy Steps)

### Option 1: Double-Click the Batch File (Easiest!)

1. **Find this file** in the project root:
   ```
   seed-database.bat
   ```

2. **Double-click it**
   - A command window will open
   - It will seed the database
   - Wait for "Seed complete" message

3. **Refresh admin panel**
   - Categories should now appear!

### Option 2: Use Command Line

1. **Open Command Prompt or PowerShell**

2. **Navigate to server folder:**
   ```bash
   cd "C:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe\server"
   ```

3. **Run the seed:**
   ```bash
   node seed.js
   ```

4. **Wait for success message:**
   ```
   Connected to MongoDB for seeding: mongodb://127.0.0.1:27017/patiotime
   Seed complete: 3 categories, 18 menu items.
   ```

5. **Refresh your admin panel**

## What Gets Created

### 3 Categories:
1. **Coffees & Teas** - Best Drinks
2. **Bakery & Lunch** - Delicious Food
3. **All-Day Brunch** - We Also Have

### 18 Sample Menu Items:
- 6 coffee/tea items (Lattes, Cappuccino, Espresso, etc.)
- 6 bakery items (Sandwiches, Waffles, Cakes, etc.)
- 6 brunch items (Pasta dishes)

## After Seeding

### In Admin Panel:
1. Go to http://localhost:5173/admin
2. Click "Menu Items" tab
3. You'll see 18 sample items
4. Click "+ Add New Item"
5. Category dropdown will show 3 categories ✅

### On Menu Page:
1. Go to http://localhost:5173/menu
2. You'll see all 18 items organized by category
3. Three sections with headers

## Verify It Worked

### Check 1: API Endpoint
Open in browser: http://localhost:5000/api/admin/categories

Should show:
```json
[
  { "_id": "...", "name": "Coffees & Teas", ... },
  { "_id": "...", "name": "Bakery & Lunch", ... },
  { "_id": "...", "name": "All-Day Brunch", ... }
]
```

### Check 2: Admin Panel
Category dropdown should have 3 options instead of being empty.

### Check 3: Menu Page
Should display 18 items in 3 category sections.

## Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:** Make sure MongoDB is running
- Windows: Check MongoDB service in Services
- Or start manually: `mongod`

### Problem: "ECONNREFUSED"

**Solution:** Check your `.env` file in server folder:
```
MONGO_URI=mongodb://127.0.0.1:27017/patiotime
PORT=5000
```

### Problem: Seed runs but categories still not showing

**Solution:**
1. Restart the server (Ctrl+C, then `npm run dev`)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for errors

### Problem: "node: command not found"

**Solution:** Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org
- Restart terminal after installation

## Important Notes

### ⚠️ Seed Script Clears Data
The seed script will:
- **Delete ALL categories**
- **Delete ALL menu items**
- Create fresh sample data

If you already have data you want to keep, **don't run the seed script!**

### 🔄 Re-running the Seed
You can run the seed script multiple times. Each time it will:
1. Clear old data
2. Create fresh categories and items

Useful for resetting to default state.

## Manual Category Creation (Alternative)

If you don't want to use the seed script, you can create categories manually through the admin panel or MongoDB.

### Via MongoDB Compass:
1. Connect to: `mongodb://127.0.0.1:27017/patiotime`
2. Go to `categories` collection
3. Click "Insert Document"
4. Add:
   ```json
   {
     "name": "Coffees & Teas",
     "eyebrow": "Best Drinks",
     "sortOrder": 1
   }
   ```
5. Repeat for other categories

### Via MongoDB Shell:
```javascript
mongo patiotime

db.categories.insertMany([
  { name: "Coffees & Teas", eyebrow: "Best Drinks", sortOrder: 1 },
  { name: "Bakery & Lunch", eyebrow: "Delicious Food", sortOrder: 2 },
  { name: "All-Day Brunch", eyebrow: "We Also Have", sortOrder: 3 }
])
```

## Create Your Own Categories (Future)

Currently, categories are managed in the database directly. To add new categories:

### Option 1: Modify seed.js
Edit `server/seed.js` and add new categories:
```javascript
const newCategory = await Category.create({ 
  name: 'Desserts', 
  eyebrow: 'Sweet Treats', 
  sortOrder: 4 
});
```

### Option 2: Use MongoDB directly
Add documents to the `categories` collection.

### Option 3: Build Admin UI (Future Enhancement)
Create a "Categories" tab in the admin panel to:
- Add new categories
- Edit existing categories
- Delete categories
- Reorder categories

## Summary

**To get categories showing:**

1. ✅ Make sure MongoDB is running
2. ✅ Run: `node seed.js` in server folder (or double-click `seed-database.bat`)
3. ✅ Wait for "Seed complete" message
4. ✅ Refresh admin panel
5. ✅ Categories appear in dropdown!

**That's it!** The admin panel will now work perfectly with categories to choose from.

---

**Need Help?** See `FIX-NO-CATEGORIES.md` for more detailed troubleshooting.
