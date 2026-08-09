# PatioTime Cafe - Developer Guide

**Version:** 1.0.0  
**Last Updated:** February 9, 2026

Welcome to the PatioTime Cafe development team! This guide will help you set up your development environment and understand our workflows.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

**Required Software:**
- Node.js v18+ (v22.19.0 recommended)
- npm v9+ or yarn
- Git
- MongoDB Compass (optional, for database GUI)
- Postman or Thunder Client (optional, for API testing)

**Recommended IDE:**
- Visual Studio Code with extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - MongoDB for VS Code
  - REST Client

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/patiotime-cafe.git
cd patiotime-cafe

# 2. Install backend dependencies
cd server
npm install

# 3. Setup backend environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# 4. Install frontend dependencies
cd ../client
npm install

# 5. Setup frontend environment
cp .env.example .env
# Default settings should work for local development

# 6. Start backend (from server folder)
cd ../server
npm start
# Backend runs on http://localhost:5000

# 7. Start frontend (from client folder - new terminal)
cd ../client
npm run dev
# Frontend runs on http://localhost:5173

# 8. Initialize categories (one-time setup)
cd ../server
node create-categories.js
```

---

## Development Environment Setup

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended for Development)**
1. Create free Atlas account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/patiotime_dev?retryWrites=true&w=majority
   ```

**Option 2: Local MongoDB**
1. Install MongoDB Community Server
2. Start MongoDB: `mongod`
3. Add to `server/.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/patiotime_dev
   ```

### Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/patiotime_dev
JWT_SECRET=dev_secret_key_for_local_testing_only
CLIENT_URL=http://localhost:5173
RATE_LIMIT_ENABLED=false
REQUEST_LOGGING=true
LOG_LEVEL=debug
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Create Admin User

After setting up, create an admin account:

1. Register via frontend: http://localhost:5173/register
2. Open MongoDB Compass or Atlas
3. Find your user in `patiotime_dev.users`
4. Change `role` field from `customer` to `admin`
5. Login to access admin panel

---

## Project Structure

```
patiotime-cafe/
├── client/                    # Frontend React app
│   ├── public/
│   │   └── images/           # Menu item images
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (routes)
│   │   ├── api.js            # API client functions
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── .env                  # Frontend environment variables
│   ├── .env.example          # Example environment config
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── server/                    # Backend Node.js app
│   ├── config/
│   │   └── index.js          # Configuration with validation
│   ├── controllers/
│   │   └── orderController.js # Business logic controllers
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── MenuItem.js
│   │   ├── Category.js
│   │   ├── Reservation.js
│   │   └── Contact.js
│   ├── routes/               # Express route handlers
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   ├── reservations.js
│   │   └── contact.js
│   ├── utils/
│   │   ├── errors.js         # Custom error classes
│   │   └── logger.js         # Logging utility
│   ├── .env                  # Backend environment variables
│   ├── .env.example          # Example environment config
│   ├── package.json          # Backend dependencies
│   └── server.js             # Application entry point
│
├── docs/                      # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT-GUIDE.md
│   ├── DEVELOPER-GUIDE.md
│   └── BACKUP-RESTORE.md
│
├── .gitignore                # Git ignore rules
├── README.md                 # Project README
└── IMPLEMENTATION-PLAN.md    # Implementation roadmap
```

---

## Coding Standards

### JavaScript/React

**Style Guide:**
- Use ES6+ features (arrow functions, destructuring, async/await)
- Use functional components with hooks (not class components)
- Use `const` by default, `let` when reassignment needed
- Never use `var`
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Use camelCase for variables and functions
- Use PascalCase for React components

**Example:**
```javascript
// Good
const getUserOrders = async (userId) => {
  try {
    const orders = await Order.find({ user: userId });
    return orders;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
};

// Bad
var get_user_orders = function(user_id) {
  return Order.find({user: user_id})
}
```

### React Components

**Component Structure:**
```javascript
import { useState, useEffect } from 'react';
import { someUtil } from '../utils';

// Component should have a clear, descriptive name
export default function MyComponent({ prop1, prop2 }) {
  // 1. State declarations
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Helper functions
  const formatData = (input) => {
    // Helper logic
  };

  // 5. Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // 6. Main render
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
}
```

### API Routes

**Route Structure:**
```javascript
const express = require('express');
const { validateInput } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// GET route
router.get('/resource', async (req, res) => {
  try {
    // Logic here
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route with validation and auth
router.post('/resource', 
  authenticateToken, 
  validateInput, 
  async (req, res) => {
    try {
      // Logic here
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-profile.js` |
| React Components | PascalCase | `UserProfile.jsx` |
| Functions | camelCase | `getUserProfile()` |
| Variables | camelCase | `userProfile` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| CSS Classes | kebab-case | `.user-profile` |
| Database Collections | lowercase | `users`, `orders` |
| API Endpoints | kebab-case | `/api/user-profile` |

### Comments

**When to comment:**
- Complex algorithms
- Non-obvious business logic
- TODO items
- API documentation

**When NOT to comment:**
- Obvious code
- Redundant descriptions

```javascript
// Good - explains WHY
// Calculate total with 15% service charge for delivery orders
const total = subtotal * (orderType === 'delivery' ? 1.15 : 1.0);

// Bad - explains WHAT (code already shows this)
// Add 1 to count
count = count + 1;
```

---

## Git Workflow

### Branch Strategy

```
main (production)
  └── develop (staging)
       ├── feature/add-payment
       ├── feature/email-notifications
       ├── bugfix/order-validation
       └── hotfix/security-patch
```

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Messages

