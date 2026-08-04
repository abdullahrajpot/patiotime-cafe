# 🎛️ Admin Dashboard - Complete Guide

## 🚀 Access Admin Panel

Visit: **http://localhost:5173/admin**

---

## 📱 Dashboard Overview

The admin panel features a **sidebar navigation** with three main sections:

### 1. 📊 Dashboard (Home)
**Features:**
- Real-time statistics cards
- Total Orders count
- Today's Orders count
- Pending Orders count
- Total Revenue (completed orders)
- Menu Items count
- Quick overview of your cafe operations

**Auto-refresh:** Stats update every 10 seconds

---

### 2. 📦 Orders Management
**Features:**
- View all orders in real-time
- Filter by status: all, received, preparing, ready, completed, cancelled
- Update order status with dropdown
- Auto-refreshes every 5 seconds
- View customer details, items, and totals

**Order Workflow:**
```
Received → Preparing → Ready → Completed
               ↓
           Cancelled (optional)
```

**How to Use:**
1. Click **"Orders"** in sidebar
2. Use status filters at top
3. Change order status using dropdown in each card
4. Orders update automatically

---

### 3. 🍽️ Menu Items Management
**Features:**
- View all menu items
- Add new items (displays immediately on menu page)
- Edit existing items
- Delete items
- Full CRUD operations
- Dynamic menu system

**How Menu Works:**
✅ **Add item in admin** → **Appears on Menu Page automatically**
✅ **Edit item in admin** → **Updates on Menu Page immediately**
✅ **Delete item in admin** → **Removes from Menu Page instantly**

---

## 🎯 Complete Workflow

### Adding a New Menu Item

1. **Click "Menu Items" in sidebar**
2. **Click "+ Add New Item" button**
3. **Fill in the form:**

```
Item Name: Iced Vanilla Latte
Price: 4.50
Description: Espresso, Vanilla Syrup, Cold Milk, Ice
Category: Coffees & Teas (select from dropdown)
Badge: NEW (optional - appears as orange badge)
Image Filename: coffee-7.jpg (must exist in public/images/)
Sort Order: 7 (controls display position)
```

4. **Click "Add Item"**
5. **Item appears immediately on admin list**
6. **Visit /menu page → Item is now visible to customers!**

---

### Editing a Menu Item

1. Find item in the list
2. Click **"Edit"** button
3. Form opens with current values
4. Make changes
5. Click **"Update Item"**
6. Changes appear instantly on menu page

---

### Deleting a Menu Item

1. Find item in the list
2. Click **"Delete"** button (red)
3. Confirm deletion
4. Item removed from database and menu page

---

## 📊 Dashboard Statistics

### What Each Stat Shows:

**Total Orders (📊)**
- All orders since cafe opened
- Includes all statuses

**Today's Orders (📅)**
- Orders placed today (resets at midnight)
- Useful for daily tracking

**Pending Orders (⏳)**
- Orders with status "received" or "preparing"
- Needs immediate attention

**Total Revenue (💰)**
- Sum of all completed orders
- Only counts "completed" status

**Menu Items (🍽️)**
- Total items in your menu
- Across all categories

---

## 🔄 Dynamic Menu System

**How it Works:**

1. **Admin adds item** → Saved to MongoDB
2. **Menu page queries** → `GET /api/menu`
3. **Data returns** → Menu items with categories
4. **Page renders** → Items appear in correct sections

**Categories:**
- **Coffees & Teas** → Displayed in left column
- **Bakery & Lunch** → Displayed in right column
- **All-Day Brunch** → Displayed in grid below

**Real-time Updates:**
- Items added in admin appear immediately
- No page refresh needed (database-driven)
- Customer sees latest menu always

---

## 🎨 Menu Page Sections

### Top Section (2 Columns)
```
┌─────────────────┬─────────────────┐
│ Coffees & Teas  │ Bakery & Lunch  │
│                 │                 │
│ • Item 1        │ • Item 1        │
│ • Item 2        │ • Item 2        │
│ • Item 3        │ • Item 3        │
└─────────────────┴─────────────────┘
```

### Bottom Section (Grid)
```
┌────────┬────────┬────────┐
│ Brunch │ Brunch │ Brunch │
│ Item 1 │ Item 2 │ Item 3 │
├────────┼────────┼────────┤
│ Brunch │ Brunch │ Brunch │
│ Item 4 │ Item 5 │ Item 6 │
└────────┴────────┴────────┘
```

---

