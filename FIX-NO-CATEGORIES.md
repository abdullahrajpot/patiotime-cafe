# Fix: No Categories Showing in Admin Panel

## Problem
The category dropdown in the admin panel is empty because the database hasn't been seeded with categories yet.

## Solution: Run the Seed Script

### Step 1: Make Sure MongoDB is Running

First, ensure MongoDB is running on your system.

### Step 2: Run the Seed Script

Open a terminal/command prompt and run:

```bash
cd server
npm run seed
```

**Or manually run:**
```bash
cd server
node seed.js
```

### Expected Output:
```
Connected to MongoDB for seeding: mongodb://127.0.0.1:27017/patiotime
Seed complete: 3 categories, 18 menu items.
```

### Step 3: Refresh Admin Panel

1. Go back to the admin panel: http://localhost:5173/admin
2. Click on "Menu Items" tab
3. Click "+ Add New Item"
4. The Category dropdown should now show:
   - Coffees & Teas
   - Bakery & Lunch
   - All-Day Brunch

## What the Seed Script Does

The seed script (`server/seed.js`) will:

1. **Clear existing data** (if any)
   - Deletes all categories
   - Deletes all menu items

2. **Create 3 categories:**
   - Coffees & Teas
   - Bakery & Lunch
   - All-Day Brunch

3. **Create 18 sample menu items:**
   - 6 coffee/tea items
   - 6 bakery/lunch items
   - 6 all-day brunch items

## If Seed Script Fails

### Error: "Cannot connect to MongoDB"

**Solution:**
1. Make sure MongoDB is installed and running
2. Check your `.env` file in the `server` folder
3. Verify `MONGO_URI` is correct:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/patiotime
   ```

### Error: "Cannot find module"

**Solution:**
```bash
cd server
npm install
```

### Manual Database Setup

If the seed script doesn't work, you can manually add categories through MongoDB:

```javascript
// Connect to MongoDB shell or use MongoDB Compass

// Switch to database
use patiotime

// Insert categories
db.categories.insertMany([
  {
    name: "Coffees & Teas",
    eyebrow: "Best Drinks",
    sortOrder: 1
  },
  {
    name: "Bakery & Lunch",
    eyebrow: "Delicious Food",
    sortOrder: 2
  },
  {
    name: "All-Day Brunch",
    eyebrow: "We Also Have",
    sortOrder: 3
  }
])
```

## Verify Categories Were Created

### Option 1: Check in Admin Panel
1. Go to http://localhost:5173/admin
2. Click "Menu Items" tab
3. Click "+ Add New Item"
4. Category dropdown should show 3 options

### Option 2: Check in MongoDB
```bash
# Using MongoDB shell
mongo patiotime
db.categories.find()

# Or use MongoDB Compass
# Connect to: mongodb://127.0.0.1:27017/patiotime
# Browse to: categories collection
```

### Option 3: Check via API
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

## After Seeding

Once seeded, you'll have:
- **3 categories** ready to use
- **18 sample menu items** displayed on the menu page
- Categories will appear in the dropdown when adding new items

## Note About Sample Data

The seed script also creates 18 sample menu items with the following images (make sure these images exist in `client/public/images/`):

**Coffee Items:**
- cf9.jpg, cf10.jpg, cf11.jpg, cf12.jpg, coffee-5-2.jpg, coffee-1.jpg

**Bakery Items:**
- food-3.jpg, food-4.jpg, home-02.jpg, home-04-2.jpg, home-07.jpg, home-08.jpg

**Brunch Items:**
- img-37.jpg, img-38.jpg, img-39.jpg, choi-sungwoo-mvTvOFa-hQ4-unsplash.jpg, home-06.jpg, alaksiej-carankievic-JBDYs80RTcs-unsplash.jpg

If these images don't exist, the items will still be created but won't display images on the menu page.

## Quick Test After Seeding

1. **Check Menu Page:**
   - Go to http://localhost:5173/menu
   - Should see 18 items organized by category

2. **Check Admin Panel:**
   - Go to http://localhost:5173/admin
   - Click "Menu Items" tab
   - Should see 18 items in the list

3. **Add New Item:**
   - Click "+ Add New Item"
   - Category dropdown should show 3 categories
   - Select a category
   - Fill in other fields
   - Upload an image
   - Submit
   - New item should appear!

## Troubleshooting

### Categories still not showing after seed:

1. **Check server console** for errors
2. **Restart the server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
3. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check browser console** for API errors

### Server won't start after seed:

Make sure you stopped the seed script after it completed. The seed script disconnects from MongoDB when done.

## Summary

**To fix the "no categories" issue:**

```bash
# 1. Open terminal
cd path/to/mern-cafe/server

# 2. Run seed
npm run seed

# 3. Wait for "Seed complete" message

# 4. Refresh admin panel

# 5. Categories should now appear!
```

---

**Status:** Ready to seed! Run `npm run seed` in the server folder.
