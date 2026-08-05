# ☕ PatioTime Cafe - Full Stack MERN Application

A modern, full-featured cafe website with online ordering, reservations, and admin management system.

![PatioTime Cafe](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌟 Features

### Customer Features
- 🏠 **Beautiful Homepage** - Hero section, brunch carousel, latest news
- 🍽️ **Dynamic Menu** - Browse menu items by category with images
- 🛒 **Shopping Cart** - Add items, adjust quantities, checkout
- 📦 **Order Tracking** - Track order status in real-time
- 📅 **Reservations** - Book tables online
- 📞 **Contact Form** - Send inquiries directly
- 👤 **User Authentication** - Register, login, profile management
- 📱 **Fully Responsive** - Works on all devices

### Admin Features
- 📊 **Dashboard** - View stats, orders, revenue at a glance
- 📦 **Order Management** - View and update order statuses
- 🍔 **Menu Management** - Full CRUD for menu items
- 🖼️ **Image Upload** - Upload menu item images
- 📅 **Reservations Management** - View and manage reservations
- 📧 **Contact Management** - View and respond to inquiries
- 📱 **Mobile Admin Panel** - Manage on any device

### Technical Features
- ⚡ **Fast Performance** - Vite for lightning-fast development
- 🔒 **Secure** - JWT authentication, password hashing
- 🎨 **Professional Design** - Custom styled with CSS
- 📊 **Real-time Updates** - Auto-refresh order status
- ♾️ **Infinite Carousel** - Smooth scrolling brunch items
- 🔍 **SEO Friendly** - Proper meta tags and structure

---

## 🛠️ Tech Stack

### Frontend
- **React** 18+ - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management (Cart)
- **CSS3** - Custom styling with variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

---

## 📁 Project Structure

```
mern-cafe/
├── client/                # Frontend React app
│   ├── public/           # Static assets
│   │   └── images/       # Uploaded images
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers (Cart)
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utilities (images.js)
│   │   ├── api.js        # API calls
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/               # Backend Express API
│   ├── models/          # Mongoose models
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── User.js
│   │   ├── Reservation.js
│   │   └── Contact.js
│   ├── routes/          # API routes
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── reservations.js
│   │   └── contact.js
│   ├── server.js        # Server entry point
│   ├── seed.js          # Database seeding
│   ├── package.json
│   └── .env             # Environment variables
│
└── Documentation/        # Project docs
    ├── DEPLOYMENT-GUIDE.md
    ├── DEPLOYMENT-CHECKLIST.md
    ├── AUTH-SYSTEM.md
    └── ORDER-HISTORY-UPDATE.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/patiotime-cafe.git
cd patiotime-cafe
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# Then start server
npm run dev
```

Server runs on: `http://localhost:5000`

### 3. Setup Frontend
```bash
cd client
npm install

# Create .env file (optional for local dev)
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Seed Database (Optional)
```bash
cd server
node seed.js
```

---

## 🌐 Deployment

### Quick Deploy
1. **Database**: MongoDB Atlas (Free tier)
2. **Backend**: Render (Free tier)
3. **Frontend**: Vercel (Free tier)

### Step-by-Step Guide
See detailed instructions in:
- 📄 **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Complete deployment tutorial
- ✅ **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)** - Quick checklist

### Live URLs (After Deployment)
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- Admin Panel: `https://your-app.vercel.app/admin`

---

## 📚 API Documentation

### Public Endpoints

#### Menu
```
GET    /api/menu              - Get all menu items
GET    /api/menu?category=x   - Get items by category
```

#### Orders
```
POST   /api/orders            - Create new order
GET    /api/orders/track/:code - Track order by code
GET    /api/orders/history/:userId - Get user order history
```

#### Reservations
```
POST   /api/reservations      - Create reservation
```

#### Contact
```
POST   /api/contact           - Submit contact form
```

#### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
PUT    /api/auth/me           - Update profile (protected)
```

### Admin Endpoints (Protected)

#### Orders Management
```
GET    /api/admin/orders      - Get all orders
GET    /api/admin/orders?status=received - Filter by status
PATCH  /api/admin/orders/:id/status - Update order status
```

#### Menu Management
```
GET    /api/admin/menu        - Get all menu items
POST   /api/admin/menu        - Create menu item
PUT    /api/admin/menu/:id    - Update menu item
DELETE /api/admin/menu/:id    - Delete menu item
POST   /api/admin/upload      - Upload image
```

#### Reservations Management
```
GET    /api/admin/reservations - Get all reservations
PATCH  /api/admin/reservations/:id/status - Update status
DELETE /api/admin/reservations/:id - Delete reservation
```

#### Contacts Management
```
GET    /api/admin/contacts    - Get all contacts
PATCH  /api/admin/contacts/:id/status - Update status
DELETE /api/admin/contacts/:id - Delete contact
```

---

## 🎨 Design System

### Colors
```css
--gold: #c5a059        /* Primary brand color */
--gold-light: #d4b06a  /* Hover states */
--gold-dark: #a88947   /* Active states */
--black: #111111       /* Headers, navbar */
--dark: #0f0e0c        /* Dark backgrounds */
--text: #1b1815        /* Body text */
--muted: #8c887f       /* Secondary text */
```

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Jost (sans-serif)

### Breakpoints
```css
1024px  /* Tablets */
900px   /* Large mobile */
600px   /* Mobile */
400px   /* Small mobile */
```

---

## 🗂️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (customer/admin),
  createdAt: Date
}
```

### MenuItem
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: Boolean,
  badges: [String]
}
```

### Order
```javascript
{
  orderCode: String (unique),
  user: ObjectId (ref: User),
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  orderType: String (pickup/delivery),
  address: String,
  items: [{
    menuItem: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String,
  createdAt: Date
}
```

### Reservation
```javascript
{
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  guests: Number,
  message: String,
  status: String,
  createdAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String,
  createdAt: Date
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/patiotime
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Test Locally
```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

### Test Production Build
```bash
cd client
npm run build
npm run preview
```

---

## 📦 Available Scripts

### Backend
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm run seed   # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Design inspiration from modern cafe websites
- Icons from Heroicons
- Fonts from Google Fonts

---

## 📞 Support

For issues and questions:
- 📧 Email: support@patiotimecafe.com
- 🐛 Issues: GitHub Issues
- 📖 Docs: See documentation folder

---

## 🔄 Changelog

### Version 1.0.0 (2025-02-01)
- ✅ Initial release
- ✅ Full MERN stack implementation
- ✅ User authentication system
- ✅ Order management system
- ✅ Reservation system
- ✅ Admin panel
- ✅ Responsive design
- ✅ Professional dashboard with SVG icons
- ✅ Order history tracking

---

## 🚧 Roadmap

### Planned Features
- [ ] Email notifications for orders
- [ ] SMS order updates
- [ ] Loyalty points system
- [ ] User profile page with order history
- [ ] Reorder from past orders
- [ ] Favorite menu items
- [ ] Reviews and ratings
- [ ] Multiple language support
- [ ] Dark mode
- [ ] Payment integration (Stripe)

---

**Made with ☕ and ❤️**
