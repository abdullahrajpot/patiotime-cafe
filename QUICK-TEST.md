# 🚀 Quick Test - Railway Backend

Your backend is live on Railway! Test it now.

---

## ✅ Backend URL
```
https://patiotime-cafe-production.up.railway.app
```

---

## 🧪 Quick Tests

### 1. Test Health Check
Open in browser or use curl:
```bash
https://patiotime-cafe-production.up.railway.app/api/health
```

**Expected**:
```json
{
  "ok": true,
  "timestamp": "2025-02-01T...",
  "environment": "production"
}
```

✅ If you see this, backend is working!

---

### 2. Test Menu Endpoint
```bash
https://patiotime-cafe-production.up.railway.app/api/menu
```

**Expected**: Array of menu items (might be empty if not seeded)

---

### 3. Test with Local Frontend

```bash
# Navigate to client folder
cd client

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

**Open**: http://localhost:5173

**Test**:
- ✅ Menu page loads
- ✅ Can add items to cart
- ✅ Checkout works
- ✅ Can place order
- ✅ Registration works
- ✅ Login works

---

## 🔧 Configuration Applied

### Client `.env` file:
```bash
VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
```

This tells your local frontend to connect to Railway backend.

---

## 📝 Next Steps

### Option 1: Test Locally
```bash
cd client
npm run dev
# Test all features with Railway backend
```

### Option 2: Deploy to Production
```bash
# 1. Commit changes
git add .
git commit -m "Configure Railway backend URL"
git push origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import repository
# - Add environment variable:
#   VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
# - Deploy

# 3. Update Railway CORS
# - Go to Railway dashboard
# - Add variable: CLIENT_URL=https://your-vercel-url.vercel.app
```

---

## ⚠️ Important: CORS Setup

After deploying frontend to Vercel, update Railway:

**Railway Environment Variables**:
```bash
CLIENT_URL=https://your-actual-vercel-url.vercel.app
```

Without this, you'll get CORS errors!

---

## 🎯 Test Checklist

### Backend Tests:
- [ ] `/api/health` returns success
- [ ] `/api/menu` returns data
- [ ] Backend URL is accessible

### Frontend Tests:
- [ ] Local dev server starts
- [ ] Menu page loads items
- [ ] Can add to cart
- [ ] Checkout form works
- [ ] Can place order
- [ ] Registration works
- [ ] Login works
- [ ] Admin panel loads

### Production Tests (After Vercel Deploy):
- [ ] Production site loads
- [ ] All features work
- [ ] No CORS errors
- [ ] Mobile responsive
- [ ] Admin accessible

---

## 💡 Quick Commands

```bash
# Start local frontend (connects to Railway)
cd client && npm run dev

# Build for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Check if backend is alive
curl https://patiotime-cafe-production.up.railway.app/api/health
```

---

## 🆘 Quick Fixes

### CORS Error?
Update `CLIENT_URL` in Railway to match your frontend URL

### Can't Load Menu?
Check Railway logs, verify MongoDB connection

### 502 Error?
Check Railway service is running, check environment variables

---

**Ready to Test!** 🎉

Run: `cd client && npm run dev`
