require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservations');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// CORS configuration - Allow frontend domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5175', // Added for Vite dev server
  'http://localhost:5174', // Additional Vite ports
  'https://patiotime-cafe.vercel.app', // Your Vercel frontend
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin); // Debug log
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging (only in development)
if (process.env.NODE_ENV !== 'test') {
  if (process.env.NODE_ENV === 'production') {
    // Production: log only errors and important requests
    app.use(morgan('combined', {
      skip: (req, res) => res.statusCode < 400
    }));
  } else {
    // Development: log all requests
    app.use(morgan('dev'));
  }
}

// Rate limiting - RELAXED FOR DEVELOPMENT
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Much higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Only apply rate limiting in production
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Stricter rate limiting for auth routes - RELAXED
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 5 to 50 for development
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Only in production
if (process.env.NODE_ENV === 'production') {
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
}

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../client/public/images')));

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Debug endpoint to check routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = middleware.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '');
          routes.push({
            path: path + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({
    totalRoutes: routes.length,
    routes: routes,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    codeVersion: '2026-02-09-phase-1-8-complete'
  });
});

app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version || '1.0.0',
    codeVersion: '2026-02-09-phase-1-8-complete',
    checks: {}
  };

  // Check MongoDB connection
  try {
    if (mongoose.connection.readyState === 1) {
      healthCheck.checks.database = {
        status: 'connected',
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      };
    } else {
      healthCheck.checks.database = {
        status: 'disconnected',
        readyState: mongoose.connection.readyState,
      };
      healthCheck.status = 'degraded';
    }
  } catch (error) {
    healthCheck.checks.database = {
      status: 'error',
      message: error.message,
    };
    healthCheck.status = 'unhealthy';
  }

  // Check disk space for uploads (basic check)
  try {
    const uploadPath = path.join(__dirname, '../client/public/images');
    if (require('fs').existsSync(uploadPath)) {
      const stats = require('fs').statSync(uploadPath);
      healthCheck.checks.uploads = {
        status: 'ok',
        directory: 'exists',
        accessible: true,
      };
    } else {
      healthCheck.checks.uploads = {
        status: 'warning',
        directory: 'not_found',
        message: 'Upload directory does not exist',
      };
    }
  } catch (error) {
    healthCheck.checks.uploads = {
      status: 'error',
      message: error.message,
    };
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  healthCheck.checks.memory = {
    status: 'ok',
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  };

  // Determine overall status
  const hasErrors = Object.values(healthCheck.checks).some(check => check.status === 'error');
  const hasWarnings = Object.values(healthCheck.checks).some(check => check.status === 'warning' || check.status === 'disconnected');
  
  if (hasErrors) {
    healthCheck.status = 'unhealthy';
  } else if (hasWarnings) {
    healthCheck.status = 'degraded';
  }

  // Set appropriate HTTP status code
  const statusCode = healthCheck.status === 'ok' ? 200 : healthCheck.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(healthCheck);
});

// Cache statistics endpoint (for monitoring)
app.get('/api/cache/stats', (req, res) => {
  const { getStats } = require('./middleware/cache');
  res.json(getStats());
});

// EMERGENCY: Initialize categories without auth (TEMPORARY SOLUTION)
app.post('/api/init-categories-now', async (req, res) => {
  try {
    const Category = require('./models/Category');
    
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      const categories = await Category.find().sort({ sortOrder: 1 });
      return res.json({ 
        success: true,
        message: 'Categories already exist', 
        count: existingCount,
        categories 
      });
    }

    const defaultCategories = [
      {
        name: 'Coffees & Teas',
        eyebrow: 'Best Drinks',
        slug: 'coffees-teas',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Bakery & Lunch',
        eyebrow: 'Delicious Food',
        slug: 'bakery-lunch',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'All-Day Brunch',
        eyebrow: 'We Also Have',
        slug: 'all-day-brunch',
        sortOrder: 3,
        isActive: true
      }
    ];

    const created = await Category.insertMany(defaultCategories);
    console.log('✅ Categories created:', created.length);
    
    res.status(201).json({ 
      success: true,
      message: 'Categories created successfully!', 
      count: created.length,
      categories: created 
    });
  } catch (err) {
    console.error('❌ Error initializing categories:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize categories', 
      details: err.message 
    });
  }
});

// 404 handler for unknown routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

// Mongoose connection options (compatible with older Node.js versions)
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const { ensureDefaultCategories } = require('./utils/ensureCategories');

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(async () => {
    // Hide credentials in logs
    const safeUri = MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('✅ MongoDB connected:', safeUri);
    console.log('✅ Node version:', process.version);

    try {
      await ensureDefaultCategories();
      console.log('✅ Default menu categories verified');
    } catch (err) {
      console.error('⚠️ Could not verify categories:', err.message);
    }
    
    // Only start server if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`✅ API server running on port ${PORT}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('❌ Full error:', err);
    console.error('❌ Node version:', process.version);
    console.error('❌ Mongoose version:', mongoose.version);
    process.exit(1);
  });

// Export app for testing
module.exports = app;
