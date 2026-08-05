const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'patiotime-secret-key-change-this-in-production';

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

module.exports = {
  authenticateToken,
  requireAdmin
};