**Format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
# Good commits
git commit -m "feat: add email notifications for orders"
git commit -m "fix: resolve CORS issue with Vercel deployment"
git commit -m "docs: update API documentation with new endpoints"

# Bad commits
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

### Workflow

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: implement my feature"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# - Base: develop
# - Compare: feature/my-feature
# - Request review from team

# 5. After approval, merge to develop
# 6. Deploy develop to staging for testing
# 7. After testing, merge develop to main
# 8. Deploy main to production
```

---

## Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

**Backend Test Example:**
```javascript
// server/tests/orders.test.js
const request = require('supertest');
const app = require('../server');

describe('Order API', () => {
  let authToken;

  beforeAll(async () => {
    // Setup: login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test123' });
    authToken = res.body.token;
  });

  test('should create order', async () => {
    const orderData = {
      customer_name: 'Test User',
      customer_phone: '555-1234',
      order_type: 'pickup',
      items: [{ menu_item_id: 'validId', quantity: 1 }]
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('order_code');
  });
});
```

---

## Debugging

### Backend Debugging

**Console Logging:**
```javascript
console.log('📝 Order data:', orderData);
console.error('❌ Error:', error);
console.warn('⚠️  Warning:', warning);
```

**VS Code Debugger:**
1. Add breakpoint in code
2. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```
3. Press F5 to start debugging

**Railway Logs:**
```bash
railway logs
```

### Frontend Debugging

**React DevTools:**
1. Install React DevTools browser extension
2. Open DevTools (F12)
3. Go to "Components" or "Profiler" tab

**Console Logging:**
```javascript
console.log('🔍 Current state:', state);
console.log('📨 API response:', data);
```

**Network Tab:**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Filter by "Fetch/XHR"
4. Inspect API calls

---

## Common Tasks

### Add New API Endpoint

1. **Create route handler** (`server/routes/myroute.js`):
```javascript
router.get('/my-endpoint', async (req, res) => {
  // Logic
  res.json({ data });
});
```

2. **Register route** (`server/server.js`):
```javascript
app.use('/api/myroute', require('./routes/myroute'));
```

3. **Add API function** (`client/src/api.js`):
```javascript
export const getMyData = async () => {
  return handle(async () => {
    const res = await fetch(`${BASE}/myroute/my-endpoint`);
    return res.json();
  });
};
```

4. **Use in component**:
```javascript
const data = await getMyData();
```

### Add New Database Model

1. **Create model** (`server/models/MyModel.js`):
```javascript
const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MyModel', mySchema);
```

2. **Use in route**:
```javascript
const MyModel = require('../models/MyModel');

router.get('/items', async (req, res) => {
  const items = await MyModel.find();
  res.json(items);
});
```

### Add New React Page

1. **Create page component** (`client/src/pages/MyPage.jsx`):
```javascript
export default function MyPage() {
  return (
    <div className="page-wrap">
      <h1>My Page</h1>
    </div>
  );
}
```

2. **Add route** (`client/src/App.jsx`):
```javascript
import MyPage from './pages/MyPage';

// In Routes
<Route path="/my-page" element={<MyPage />} />
```

3. **Add navigation** (`client/src/components/Navbar.jsx`):
```javascript
<Link to="/my-page">My Page</Link>
```

---

## Best Practices

### Security
- ✅ Never commit `.env` files
- ✅ Always validate user input
- ✅ Use bcrypt for passwords
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ❌ Don't trust client-side data
- ❌ Don't log sensitive information

### Performance
- ✅ Use indexes on frequently queried fields
- ✅ Implement pagination for large datasets
- ✅ Cache static data
- ✅ Optimize images before upload
- ❌ Don't fetch all data at once
- ❌ Don't perform N+1 queries

### Code Quality
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Write self-documenting code
- ✅ Handle errors gracefully
- ✅ Write tests for critical paths
- ❌ Don't repeat yourself (DRY)
- ❌ Don't leave commented-out code

---

## Troubleshooting

### Backend Won't Start

**Error: "Port 5000 already in use"**
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm start
```

**Error: "MongoDB connection failed"**
- Check MONGO_URI in `.env`
- Verify MongoDB is running
- Check network access (Atlas)

### Frontend Won't Start

**Error: "EADDRINUSE"**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Error: "Cannot GET /api/..."**
- Check VITE_API_URL in `.env`
- Verify backend is running
- Check console for CORS errors

### Database Issues

**Error: "Collection not found"**
- Collections auto-create on first insert
- Run seed script to initialize data

**Error: "Duplicate key error"**
- Unique constraint violated
- Check for existing document with same value

---

## Resources

### Documentation
- [MongoDB Docs](https://docs.mongodb.com)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Node.js Docs](https://nodejs.org/docs)

### Tools
- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com) - Code editor

### Learning
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)
- [React Tutorial](https://react.dev/learn)

---

## Getting Help

**Team Communication:**
- Slack: #dev-patiotime channel
- Email: dev-team@patiotime.com

**Code Reviews:**
- Required for all PRs
- At least one approval needed
- Address all comments before merge

**Questions:**
- Check documentation first
- Search existing issues on GitHub
- Ask in team Slack channel
- Create GitHub issue if needed

---

## Next Steps

1. Complete local environment setup
2. Run the application locally
3. Create a test admin account
4. Browse through the codebase
5. Pick a task from the backlog
6. Make your first contribution!

---

*Last Updated: February 9, 2026*
*Developer Guide Version: 1.0.0*

**Welcome to the team! Happy coding! 🚀**
