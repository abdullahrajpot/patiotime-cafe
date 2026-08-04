# 🎛️ Admin Panel Guide

## Access the Admin Panel

Visit: **http://localhost:5173/admin**

## Features

### 1️⃣ Orders Tab - Order Management

**Features:**
- ✅ View all orders in real-time
- ✅ Filter orders by status (all, received, preparing, ready, completed, cancelled)
- ✅ Auto-refreshes every 5 seconds
- ✅ Update order status with dropdown
- ✅ View customer details, order items, and totals

**Order Workflow:**
1. **Received** → New order comes in
2. **Preparing** → Kitchen is working on it
3. **Ready** → Order is ready for pickup/delivery
4. **Completed** → Order fulfilled
5. **Cancelled** → Order was cancelled

**How to Use:**
1. Click on different status filters to view specific orders
2. Use the dropdown in each order card to change status
3. Changes save automatically

---

### 2️⃣ Menu Items Tab - Menu Management

**Features:**
- ✅ View all menu items
- ✅ Add new menu items
- ✅ Edit existing items
- ✅ Delete items
- ✅ Manage categories, prices, descriptions, badges

**How to Add a New Menu Item:**

1. Click **"+ Add New Item"** button
2. Fill in the form:
   - **Item Name** (required): e.g., "Cappuccino"
   - **Price** (required): e.g., 3.65
   - **Description**: Brief description of the item
   - **Category** (required): Select from dropdown (Coffees & Teas, Bakery & Lunch, All-Day Brunch)
   - **Badge** (optional): e.g., "NEW", "SEASONAL"
   - **Image Filename**: e.g., "coffee-1.jpg" (must exist in public/images folder)
   - **Sort Order**: Number to control display order (1, 2, 3...)
3. Click **"Add Item"**
4. Item appears immediately on the menu

**How to Edit a Menu Item:**

1. Find the item in the list
2. Click **"Edit"** button
3. Form opens with current values
4. Make your changes
5. Click **"Update Item"**

**How to Delete a Menu Item:**

1. Find the item in the list
2. Click **"Delete"** button
3. Confirm deletion
4. Item is removed from database

---

## API Endpoints

### Order Management
```
GET    /api/admin/orders?status=all     - Get all orders (with filter)
PATCH  /api/admin/orders/:id/status     - Update order status
```

### Menu Management
```
GET    /api/admin/menu                  - Get all menu items
POST   /api/admin/menu                  - Create new menu item
PUT    /api/admin/menu/:id              - Update menu item
DELETE /api/admin/menu/:id              - Delete menu item
GET    /api/admin/categories            - Get all categories
```

---

## Example: Adding a New Coffee Item

```javascript
{
  "name": "Iced Caramel Macchiato",
  "description": "Espresso, Vanilla, Caramel, Cold Milk",
  "price": 4.25,
  "category": "674a1b2c3d4e5f6a7b8c9d0e",  // ID of "Coffees & Teas" category
  "badge": "NEW",
  "image": "coffee-6.jpg",
  "sortOrder": 7
}
```

---

## Tips & Best Practices

### Orders
- ✅ Check the admin panel regularly for new orders
- ✅ Update status as you progress through preparation
- ✅ Use filters to focus on current work (e.g., "preparing" orders)
- ✅ Completed orders stay in the system for record-keeping

### Menu Items
- ✅ Use consistent naming (capitalize properly)
- ✅ Keep descriptions short and appetizing
- ✅ Price format: use 2 decimal places (3.65, not 3.6)
- ✅ Images must exist in `client/public/images/` folder
- ✅ Use badges sparingly for special items
- ✅ Sort order: use increments of 1 (1, 2, 3, 4...)

### Categories
Current categories (set during seed):
1. **Coffees & Teas** - Hot and cold coffee drinks, teas
2. **Bakery & Lunch** - Sandwiches, pastries, light meals
3. **All-Day Brunch** - Full brunch dishes with descriptions

---

## Troubleshooting

**"No orders in this view"**
- No orders match the selected filter
- Try clicking "all" to see all orders

**"Failed to load menu items"**
- Check that backend server is running
- Verify MongoDB connection
- Check browser console for errors

**Item not appearing on menu**
- Check `isAvailable` field (must be true)
- Verify category is correct
- Hard refresh browser (Ctrl + Shift + R)

**Image not showing**
- Verify filename matches file in `public/images/`
- Check spelling and case sensitivity
- Image format should be .jpg or .png

---

## Database Collections

### MenuItem Schema
```javascript
{
  category: ObjectId,      // Reference to Category
  name: String,
  description: String,
  price: Number,
  badge: String,           // "NEW", "SEASONAL", null
  image: String,           // "coffee-1.jpg"
  sortOrder: Number,       // Display order
  isAvailable: Boolean     // true/false
}
```

### Order Schema
```javascript
{
  orderCode: String,       // "PT-ABC123"
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  orderType: String,       // "pickup" | "delivery"
  address: String,
  items: Array,
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String,          // Order workflow status
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Notes

⚠️ **Important:** This admin panel has no authentication. In production, you should:
- Add login/authentication system
- Use JWT tokens or sessions
- Implement role-based access control
- Add HTTPS
- Validate all inputs server-side

---

## Quick Actions

**View live orders:**
```
http://localhost:5173/admin (Orders tab)
```

**Manage menu:**
```
http://localhost:5173/admin (Menu Items tab)
```

**Test customer flow:**
1. Visit http://localhost:5173/menu
2. Add items to cart
3. Complete checkout
4. Check /admin to see the new order

---

**Need Help?** Check the main README.md for setup instructions and troubleshooting!
