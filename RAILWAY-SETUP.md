# Railway Backend Setup Complete ✅

Your backend is deployed on Railway at:
**https://patiotime-cafe-production.up.railway.app**

---

## ✅ What's Already Done

1. **Backend Deployed** on Railway
   - URL: `https://patiotime-cafe-production.up.railway.app`
   - API endpoint: `https://patiotime-cafe-production.up.railway.app/api`

2. **Client Configured** to use Railway backend
   - `.env` file created with Railway URL
   - `.env.production` file created for Vercel deployment

---

## 🔧 Configuration Files Updated

### 1. `client/.env` (Local Development)
```bash
VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
```

### 2. `client/.env.production` (Production Build)
```bash
VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
```

### 3. `client/.env.example` (Template)
Updated with Railway URL as default production URL

---

## 🚀 Testing Locally with Railway Backend

Now your local frontend will connect to the Railway backend:

```bash
# Navigate to client folder
cd client

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend (Railway)**: https://patiotime-cafe-production.up.railway.app/api

---

## ✅ Test Backend Connection

### 1. Test Health Endpoint
Open in browser:
```
https://patiotime-cafe-production.up.railway.app/api/health
```

**Expected Response**:
```json
{
  "ok": true,
  "timestamp": "2025-02-01T...",
  "environment": "production"
}
```

### 2. Test Menu Endpoint
```
https://patiotime-cafe-production.up.railway.app/api/menu
```

Should return array of menu items

### 3. Test from Frontend
```bash
cd client
npm run dev
```

Open http://localhost:5173 and:
- ✅ Menu page should load items
- ✅ Can add items to cart
- ✅ Can place orders
- ✅ Registration works
- ✅ Login works

---

## 🌐 Deploy Frontend to Vercel

Now deploy your frontend with the Railway backend URL:

### Step 1: Push to GitHub
```bash
# From project root
git add .
git commit -m "Configure frontend for Railway backend"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables** (IMPORTANT):
   ```
   VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
   ```

6. Click **"Deploy"**

### Step 3: Update Railway CORS

Once Vercel gives you a URL (e.g., `https://patiotime-cafe.vercel.app`):

1. Go to Railway dashboard
2. Open your backend service
3. Go to **Variables** tab
4. Add/update:
   ```
   CLIENT_URL=https://patiotime-cafe.vercel.app
   ```
5. Save (service will redeploy automatically)

---

## 🔐 Required Environment Variables

### Railway (Backend):
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/patiotime?retryWrites=true&w=majority
JWT_SECRET=your-64-character-random-secret
CLIENT_URL=https://your-app.vercel.app
```

### Vercel (Frontend):
```bash
VITE_API_URL=https://patiotime-cafe-production.up.railway.app/api
```

---

## 📋 Checklist

### Backend (Railway) - ✅ Done
- [x] Backend deployed to Railway
- [x] MongoDB Atlas connected
- [x] Environment variables set
- [x] API endpoints working

### Frontend (Local) - ✅ Done
- [x] `.env` file created with Railway URL
- [x] `.env.production` created
- [x] `api.js` using environment variable
- [x] Ready to connect to Railway backend

### Frontend (Production) - To Do
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Add `VITE_API_URL` in Vercel environment variables
- [ ] Update `CLIENT_URL` in Railway variables
- [ ] Test full deployment

---

## 🧪 Testing Steps

### 1. Test Locally First
```bash
cd client
npm run dev
```

- [ ] Menu loads from Railway
- [ ] Can add items to cart
- [ ] Checkout works
- [ ] Order placement works
- [ ] Registration works
- [ ] Login works
- [ ] Admin panel accessible

### 2. Test Production Build Locally
```bash
cd client
npm run build
npm run preview
```

Should work exactly like development

### 3. After Vercel Deployment
- [ ] Visit Vercel URL
- [ ] Test all features
- [ ] Check browser console (no errors)
- [ ] Test on mobile
- [ ] Test admin panel

---

## 🔍 Troubleshooting

### Issue: CORS Error
**Symptom**: Network errors in browser console

**Solution**:
1. Go to Railway dashboard
2. Check `CLIENT_URL` variable
3. Make sure it matches your Vercel URL exactly
4. No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`

### Issue: 502 Bad Gateway
**Symptom**: Railway returns 502 error

**Solution**:
1. Check Railway logs for errors
2. Verify MongoDB connection string is correct
3. Check all environment variables are set

### Issue: Can't Load Menu
**Symptom**: Menu page shows no items

**Solution**:
1. Check Railway health endpoint works
2. Check Railway menu endpoint: `/api/menu`
3. Add test menu items via admin panel
4. Check browser console for errors

### Issue: Authentication Not Working
**Symptom**: Can't login or register

**Solution**:
1. Check `JWT_SECRET` is set in Railway
2. Test registration endpoint: `/api/auth/register`
3. Check Railway logs for errors

---

## 📞 API Endpoints Reference

All endpoints use base URL: `https://patiotime-cafe-production.up.railway.app/api`

### Public Endpoints:
```
GET  /health                    - Health check
GET  /menu                      - Get all menu items
GET  /menu?category=coffees     - Filter by category
POST /orders                    - Place order
GET  /orders/track/:code        - Track order
GET  /orders/history/:userId    - User order history
POST /reservations              - Make reservation
POST /contact                   - Send contact message
POST /auth/register             - Register user
POST /auth/login                - Login user
```

### Protected Endpoints (Require JWT):
```
GET  /auth/me                   - Get current user
PUT  /auth/me                   - Update profile
```

### Admin Endpoints:
```
GET    /admin/orders            - Get all orders
PATCH  /admin/orders/:id/status - Update order status
GET    /admin/menu              - Get menu for admin
POST   /admin/menu              - Create menu item
PUT    /admin/menu/:id          - Update menu item
DELETE /admin/menu/:id          - Delete menu item
POST   /admin/upload            - Upload image
GET    /admin/reservations      - Get reservations
GET    /admin/contacts          - Get contacts
```

---

## 🎉 You're Ready!

Your backend is deployed on Railway and your local frontend is configured to use it.

**Next Steps**:
1. Test locally: `cd client && npm run dev`
2. Push to GitHub
3. Deploy to Vercel
4. Update Railway CORS with Vercel URL
5. Test production deployment

**Your URLs** (after Vercel deployment):
- 🌐 **Website**: https://your-app.vercel.app
- 🔧 **API**: https://patiotime-cafe-production.up.railway.app/api
- 👨‍💼 **Admin**: https://your-app.vercel.app/admin

---

**Need Help?** Check `DEPLOYMENT-GUIDE.md` for complete deployment instructions!
