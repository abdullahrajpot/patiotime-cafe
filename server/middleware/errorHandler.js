/**
 * Global Error Handler Middleware
 * Provides consistent error responses across the API
 */

const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === 'CastError') {
    // Mongoose invalid ObjectId
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response
  const response = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  };

  if (details) {
    response.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && !(err instanceof AppError)) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Handle 404 errors (route not found)
const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
