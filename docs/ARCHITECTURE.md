# PatioTime Cafe - System Architecture

**Version:** 1.0.0  
**Last Updated:** February 9, 2026

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Order Processing Flow](#order-processing-flow)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

PatioTime Cafe is a full-stack MERN (MongoDB, Express, React, Node.js) application for a cafe/restaurant business. It provides menu browsing, online ordering, table reservations, and an admin dashboard for managing operations.

### Key Features
- **Customer Features**: Menu browsing, online ordering, order tracking, reservations, contact form
- **Admin Features**: Order management, menu management, reservation management, contact management
- **Authentication**: JWT-based auth with role-based access control (customer/admin)

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.11
- **Routing**: React Router DOM 7.1.1
- **HTTP Client**: Fetch API
- **Styling**: CSS (custom stylesheets)
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js v22.19.0
- **Framework**: Express 4.21.2
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose 8.9.4
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Security**: bcrypt 5.1.1 for password hashing
- **File Upload**: Multer 1.4.5-lts.1
- **Validation**: express-validator 7.2.1
- **Rate Limiting**: express-rate-limit 7.5.0
- **Logging**: morgan 1.10.0
- **Deployment**: Railway

### Database
- **Primary**: MongoDB Atlas (Cloud)
- **Collections**: users, orders, menuitems, categories, reservations, contacts

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Vercel)                       │  │
│  │  - Pages: Home, Menu, Checkout, Track, Admin, etc.   │  │
│  │  - Components: Navbar, Footer, MenuItems, etc.       │  │
│  │  - State: localStorage for auth, cart                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Railway)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Express.js Server                       │  │
│  │                                                       │  │
│  │  Middleware Stack:                                    │  │
│  │  ├── CORS                                            │  │
│  │  ├── Body Parser (JSON)                              │  │
│  │  ├── Request Logging (morgan)                        │  │
│  │  ├── Rate Limiting                                   │  │
│  │  └── Error Handler                                   │  │
│  │                                                       │  │
│  │  Routes:                                              │  │
│  │  ├── /api/auth (register, login)                    │  │
│  │  ├── /api/menu (public menu access)                 │  │
│  │  ├── /api/orders (create, track, history)           │  │
│  │  ├── /api/reservations (create)                     │  │
│  │  ├── /api/contact (submit)                          │  │
│  │  └── /api/admin/* (protected admin routes)          │  │
│  │                                                       │  │
│  │  Authentication:                                      │  │
│  │  └── JWT-based with role checking (customer/admin)  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ MongoDB Driver
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (Atlas)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  MongoDB Atlas                        │  │
│  │                                                       │  │
│  │  Collections:                                         │  │
│  │  ├── users (customers & admins)                     │  │
│  │  ├── orders (order history)                         │  │
│  │  ├── menuitems (cafe menu)                          │  │
│  │  ├── categories (menu categories)                   │  │
│  │  ├── reservations (table bookings)                  │  │
│  │  └── contacts (customer messages)                   │  │
│  │                                                       │  │
│  │  Features:                                            │  │
│  │  ├── Automatic backups                              │  │
│  │  ├── Replica sets                                   │  │
│  │  └── Geographic redundancy                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Static Files
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FILE STORAGE (Local/Cloud)                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Menu Item Images                                     │  │
│  │  Location: /client/public/images/                    │  │
│  │  Format: JPEG, PNG, GIF, WebP                        │  │
│  │  Max Size: 5MB per file                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure

```
server/
├── config/
│   └── index.js                 # Centralized configuration
├── controllers/
│   └── orderController.js       # Business logic controllers
├── middleware/
│   ├── auth.js                  # Authentication middleware
│   ├── errorHandler.js          # Global error handling
│   └── validation.js            # Input validation rules
├── models/
│   ├── User.js                  # User schema
│   ├── Order.js                 # Order schema
│   ├── MenuItem.js              # Menu item schema
│   ├── Category.js              # Category schema
│   ├── Reservation.js           # Reservation schema
│   └── Contact.js               # Contact message schema
├── routes/
│   ├── auth.js                  # Authentication routes
│   ├── menu.js                  # Menu routes
│   ├── orders.js                # Order routes
│   ├── admin.js                 # Admin routes
│   ├── reservations.js          # Reservation routes
│   └── contact.js               # Contact routes
├── utils/
│   ├── errors.js                # Custom error classes
│   └── logger.js                # Logging utility
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment config
├── package.json                 # Dependencies
└── server.js                    # Application entry point
```

### Request Flow

```
1. HTTP Request
   │
   ├─→ CORS Middleware
   │
   ├─→ Body Parser
   │
   ├─→ Request Logger
   │
   ├─→ Rate Limiter
   │
   ├─→ Route Handler
   │   │
   │   ├─→ Authentication Middleware (if protected)
   │   │
   │   ├─→ Validation Middleware
   │   │
   │   ├─→ Controller
   │   │   │
   │   │   ├─→ Business Logic
   │   │   │
   │   │   └─→ Database Query (Mongoose)
   │   │
   │   └─→ Response
   │
   └─→ Error Handler (if error occurs)
```

### Middleware Stack

1. **CORS**: Allows requests from frontend domain
2. **express.json()**: Parses JSON request bodies
3. **morgan**: HTTP request logging
4. **express-rate-limit**: Rate limiting (100 req/15min general, 5 req/15min auth)
5. **Routes**: Application-specific route handlers
6. **404 Handler**: Catches undefined routes
7. **Error Handler**: Global error handling

---

## Frontend Architecture

### Directory Structure

```
client/
├── public/
│   ├── images/                  # Menu item images
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Footer
│   │   ├── MenuItems.jsx       # Menu display
│   │   ├── BrunchCarousel.jsx  # Image carousel
│   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   ├── ErrorMessage.jsx    # Error display
│   │   ├── ErrorBoundary.jsx   # Error boundary
│   │   └── OrderHistoryCard.jsx # Order history item
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Menu.jsx            # Menu page
│   │   ├── Checkout.jsx        # Checkout page
│   │   ├── Track.jsx           # Order tracking
│   │   ├── Reservations.jsx    # Reservations page
│   │   ├── Contact.jsx         # Contact page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # User dashboard
│   │   └── Admin.jsx           # Admin panel
│   ├── api.js                  # API client functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── .env.example                # Example environment config
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

### Component Hierarchy

```
App
├── ErrorBoundary
│   ├── Navbar
│   └── Routes
│       ├── Home
│       ├── Menu
│       │   └── MenuItems
│       ├── Checkout
│       ├── Track
│       ├── Reservations
│       ├── Contact
│       ├── Login
│       ├── Register
│       ├── Dashboard
│       │   └── OrderHistoryCard
│       └── Admin
│           ├── Orders Tab
│           ├── Menu Tab
│           ├── Reservations Tab
│           └── Contacts Tab
└── Footer
```

### State Management

**Local State (useState):**
- Component-specific UI state
- Form inputs
- Loading/error states

**Local Storage:**
- Authentication token
- User information
- Shopping cart
- Last order code

**No global state management** (Redux/Context API) - kept simple for this application size.

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  phone: String (optional),
  address: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email`: unique index

---

### Orders Collection

```javascript
{
  _id: ObjectId,
  order_code: String (unique, format: PT-XXXXXX),
  user: ObjectId (ref: 'User', optional for guest orders),
  customer_name: String (required),
  customer_phone: String (required),
  customer_email: String (optional),
  order_type: String (enum: ['pickup', 'delivery']),
  address: String (required if delivery),
  status: String (enum: ['received', 'preparing', 'ready', 'completed', 'cancelled']),
  items: [{
    menu_item_id: ObjectId (ref: 'MenuItem'),
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number (calculated),
  notes: String (optional),
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

**Indexes:**
- `order_code`: unique index
- `user`: index for user order history
- `created_at`: index for sorting

---

### MenuItems Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  category: ObjectId (ref: 'Category', required),
  image: String (filename),
  badge: String (enum: ['new', 'popular', 'special']),
  isAvailable: Boolean (default: true),
  sortOrder: Number (default: 1),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `category`: index for filtering
- `sortOrder`: index for sorting

---

### Categories Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  eyebrow: String,
  slug: String (unique, required),
  sortOrder: Number,
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Default Categories:**
1. Coffees & Teas (slug: coffees-teas)
2. Bakery & Lunch (slug: bakery-lunch)
3. All-Day Brunch (slug: all-day-brunch)

---

### Reservations Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (required),
  date: Date (required),
  time: String (HH:MM format, required),
  guests: Number (required, 1-50),
  message: String (optional),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

### Contacts Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Authentication Flow

```
┌─────────────┐                                  ┌─────────────┐
│   Client    │                                  │   Server    │
└──────┬──────┘                                  └──────┬──────┘
       │                                                │
       │  1. POST /auth/register or /auth/login        │
       │  { email, password, ... }                     │
       ├──────────────────────────────────────────────>│
       │                                                │
       │                        2. Validate credentials│
       │                        3. Hash password (if register)
       │                        4. Generate JWT token  │
       │                                                │
       │  5. Return token + user data                  │
       │<──────────────────────────────────────────────┤
       │  { token, user: {...} }                       │
       │                                                │
       │  6. Store token in localStorage               │
       │                                                │
       │  7. Subsequent requests include token         │
       │  Header: Authorization: Bearer <token>        │
       ├──────────────────────────────────────────────>│
       │                                                │
       │                        8. Verify JWT signature│
       │                        9. Extract user info   │
       │                        10. Process request    │
       │                                                │
       │  11. Return response                          │
       │<──────────────────────────────────────────────┤
       │                                                │
```

### JWT Payload Structure

```javascript
{
  userId: "507f1f77bcf86cd799439011",
  role: "customer",  // or "admin"
  iat: 1675939200,   // Issued at
  exp: 1676544000    // Expiration
}
```

---

## Order Processing Flow

```
┌───────────┐                     ┌──────────┐                     ┌────────┐
│ Customer  │                     │   API    │                     │   DB   │
└─────┬─────┘                     └────┬─────┘                     └───┬────┘
      │                                │                               │
      │ 1. Add items to cart          │                               │
      │    (localStorage)              │                               │
      │                                │                               │
      │ 2. POST /api/orders            │                               │
      │    with cart items             │                               │
      ├───────────────────────────────>│                               │
      │                                │ 3. Validate items             │
      │                                ├──────────────────────────────>│
      │                                │                               │
      │                                │ 4. Calculate total from DB    │
      │                                │<──────────────────────────────┤
      │                                │                               │
      │                                │ 5. Generate order code        │
      │                                │    (PT-XXXXXX)                │
      │                                │                               │
      │                                │ 6. Create order document      │
      │                                ├──────────────────────────────>│
      │                                │                               │
      │ 7. Return order with code      │                               │
      │<───────────────────────────────┤                               │
      │                                │                               │
      │ 8. Store order code            │                               │
      │    (localStorage)              │                               │
      │                                │                               │
      │ 9. Redirect to track page      │                               │
      │                                │                               │
      │ 10. GET /api/orders/track/:code│                               │
      ├───────────────────────────────>│                               │
      │                                │ 11. Find order                │
      │                                ├──────────────────────────────>│
      │                                │                               │
      │                                │ 12. Mask sensitive data       │
      │                                │                               │
      │ 13. Display order status       │                               │
      │<───────────────────────────────┤                               │
      │                                │                               │
```

### Order Status Workflow

```
received → preparing → ready → completed
    │
    └──→ cancelled (can happen at any stage)
```

---

## Security Architecture

### Defense Layers

1. **Input Validation**
   - express-validator on all POST/PUT endpoints
   - Type checking and sanitization
   - Length restrictions

2. **Authentication**
   - JWT tokens (not sessions)
   - Tokens stored in localStorage (client-side)
   - Tokens verified on protected routes

3. **Authorization**
   - Role-based access control (customer/admin)
   - Admin-only routes protected with `requireAdmin` middleware
   - User can only access their own data

4. **Password Security**
   - bcrypt hashing (10 rounds)
   - No plaintext passwords
   - Minimum 6 characters required

5. **Rate Limiting**
   - 100 requests/15min (general)
   - 5 requests/15min (auth endpoints)
   - IP-based tracking

6. **Data Privacy**
   - Phone numbers masked in public endpoints (***-***-1234)
   - Addresses masked (only city/state shown)
   - Full data only in admin view

7. **CORS**
   - Whitelist specific origins
   - Credentials allowed for authorized domains

8. **Environment Variables**
   - Sensitive config in .env (not committed)
   - Strong JWT_SECRET required (32+ chars)

9. **Error Handling**
   - Generic error messages to users
   - Detailed logs on server
   - No stack traces in production

---

## Deployment Architecture

### Frontend (Vercel)

```
GitHub Repo (main branch)
    │
    ├─→ Vercel Auto-Deploy
    │
    ├─→ Build: npm run build
    │
    ├─→ Output: /dist folder
    │
    └─→ CDN Distribution
        └─→ https://patiotime-cafe.vercel.app
```

**Environment Variables:**
- `VITE_API_URL`: Backend API URL

---

### Backend (Railway)

```
GitHub Repo (main branch)
    │
    ├─→ Railway Auto-Deploy
    │
    ├─→ Build: npm install
    │
    ├─→ Start: npm start
    │
    └─→ Server Running
        └─→ https://patiotime-cafe-production.up.railway.app
```

**Environment Variables:**
- `PORT`: Auto-assigned by Railway
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret key
- `CLIENT_URL`: Frontend URL
- `NODE_ENV`: production

---

### Database (MongoDB Atlas)

```
MongoDB Atlas Cluster
    │
    ├─→ Database: patiotime
    │
    ├─→ Replica Set (3 nodes)
    │
    ├─→ Automatic Backups
    │
    └─→ Network Access: 0.0.0.0/0 (allow all)
```

---

## Performance Considerations

### Backend
- Database queries optimized with indexes
- Mongoose lean() for read-only queries
- Pagination for large result sets (future)
- Connection pooling (Mongoose default)

### Frontend
- Code splitting with React Router
- Lazy loading of images
- Vite optimized build
- CDN delivery via Vercel

### Database
- Indexes on frequently queried fields
- Compound indexes for complex queries
- Automatic backups without performance impact

---

## Scalability

### Current Capacity
- MongoDB Atlas: Up to 2GB storage (free tier)
- Railway: Shared resources
- Vercel: Unlimited bandwidth

### Scaling Strategy
1. **Vertical**: Upgrade MongoDB cluster tier
2. **Horizontal**: Add read replicas (MongoDB)
3. **Caching**: Add Redis for menu/category data
4. **CDN**: Already using Vercel CDN
5. **Load Balancing**: Railway provides automatic load balancing

---

## Monitoring & Logging

### Production Monitoring
- Railway dashboard for server metrics
- MongoDB Atlas monitoring for database
- Vercel analytics for frontend
- Custom logging with winston (future)

### Error Tracking
- Server logs via Railway
- Consider Sentry integration (future)

### Health Checks
- `/api/health` endpoint
- Checks MongoDB connection
- Checks disk space
- Returns server status

---

## Future Enhancements

1. **Real-time Updates**: WebSocket for order status
2. **Payment Integration**: Stripe/PayPal
3. **Email Notifications**: Order confirmations
4. **Push Notifications**: PWA with service workers
5. **Advanced Analytics**: Order trends, popular items
6. **Mobile App**: React Native
7. **Multi-language**: i18n support
8. **Reviews & Ratings**: Customer feedback

---

*Last Updated: February 9, 2026*
*Architecture Version: 1.0.0*