## 📝 Field Explanations

### Required Fields:
- **Item Name** - Display name (e.g., "Cappuccino")
- **Price** - Number with decimals (e.g., 3.65)
- **Category** - Select from existing categories

### Optional Fields:
- **Description** - Short description (appears under name)
- **Badge** - Text badge (e.g., "NEW", "SEASONAL")
- **Image Filename** - Must exist in `public/images/`
- **Sort Order** - Number (1, 2, 3...) controls position

### Badges:
```
NEW      → Orange badge with white text
SEASONAL → Orange badge with white text
(custom) → Orange badge with your text
```

---

## 🖼️ Image Guidelines

**Location:** `client/public/images/`

**Format:** `.jpg` or `.png`

**Naming:** Use lowercase, dashes (e.g., `coffee-7.jpg`)

**Sizes:**
- Menu items: ~70x70px displayed
- Brunch cards: ~260px height displayed
- Original: Recommended 800x800px

**Example:**
```
Image Filename: coffee-7.jpg
File Location: client/public/images/coffee-7.jpg
Display Path: /images/coffee-7.jpg
```

---

## 🔍 Testing the Flow

### Test Adding a Menu Item:

1. **Go to Admin:**
   ```
   http://localhost:5173/admin
   ```

2. **Click "Menu Items" in sidebar**

3. **Click "+ Add New Item"**

4. **Fill form:**
   ```
   Name: Test Coffee
   Price: 5.00
   Description: This is a test
   Category: Coffees & Teas
   Badge: NEW
   Image: coffee-1.jpg
   Sort Order: 99
   ```

5. **Click "Add Item"**

6. **Open new tab:**
   ```
   http://localhost:5173/menu
   ```

7. **Scroll to "Coffees & Teas" section**

8. **You should see "Test Coffee" with NEW badge!**

---

## 🎯 Quick Actions

### Daily Operations:
1. **Morning:** Check Dashboard → See pending orders
2. **During Service:** Monitor Orders tab → Update statuses
3. **Add Specials:** Menu Items → Add with "SEASONAL" badge
4. **End of Day:** Check Dashboard → View revenue

### Menu Updates:
1. **New Item:** Menu Items → Add New Item
2. **Price Change:** Menu Items → Edit → Update Price
3. **Remove Item:** Menu Items → Delete
4. **Add Badge:** Menu Items → Edit → Set Badge to "NEW"

---

## 🚨 Troubleshooting

**Item not showing on menu page?**
- Check category is correct
- Verify image filename exists
- Hard refresh browser (Ctrl + Shift + R)
- Check browser console for errors

**Image not displaying?**
- Verify file exists in `public/images/`
- Check spelling exactly matches (case-sensitive)
- Try using a different existing image first

**Orders not updating?**
- Check backend server is running
- Verify MongoDB connection
- Check browser console
- Try manual refresh

**Stats showing 0?**
- Wait 10 seconds for auto-update
- Check orders exist in database
- Verify backend API is responding

---

## 🔐 Security Note

⚠️ **Important:** This admin panel has NO authentication. Anyone can access `/admin`.

**For Production:**
- Add login system
- Use JWT authentication
- Implement role-based access
- Add HTTPS
- Secure MongoDB connection

---

## 📈 Future Enhancements

Potential features to add:
- [ ] Authentication/Login system
- [ ] Category management
- [ ] Bulk image upload
- [ ] Order analytics/charts
- [ ] Customer management
- [ ] Inventory tracking
- [ ] Reports/Export data
- [ ] Email notifications

---

## 🎓 API Endpoints Used

```
# Dashboard
GET /api/admin/orders?status=all
GET /api/admin/menu

# Orders
GET /api/admin/orders?status={status}
PATCH /api/admin/orders/:id/status

# Menu
GET /api/admin/menu
POST /api/admin/menu
PUT /api/admin/menu/:id
DELETE /api/admin/menu/:id
GET /api/admin/categories

# Public Menu (used by customer pages)
GET /api/menu
```

---

## ✨ Key Features Summary

✅ **Dashboard** with real-time stats
✅ **Sidebar navigation** for easy access
✅ **Order management** with live updates
✅ **Full CRUD** for menu items
✅ **Dynamic menu** - admin changes appear instantly
✅ **Beautiful UI** matching cafe theme
✅ **Mobile responsive** design
✅ **Auto-refresh** for orders and stats

---

**Need Help?** Check README.md or QUICKSTART.md for setup instructions!
