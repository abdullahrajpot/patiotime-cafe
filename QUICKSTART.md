# 🚀 Quick Start Guide

Follow these steps to get your PatioTime Cafe up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v16+) - Run `node --version`
- ✅ MongoDB installed and running - Run `mongod --version`
- ✅ npm installed - Run `npm --version`

## Step-by-Step Setup

### 1️⃣ Install Dependencies

Open **Command Prompt** or **PowerShell** and navigate to the project:

```bash
cd "c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe"
```

**Install server dependencies:**
```bash
cd server
npm install
```

**Install client dependencies:**
```bash
cd ..\client
npm install
```

### 2️⃣ Start MongoDB

**Option A: Windows Service**
```bash
net start MongoDB
```

**Option B: Manual Start**
If MongoDB is not a service, open a **new terminal** and run:
```bash
mongod
```
Leave this terminal open while developing.

### 3️⃣ Seed the Database

Go back to your main terminal and run:
```bash
cd ..\server
npm run seed
```

You should see:
```
✓ Connected to MongoDB for seeding
✓ Seed complete: 3 categories, 18 menu items
```

### 4️⃣ Start the Backend Server

Keep this terminal open:
```bash
npm run dev
```

You should see:
```
MongoDB connected: mongodb://127.0.0.1:27017/patiotime
API server running on http://localhost:5000
```

### 5️⃣ Start the Frontend

Open a **NEW terminal** (keep the backend running):

```bash
cd "c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe\client"
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 6️⃣ Open in Browser

Visit: **http://localhost:5173**

You should see the PatioTime Cafe homepage! 🎉

---

## 🧪 Test the Application

1. **Browse the homepage** - scroll through all sections
2. **Visit Menu** - click "Order Online" or navigate to `/menu`
3. **Add items to cart** - click the + buttons
4. **View cart** - click the cart icon in the navbar
5. **Checkout** - fill in your details and place an order
6. **Track order** - use the order code (e.g., PT-ABC123)
7. **Admin dashboard** - visit `/admin` to manage orders

---

## 🛑 Common Issues & Solutions

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service or mongod process

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Kill the process using port 5000 or change PORT in `.env`

### Images Not Loading
**Solution:** Verify images exist in `client/public/images/`

### API Calls Failing
**Solution:** 
- Check backend is running on port 5000
- Check browser console for errors
- Verify `vite.config.js` proxy settings

---

## 📁 Project URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5173/ |
| About | http://localhost:5173/about |
| Menu | http://localhost:5173/menu |
| Cart | http://localhost:5173/cart |
| Checkout | http://localhost:5173/checkout |
| Track Order | http://localhost:5173/track |
| Admin Board | http://localhost:5173/admin |
| API Health | http://localhost:5000/api/health |

---

## 🎯 Development Workflow

**Daily Development:**
1. Start MongoDB (if not running as service)
2. Terminal 1: `cd server && npm run dev`
3. Terminal 2: `cd client && npm run dev`
4. Code and see changes live!

**Stopping the servers:**
- Press `Ctrl + C` in each terminal
- Stop MongoDB service: `net stop MongoDB` (if needed)

---

## 📝 Next Steps

- Customize menu items in `server/seed.js`
- Add your own images to `client/public/images/`
- Modify colors in `client/src/index.css`
- Deploy to production (MongoDB Atlas + hosting)

---

**Need help? Check README.md for full documentation!**
