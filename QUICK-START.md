# ⚡ Quick Start Guide

Get PatioTime Cafe running in 5 minutes!

---

## 🏃 Local Development

### 1️⃣ Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in new terminal)
cd client
npm install
```

### 2️⃣ Configure Environment

**Backend** - Create `server/.env`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/patiotime
JWT_SECRET=my-secret-key-change-in-production
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `client/.env` (optional):
```bash
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Start MongoDB

```bash
# Windows
mongod

# Mac/Linux
sudo mongod
```

Or use MongoDB Atlas (free cloud database)

### 4️⃣ Run Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 5️⃣ Open Browser

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000/api/health
- **Admin**: http://localhost:5173/admin

---

## 🚀 Deploy to Production

### Quick Deploy (30 minutes)

1. **Setup Database** (5 min)
   - Create account: [MongoDB Atlas](https://mongodb.com/atlas)
   - Create free cluster
   - Get connection string

2. **Deploy Backend** (10 min)
   - Create account: [Render](https://render.com)
   - Connect GitHub repo
   - Root directory: `server`
   - Add environment variables
   - Deploy

3. **Deploy Frontend** (10 min)
   - Create account: [Vercel](https://vercel.com)
   - Connect GitHub repo
   - Root directory: `client`
   - Add VITE_API_URL
   - Deploy

4. **Update CORS** (5 min)
   - Go to Render
   - Update CLIENT_URL with Vercel URL
   - Save changes

**Done!** ✅

📖 **Detailed Guide**: See `DEPLOYMENT-GUIDE.md`  
✅ **Checklist**: See `DEPLOYMENT-CHECKLIST.md`

---

## 🎯 Test Features

### Customer Features
- ✅ Browse menu items
- ✅ Add items to cart
- ✅ Place order (pickup/delivery)
- ✅ Track order by code
- ✅ Make reservation
- ✅ Submit contact form
- ✅ Register account
- ✅ Login/logout

### Admin Features
Go to `/admin`:
- ✅ View dashboard stats
- ✅ Manage orders
- ✅ Update order status
- ✅ Add/edit/delete menu items
- ✅ Upload images
- ✅ View reservations
- ✅ View contacts

---

## 🆘 Common Issues

### Issue: MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# Or use MongoDB Atlas connection string
```

### Issue: Port Already in Use
```bash
# Backend - change PORT in .env
PORT=5001

# Frontend - Vite will auto-use next port
```

### Issue: CORS Error in Production
```bash
# Make sure CLIENT_URL in Render matches Vercel URL exactly
CLIENT_URL=https://your-app.vercel.app
```

### Issue: Can't Find Module
```bash
# Reinstall dependencies
cd server && npm install
cd client && npm install
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `DEPLOYMENT-GUIDE.md` | Complete deployment tutorial |
| `DEPLOYMENT-CHECKLIST.md` | Step-by-step checklist |
| `AUTH-SYSTEM.md` | Authentication details |
| `ORDER-HISTORY-UPDATE.md` | Order tracking feature |

---

## 🔗 Important URLs

### Local Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Admin: `http://localhost:5173/admin`

### Production (After Deploy)
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Admin: `https://your-app.vercel.app/admin`
- Database: MongoDB Atlas Dashboard

---

## 💡 Pro Tips

1. **Use nodemon** - Backend auto-restarts on changes
2. **Use Vite HMR** - Frontend updates instantly
3. **Check Console** - Look for errors during development
4. **Test Mobile** - Resize browser to test responsive design
5. **Seed Database** - Run `node seed.js` for test data

---

## 📞 Need Help?

- 📖 Read the full documentation
- 🐛 Check GitHub Issues
- 💬 Contact: support@patiotimecafe.com

---

**Happy Coding! ☕**
