const mongoose = require('mongoose');

// Check if bcryptjs is available
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  console.error('❌ bcryptjs not installed. Run: npm install bcryptjs');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  address: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ========================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ========================================

// Unique index on email (already enforced by unique: true in schema)
userSchema.index({ email: 1 }, { unique: true }); // Login lookup

// Single field indexes
userSchema.index({ role: 1 }); // Filter by role (admin vs customer)
userSchema.index({ createdAt: -1 }); // Sort users by registration date

// Compound indexes for common queries
userSchema.index({ role: 1, createdAt: -1 }); // Filter + sort users

module.exports = mongoose.model('User', userSchema);
