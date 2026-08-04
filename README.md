# PatioTime Cafe - MERN Stack Online Ordering System

A full-featured cafe/restaurant online ordering system built with the MERN stack, featuring customer ordering (menu, cart, checkout, order tracking) and an admin order management board.

## 🎨 Design

This project is a pixel-perfect clone of the PatioTime Cafe demo, matching:
- Exact typography (Playfair Display & Jost fonts)
- Color scheme and spacing
- Layout and component structure
- All sections and interactions

## 📋 Features

### Customer Features
- **Home Page**: Hero section, menu preview, brunch carousel, Instagram grid, our story, latest news, newsletter signup
- **About Page**: Company story with image gallery
- **Menu Page**: Full menu with categories (Coffees & Teas, Bakery & Lunch, All-Day Brunch)
- **Shopping Cart**: Add/remove items, adjust quantities, view totals
- **Checkout**: Order type selection (pickup/delivery), customer information form
- **Order Tracking**: Real-time order status tracking with order code

### Admin Features
- **Order Board**: Live dashboard showing all orders
- **Status Management**: Update order status (received → preparing → ready → completed)
- **Filter Orders**: View by status (all, received, preparing, ready, completed, cancelled)
- **Auto-refresh**: Dashboard updates every 5 seconds

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Vite
- React Router for navigation
- Context API for cart management
- CSS with custom properties

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- RESTful API architecture
- CORS enabled

## 📁 Project Structure

```
mern-cafe/
├── client/                  # React frontend
│   ├── public/
│   │   └── images/         # All product and UI images
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Cart context
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Route pages
│   │   ├── utils/          # Utilities (images.js)
│   │   ├── api.js          # API client
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   └── vite.config.js      # Vite configuration
├── server/                  # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeding script
│   └── server.js           # Express server
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe"
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/patiotime
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/patiotime
```

5. **Start MongoDB**

If using local MongoDB:
```bash
# Windows - run MongoDB service
net start MongoDB

# Or if installed manually, start mongod
mongod
```

6. **Seed the database**
```bash
cd server
npm run seed
```

You should see:
```
Connected to MongoDB for seeding: mongodb://127.0.0.1:27017/patiotime
Seed complete: 3 categories, 18 menu items.
```

### Running the Application

You need to run both the backend and frontend servers:

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

Open your browser and visit `http://localhost:5173`

## 📱 Application Routes

### Public Routes
- `/` - Home page
- `/about` - About us page
- `/menu` - Full menu with ordering
- `/cart` - Shopping cart
- `/checkout` - Checkout form
- `/track` - Order tracking (with order code)

### Admin Route
- `/admin` - Order management dashboard

## 🔌 API Endpoints

### Menu
- `GET /api/menu` - Get all categories with menu items

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/track/:code` - Track order by code

### Admin
- `GET /api/admin/orders?status=all` - Get orders (filter by status)
- `PATCH /api/admin/orders/:id/status` - Update order status

## 🎨 Design System

### Colors
- Primary Gold: `#c5a059`
- Dark Black: `#111111`
- Text: `#1b1815`
- Muted: `#8c887f`
- Background: `#ffffff`

### Typography
- Headings: Playfair Display (serif)
- Body: Jost (sans-serif)

### Layout
- Max Container Width: 1200px
- Section Padding: 100px vertical
- Navigation Height: 80px

## 📦 Database Models

### Category
- name (String)
- eyebrow (String)
- sortOrder (Number)

### MenuItem
- category (ObjectId)
- name (String)
- description (String)
- price (Number)
- badge (String, optional)
- image (String)
- sortOrder (Number)

### Order
- order_code (String, auto-generated)
- customer_name (String)
- customer_phone (String)
- customer_email (String)
- order_type (enum: pickup/delivery)
- address (String)
- items (Array)
- subtotal (Number)
- tax (Number)
- total (Number)
- status (enum: received/preparing/ready/completed/cancelled)
- notes (String)
- created_at (Date)

## 🧪 Testing the Application

1. **Browse Menu**: Visit home page and menu page
2. **Add to Cart**: Click + buttons on menu items
3. **View Cart**: Check cart badge and visit cart page
4. **Checkout**: Fill in customer details and place order
5. **Track Order**: Use the order code to track status
6. **Admin Dashboard**: Visit `/admin` to manage orders

## 🛠️ Development Commands

### Client
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run oxlint
```

### Server
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
npm run seed     # Seed database
```

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify MongoDB port (default: 27017)

**Port Already in Use:**
- Change PORT in server/.env
- Update proxy in client/vite.config.js

**Images Not Loading:**
- Verify images exist in client/public/images/
- Check browser console for 404 errors

**API Errors:**
- Check server terminal for error messages
- Verify backend is running on port 5000
- Check CORS configuration

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development Notes

- Cart state is managed with React Context API
- Cart data persists in localStorage
- Order codes are auto-generated (format: PT-XXXXXX)
- Tax rate is set to 8% (configurable in CartContext.jsx)
- Admin dashboard auto-refreshes every 5 seconds
- All images are served from public/images directory

## 🎯 Project Requirements Completed

✅ Customer ordering system (menu, cart, checkout, tracking)
✅ Admin order management board
✅ RESTful API with MongoDB database
✅ Responsive design matching reference site
✅ Real-time order status updates
✅ Pickup and delivery order types
✅ Cart with localStorage persistence
✅ Order code generation and tracking
✅ Complete MERN stack implementation

---

**Built with ❤️ using the MERN stack**
