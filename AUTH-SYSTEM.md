# User Authentication System

## Overview
Complete user authentication system with registration, login, and user management for PatioTime Cafe.

---

## Features

### 1. **User Registration**
- Full name, email, password required
- Optional: phone number, address
- Password hashing with bcrypt
- Automatic login after registration
- JWT token generation

### 2. **User Login**
- Email and password authentication
- Secure password comparison
- JWT token with 7-day expiration
- Persistent login via localStorage

### 3. **User Management**
- View user profile
- Update profile information
- Secure password storage
- Role-based system (customer/admin)

### 4. **Security**
- Passwords hashed with bcryptjs
- JWT authentication
- Token-based authorization
- Secure HTTP-only approach

---

## Installation

### 1. **Install Backend Dependencies**
```bash
cd server
npm install
```

The following packages will be installed:
- `bcryptjs@^2.4.3` - Password hashing
- `jsonwebtoken@^9.0.2` - JWT tokens

### 2. **Environment Variables**
Add to `server/.env`:
```
JWT_SECRET=your-secret-key-change-in-production-use-long-random-string
```

### 3. **Start the Server**
```bash
npm run dev
```

---

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",  // optional
  "address": "123 Main St"  // optional
}

Response: {
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer jwt-token-here"
}

Response: {
  "_id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  ...
}
```

#### Update Profile
```
PUT /api/auth/me
Headers: {
  "Authorization": "Bearer jwt-token-here"
}
Body: {
  "name": "John Updated",
  "phone": "+1987654321",
  "address": "456 Oak Ave"
}

Response: {
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  phone: String (optional),
  address: String (optional),
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  createdAt: Date (default: now)
}
```

### Indexes
- `email` - Unique index for fast lookups

---

## Frontend Pages

### 1. Register Page (`/register`)
**Features:**
- Full name input
- Email input
- Phone (optional)
- Address (optional)
- Password input
- Confirm password
- Password match validation
- Error handling
- Auto-redirect after success

**Screenshot Location:** Hero with "REGISTER" title

### 2. Login Page (`/login`)
**Features:**
- Email input
- Password input
- Error handling
- Remember me (via localStorage)
- Link to register page
- Auto-redirect after success

**Screenshot Location:** Hero with "LOGIN" title

### 3. Navigation Updates
**When Logged Out:**
- Shows: Cart icon, Login button, Reservation button

**When Logged In:**
- Shows: Cart icon, "Hi, [Name]", Logout button
- Mobile: User info + Logout in hamburger menu

---

## User Flow

### Registration Flow
1. User clicks "Register" or navigates to `/register`
2. Fills out form (name, email, password, etc.)
3. Submits form
4. Frontend sends POST to `/api/auth/register`
5. Backend:
   - Validates data
   - Checks if email exists
   - Hashes password
   - Saves user to database
   - Generates JWT token
6. Frontend:
   - Receives token and user data
   - Saves to localStorage
   - Redirects to home page
   - Updates navigation (shows user name)

### Login Flow
1. User clicks "Login" or navigates to `/login`
2. Enters email and password
3. Submits form
4. Frontend sends POST to `/api/auth/login`
5. Backend:
   - Finds user by email
   - Compares password hash
   - Generates JWT token if valid
6. Frontend:
   - Receives token and user data
   - Saves to localStorage
   - Redirects to home page
   - Updates navigation

### Logout Flow
1. User clicks "Logout"
2. Frontend:
   - Removes token from localStorage
   - Removes user data from localStorage
   - Refreshes page
3. Navigation updates to show Login button

---

## Security Features

### 1. **Password Hashing**
- Uses bcryptjs with salt rounds: 10
- Passwords never stored in plain text
- Hashing happens automatically before saving

### 2. **JWT Tokens**
- Signed with secret key
- 7-day expiration
- Contains: userId, email, role
- Verified on protected routes

### 3. **Input Validation**
- Email format validation
- Password minimum length (6 chars)
- Required field checks
- Duplicate email prevention

### 4. **Error Handling**
- Generic error messages (security)
- No password in JSON responses
- Token expiration handling
- Invalid credentials protection

---

## localStorage Structure

### Stored Data
```javascript
// Token
localStorage.setItem('token', 'jwt-token-here');

// User
localStorage.setItem('user', JSON.stringify({
  _id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer'
}));
```

### Clearing Data
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
// Or
localStorage.clear();
```

---

## Protected Routes (Future)

To protect routes that require authentication:

```javascript
// Middleware example
function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Usage
router.get('/profile', requireAuth, (req, res) => {
  // req.user contains decoded token data
});
```

---

## Admin Panel Integration

### Future: View All Users
Add to Admin panel:
- Users tab in sidebar
- List all registered users
- View user details
- Promote to admin
- Delete users
- Search and filter

### Backend Route (to be added)
```javascript
// GET /api/admin/users
// Requires admin role
```

---

## Testing

### 1. **Register a User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. **Get Profile**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### "Email already registered"
- User with that email exists
- Try logging in instead
- Or use different email

### "Invalid email or password"
- Check email spelling
- Check password
- Passwords are case-sensitive

### "Access token required"
- Token missing from request
- User not logged in
- Token expired (7 days)

### "Module not found: bcryptjs"
```bash
cd server
npm install bcryptjs jsonwebtoken
```

---

## Next Steps

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Add JWT_SECRET to .env**

3. **Restart server**:
   ```bash
   npm run dev
   ```

4. **Test registration** at `/register`

5. **Test login** at `/login`

6. **Verify navigation** shows user name when logged in

---

**Implementation Date**: January 2025  
**Auth Method**: JWT  
**Password Hashing**: bcryptjs  
**Token Expiration**: 7 days  
**Role System**: customer/admin
