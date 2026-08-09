/**
 * Structured Logging Utility
 * 
 * Provides consistent logging across the application with:
 * - Different log levels (error, warn, info, debug)
 * - Colored console output for development
 * - File logging for production
 * - Request tracking with correlation IDs
 */

const fs = require('fs');
const path = require('path');

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class Logger {
  constructor(options = {}) {
    this.level = options.level || process.env.LOG_LEVEL || 'info';
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.enableFileLogging = options.enableFileLogging || process.env.NODE_ENV === 'production';
    this.logDir = options.logDir || path.join(__dirname, '../../logs');
    
    // Create logs directory if file logging is enabled
    if (this.enableFileLogging && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Check if message should be logged based on level
   */
  shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }

  /**
   * Format log message
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    
    return {
      timestamp,
      level,
      message,
      ...meta,
    };
  }

  /**
   * Get color for log level
   */
  getColor(level) {
    const colorMap = {
      error: COLORS.red,
      warn: COLORS.yellow,
      info: COLORS.green,
      debug: COLORS.cyan,
    };
    return colorMap[level] || COLORS.reset;
  }

  /**
   * Write log to console
   */
  logToConsole(level, message, meta) {
    if (!this.shouldLog(level)) return;

    const color = this.getColor(level);
    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : '';

    if (this.isDevelopment) {
      // Colored output for development
      console.log(
        `${COLORS.gray}${timestamp}${COLORS.reset} ${color}${levelStr}${COLORS.reset} ${message}${metaStr}`
      );
    } else {
      // Plain output for production
      console.log(`${timestamp} ${levelStr} ${message}${metaStr}`);
    }
  }

  /**
   * Write log to file
   */
  logToFile(level, message, meta) {
    if (!this.enableFileLogging || !this.shouldLog(level)) return;

    const logData = this.formatMessage(level, message, meta);
    const logLine = JSON.stringify(logData) + '\n';
    
    // Write to main log file
    const mainLogFile = path.join(this.logDir, 'app.log');
    fs.appendFileSync(mainLogFile, logLine);

    // Write errors to separate error log
    if (level === 'error') {
      const errorLogFile = path.join(this.logDir, 'error.log');
      fs.appendFileSync(errorLogFile, logLine);
    }
  }

  /**
   * Log message at specified level
   */
  log(level, message, meta = {}) {
    this.logToConsole(level, message, meta);
    this.logToFile(level, message, meta);
  }

  /**
   * Log error
   */
  error(message, meta = {}) {
    // Extract error object if provided
    if (meta instanceof Error) {
      meta = {
        error: meta.message,
        stack: meta.stack,
      };
    } else if (meta.error instanceof Error) {
      meta.errorMessage = meta.error.message;
      meta.stack = meta.error.stack;
      delete meta.error;
    }

    this.log('error', message, meta);
  }

  /**
   * Log warning
   */
  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  /**
   * Log info
   */
  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  /**
   * Log debug
   */
  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  /**
   * Log HTTP request
   */
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    // Add user info if available
    if (req.user) {
      meta.userId = req.user.userId;
      meta.userRole = req.user.role;
    }

    // Determine log level based on status code
    let level = 'info';
    if (res.statusCode >= 500) {
      level = 'error';
    } else if (res.statusCode >= 400) {
      level = 'warn';
    }

    this.log(level, `${req.method} ${req.originalUrl || req.url}`, meta);
  }
}

// Create and export singleton instance
const logger = new Logger();

// Export middleware for Express
logger.middleware = () => {
  return (req, res, next) => {
    const start = Date.now();

    // Store correlation ID for request tracking
    req.correlationId = require('crypto').randomBytes(16).toString('hex');

    // Log when response is finished
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      logger.logRequest(req, res, responseTime);
    });

    next();
  };
};

module.exports = logger;
