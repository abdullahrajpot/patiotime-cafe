# ✅ Setup Checklist - PatioTime Cafe

Use this checklist to ensure everything is properly configured before running the application.

## 🔧 System Requirements

### Required Software
- [ ] **Node.js v16+** 
  - Check: Open Command Prompt and run `node --version`
  - Install: https://nodejs.org/
  
- [ ] **npm** (comes with Node.js)
  - Check: Run `npm --version`
  
- [ ] **MongoDB**
  - Check: Run `mongod --version` or check Windows Services
  - Install: https://www.mongodb.com/try/download/community

### Optional but Recommended
- [ ] **Git** (for version control)
- [ ] **VS Code** or your preferred code editor
- [ ] **Postman** (for API testing)

---

## 📦 Installation Steps

### Step 1: Verify Directory Structure
- [ ] Navigate to: `c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe`
- [ ] Confirm you see `client/` and `server/` folders
- [ ] Confirm `client/public/images/` contains 58 image files

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```
- [ ] Verify `node_modules/` folder created in `server/`
- [ ] No error messages during installation

### Step 3: Install Frontend Dependencies
```bash
cd ..\client
npm install
```
- [ ] Verify `node_modules/` folder created in `client/`
- [ ] No error messages during installation

### Step 4: Configure Environment Variables
- [ ] File `server/.env` exists with correct MongoDB URI
- [ ] PORT set to 5000
- [ ] MONGO_URI points to your MongoDB instance

### Step 5: Start MongoDB
Choose one option:

**Option A - Windows Service:**
```bash
net start MongoDB
```

**Option B - Manual:**
```bash
mongod
```
- [ ] MongoDB is running without errors
- [ ] Default port 27017 is available

### Step 6: Seed Database
```bash
cd server
npm run seed
```
- [ ] See message: "Connected to MongoDB for seeding"
- [ ] See message: "Seed complete: 3 categories, 18 menu items"
- [ ] No error messages

---

## 🚀 Running the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
**Expected Output:**
```
MongoDB connected: mongodb://127.0.0.1:27017/patiotime
API server running on http://localhost:5000
```
- [ ] Backend starts without errors
- [ ] See both success messages
- [ ] Terminal stays open (server is running)

### Terminal 2 - Frontend Server
```bash
cd client
npm run dev
```
**Expected Output:**
```
VITE v8.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```
- [ ] Frontend starts without errors
- [ ] See success message with URL
- [ ] Terminal stays open (server is running)

### Browser Test
- [ ] Open browser to http://localhost:5173
- [ ] Homepage loads with hero image
- [ ] See menu items in "À la Carte" section
- [ ] Images load correctly
- [ ] Navigation works (Home, About, Menu links)

---

## 🧪 Feature Testing

### Customer Features
- [ ] **Home Page**
  - [ ] Hero section displays
  - [ ] Menu preview shows items
  - [ ] Brunch carousel works
  - [ ] Instagram grid displays
  - [ ] Newsletter form present
  
- [ ] **Menu Page** (Click "Order Online")
  - [ ] All menu items display
  - [ ] Can click + to add items to cart
  - [ ] Cart badge updates with count
  
- [ ] **Cart** (Click cart icon)
  - [ ] Cart items display correctly
  - [ ] Can increase/decrease quantity
  - [ ] Can remove items
  - [ ] Totals calculate correctly (Subtotal + Tax)
  
- [ ] **Checkout**
  - [ ] Form displays
  - [ ] Can switch between Pickup/Delivery
  - [ ] Can fill in customer details
  - [ ] "Place Order" button works
  
- [ ] **Order Tracking**
  - [ ] Can enter order code
  - [ ] Order status displays
  - [ ] Order details show correctly

### Admin Features
- [ ] **Admin Dashboard** (Visit /admin)
  - [ ] All orders display
  - [ ] Can filter by status
  - [ ] Can update order status
  - [ ] Auto-refresh works (wait 5 seconds)

---

## 🔍 API Testing

Test these endpoints directly (use Postman or browser):

- [ ] `GET http://localhost:5000/api/health` → Returns `{"ok": true}`
- [ ] `GET http://localhost:5000/api/menu` → Returns categories and items
- [ ] Backend responds on port 5000
- [ ] Frontend proxies API calls correctly

---

## 🐛 Troubleshooting

If something doesn't work, check these:

### Backend Issues
- [ ] MongoDB is running (check Windows Services or terminal)
- [ ] Port 5000 is not in use by another app
- [ ] `.env` file exists in `server/` folder
- [ ] Database was seeded successfully

### Frontend Issues
- [ ] Port 5173 is not in use by another app
- [ ] Backend is running and responding
- [ ] Browser console shows no errors (F12)
- [ ] Images exist in `public/images/` folder

### Common Errors
**"ECONNREFUSED 127.0.0.1:27017"**
→ MongoDB not running, start it

**"Port 5000 already in use"**
→ Another app using port, change in .env or kill process

**"Cannot GET /api/menu"**
→ Backend not running or wrong port

**Images showing 404**
→ Check image files exist in correct folder

---

## ✨ Success Criteria

Your application is ready when:
- ✅ Homepage loads with all sections visible
- ✅ Can browse menu and see all items with images
- ✅ Can add items to cart and see cart count update
- ✅ Can complete checkout and receive order code
- ✅ Can track order with the code
- ✅ Admin can see and manage orders
- ✅ No console errors in browser (F12)
- ✅ Both servers running without errors

---

## 📞 Need Help?

1. Check the error message in terminal
2. Look at browser console (F12 → Console tab)
3. Review QUICKSTART.md for common solutions
4. Check README.md for detailed documentation

---

**Status: Ready to launch! 🚀**

Once all items are checked, your PatioTime Cafe is fully operational!
