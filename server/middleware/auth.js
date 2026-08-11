const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT_SECRET must be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      // Attach user info to request
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Check if user has admin role
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required. You do not have permission to access this resource.' });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

// Middleware for optional authentication (allows both authenticated and guest users)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔍 [optionalAuth] Token received:', token ? 'YES' : 'NO');

    if (!token) {
      // No token provided - continue as guest
      console.log('🔍 [optionalAuth] No token, continuing as guest');
      req.user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // Invalid token - continue as guest
        console.log('🔍 [optionalAuth] Token verification failed:', err.message);
        req.user = null;
        return next();
      }

      // Valid token - attach user info
      console.log('🔍 [optionalAuth] Token verified successfully, user:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      });
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('❌ [optionalAuth] Unexpected error:', err);
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
