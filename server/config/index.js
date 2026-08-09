/**
 * Centralized Configuration with Validation
 * 
 * This file:
 * 1. Loads all environment variables
 * 2. Validates required variables
 * 3. Provides default values where appropriate
 * 4. Exports a clean config object
 */

require('dotenv').config();

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Validate that required environment variables are set
 * @param {string[]} requiredVars - Array of required variable names
 * @throws {ConfigError} If any required variable is missing
 */
function validateRequired(requiredVars) {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new ConfigError(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See .env.example for reference.`
    );
  }
}

/**
 * Validate JWT_SECRET strength
 * @param {string} secret - JWT secret to validate
 * @throws {ConfigError} If secret is too weak
 */
function validateJWTSecret(secret) {
  if (!secret || secret.length < 32) {
    throw new ConfigError(
      `JWT_SECRET must be at least 32 characters long for security.\n` +
      `Current length: ${secret ? secret.length : 0}\n` +
      `Generate a strong secret with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
    );
  }
}

// Validate required environment variables
const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET'];
validateRequired(REQUIRED_VARS);

// Validate JWT_SECRET strength
validateJWTSecret(process.env.JWT_SECRET);

// Build and export configuration object
const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || 'development',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGO_URI,
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // CORS Configuration
  cors: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [],
  },

  // Rate Limiting Configuration
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true' || process.env.NODE_ENV === 'production',
    general: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 5, // 5 requests per window
    },
  },

  // File Upload Configuration
  upload: {
    maxFileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024, // Convert MB to bytes
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES 
      ? process.env.ALLOWED_IMAGE_TYPES.split(',').map(type => type.trim())
      : ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    uploadDir: process.env.UPLOAD_DIR || '../client/public/images',
  },

  // Email Configuration (Optional)
  email: {
    enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: {
      name: process.env.EMAIL_FROM_NAME || 'PatioTime Cafe',
      address: process.env.EMAIL_FROM_ADDRESS || 'noreply@patiotime.com',
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    requestLogging: process.env.REQUEST_LOGGING !== 'false', // Default to true
  },

  // External Services (Optional)
  services: {
    cloudinary: {
      enabled: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    sentry: {
      enabled: !!process.env.SENTRY_DSN,
      dsn: process.env.SENTRY_DSN,
    },
    redis: {
      enabled: !!process.env.REDIS_URL,
      url: process.env.REDIS_URL,
    },
  },
};

/**
 * Log configuration on startup (hide sensitive values)
 */
function logConfig() {
  if (config.server.isTest) return; // Don't log in test environment

  console.log('\n📋 Configuration Loaded:');
  console.log('  Environment:', config.server.env);
  console.log('  Port:', config.server.port);
  console.log('  MongoDB:', config.database.uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  console.log('  JWT Secret:', config.auth.jwtSecret ? '***' + config.auth.jwtSecret.slice(-4) : 'NOT SET');
  console.log('  JWT Expires:', config.auth.jwtExpiresIn);
  console.log('  Client URL:', config.cors.clientUrl);
  console.log('  Rate Limiting:', config.rateLimit.enabled ? 'Enabled' : 'Disabled');
  console.log('  Email:', config.email.enabled ? 'Enabled' : 'Disabled');
  console.log('  Cloudinary:', config.services.cloudinary.enabled ? 'Enabled' : 'Disabled');
  console.log('  Sentry:', config.services.sentry.enabled ? 'Enabled' : 'Disabled');
  console.log('  Redis:', config.services.redis.enabled ? 'Enabled' : 'Disabled');
  console.log('');
}

// Log configuration on module load
if (!config.server.isTest) {
  logConfig();
}

module.exports = config;
