# Authentication System Fixes

## Issue Resolved
**Problem**: Server was returning 500 error with "next is not a function" when trying to register users.

**Root Cause**: The User model had a pre-save hook that was trying to hash the password, but the password was already being hashed manually in the auth route. The pre-save hook was calling `next()` which caused a conflict.

## Fix Applied

### 1. Removed Pre-Save Hook from User Model
The pre-save hook in `server/models/User.js` has been completely removed since password hashing is done manually in the auth routes.

**Before:**
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
```

**After:**
```javascript
// Pre-save hook removed - password hashing done in route
```

### 2. Dependencies Installed
Ensured all required dependencies are installed:
```bash
cd server
npm install
```

Dependencies confirmed:
- ✅ bcryptjs
- ✅ jsonwebtoken
- ✅ All other packages

## How It Works Now

### Registration Flow
1. User submits registration form
2. Backend validates required fields (name, email, password)
3. Checks if email already exists
4. **Manually hashes password** using bcryptjs
5. Creates new user with hashed password
6. Generates JWT token (7-day expiration)
7. Returns token and user data (password removed)
8. Frontend saves token and user to localStorage
9. Redirects to home page

### Login Flow
1. User submits login form
2. Backend validates email and password
3. Finds user by email
4. **Manually compares password** with bcrypt.compare()
5. Generates JWT token
6. Returns token and user data
7. Frontend saves to localStorage
8. Redirects to home page

## Features Implemented

### Navbar Changes
- **Login Icon**: Shows when user is NOT logged in (arrow entering door)
- **Logout Icon**: Shows when user IS logged in (arrow leaving door)
- Position: Icons appear to the RIGHT of the "Reservation" button
- Mobile: Shows "Login"/"Logout" text in mobile menu
- User info displayed in mobile menu when logged in

### Auth Pages
- **Login Page** (`/login`): Email + Password fields
- **Register Page** (`/register`): Name, Email, Phone, Address, Password, Confirm Password
- Both pages have their own hero sections (no navbar)
- Form validation and error handling
- Loading states during submission

### Security Features
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- Passwords never sent in responses
- Email converted to lowercase for consistency
- Password minimum length: 6 characters

## Testing Instructions

### 1. Start the Server
```bash
cd server
npm run dev
```

Server should start on http://localhost:5000

### 2. Test Registration
1. Navigate to http://localhost:3000/register
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: testpass123
   - Confirm Password: testpass123
   - Phone: (optional)
   - Address: (optional)
3. Click "Create Account"
4. Should redirect to home page
5. Check navbar - should show logout icon (→|)

### 3. Test Login
1. Click logout icon to log out
2. Navigate to http://localhost:3000/login
3. Enter credentials:
   - Email: test@example.com
   - Password: testpass123
4. Click "Sign In"
5. Should redirect to home page
6. Check navbar - should show logout icon

### 4. Test Logout
1. Click logout icon in navbar
2. Page should reload
3. Login icon should appear (|←)

### 5. Check Database
```bash
# Open MongoDB shell
mongosh patiotime

# View users
db.users.find().pretty()
```

Should see user with:
- Hashed password (NOT plain text)
- Email in lowercase
- Role: "customer"
- Timestamps

## API Endpoints

### POST /api/auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt.token.here",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2025-01-31T..."
  }
}
```

### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### GET /api/auth/me
**Headers:** `Authorization: Bearer {token}`

**Response:** User object without password

### PUT /api/auth/me
**Headers:** `Authorization: Bearer {token}`
```json
{
  "name": "New Name",
  "phone": "+1987654321",
  "address": "456 Oak Ave"
}
```

## Next Steps (Optional Enhancements)

### 1. Add Users Tab to Admin Panel
Show all registered users in admin dashboard

### 2. Password Reset
Add "Forgot Password" functionality with email verification

### 3. Email Verification
Require users to verify email before full access

### 4. Protected Routes
Restrict certain pages to logged-in users only

### 5. User Profile Page
Let users view and edit their profile information

### 6. Order History
Show user's past orders (integrate with orders system)

## Troubleshooting

### "500 Internal Server Error"
- Check server console for error details
- Ensure MongoDB is running
- Verify dependencies are installed: `npm list bcryptjs jsonwebtoken`

### "Email already registered"
- Email is already in database
- Try different email or use login

### "Invalid email or password"
- Check credentials are correct
- Email is case-insensitive

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Refresh page and try again

### Server Won't Start
- Check if port 5000 is available
- Verify MongoDB connection in .env
- Check for syntax errors in auth.js

## Files Modified

### Backend
- ✅ `server/models/User.js` - Removed pre-save hook
- ✅ `server/routes/auth.js` - Manual password hashing
- ✅ `server/server.js` - Auth routes included
- ✅ `server/package.json` - Dependencies added

### Frontend
- ✅ `client/src/pages/Login.jsx` - Login page
- ✅ `client/src/pages/Register.jsx` - Register page
- ✅ `client/src/components/Navbar.jsx` - Auth icons
- ✅ `client/src/App.jsx` - Auth routes
- ✅ `client/src/api.js` - Auth API functions
- ✅ `client/src/index.css` - Auth styling

## Status
✅ **READY FOR TESTING** - All fixes applied, dependencies installed, code updated.
