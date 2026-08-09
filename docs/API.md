# PatioTime Cafe - API Documentation

**Base URL (Development):** `http://localhost:5000/api`  
**Base URL (Production):** `https://patiotime-cafe-production.up.railway.app/api`

**Version:** 1.0.0  
**Last Updated:** February 9, 2026

---

## Table of Contents

- [Authentication](#authentication)
- [Menu](#menu)
- [Orders](#orders)
- [Reservations](#reservations)
- [Contact](#contact)
- [Admin](#admin)
- [Error Responses](#error-responses)

---

## Authentication

All authenticated requests require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "555-123-4567",
  "address": "123 Main St, City, State 12345"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2026-02-09T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email format, required, unique
- `password`: Minimum 6 characters, required
- `phone`: Optional, phone number format
- `address`: Optional, max 500 characters

---

### POST `/auth/login`

Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid email or password."
}
```

---

### GET `/auth/me`

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "phone": "555-123-4567",
  "address": "123 Main St, City, State 12345",
  "createdAt": "2026-02-09T10:00:00.000Z"
}
```

---

## Menu

### GET `/menu`

Get all menu items grouped by category.

**Query Parameters:**
- `category` (optional): Filter by category slug (`coffees-teas`, `bakery-lunch`, `all-day-brunch`)

**Response (200):**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "name": "Espresso",
    "description": "Strong Italian coffee",
    "price": 3.99,
    "category": {
      "_id": "507f191e810c19729de860eb",
      "name": "Coffees & Teas",
      "slug": "coffees-teas",
      "eyebrow": "Best Drinks"
    },
    "image": "espresso.jpg",
    "badge": "popular",
    "isAvailable": true,
    "sortOrder": 1
  }
]
```

---

### GET `/menu/:id`

Get single menu item by ID.

**Response (200):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Espresso",
  "description": "Strong Italian coffee",
  "price": 3.99,
  "category": {
    "_id": "507f191e810c19729de860eb",
    "name": "Coffees & Teas",
    "slug": "coffees-teas"
  },
  "image": "espresso.jpg",
  "isAvailable": true
}
```

**Error (404):**
```json
{
  "error": "Menu item not found."
}
```

---

## Orders

### POST `/orders`

Create a new order (guest or authenticated).

**Headers (optional):**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_phone": "555-123-4567",
  "customer_email": "john@example.com",
  "order_type": "delivery",
  "address": "123 Main St, City, State 12345",
  "items": [
    {
      "menu_item_id": "507f191e810c19729de860ea",
      "quantity": 2
    },
    {
      "menu_item_id": "507f191e810c19729de860eb",
      "quantity": 1
    }
  ],
  "notes": "Extra hot, no sugar"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "order_code": "PT-ABC123",
  "customer_name": "John Doe",
  "customer_phone": "***-***-4567",
  "customer_email": "john@example.com",
  "order_type": "delivery",
  "address": "City, State",
  "status": "received",
  "items": [
    {
      "menu_item_id": "507f191e810c19729de860ea",
      "name": "Espresso",
      "price": 3.99,
      "quantity": 2
    }
  ],
  "total": 7.98,
  "created_at": "2026-02-09T10:30:00.000Z"
}
```

**Validation Rules:**
- `customer_name`: 2-100 characters, required
- `customer_phone`: Phone format, required
- `customer_email`: Valid email, optional
- `order_type`: Must be `pickup` or `delivery`, required
- `address`: Required if `order_type` is `delivery`
- `items`: Array with minimum 1 item, required
- `items[].menu_item_id`: Valid MongoDB ObjectID, required
- `items[].quantity`: Integer between 1-100, required

---

### GET `/orders/track/:code`

Track order by order code (public endpoint).

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "order_code": "PT-ABC123",
  "customer_name": "John Doe",
  "customer_phone": "***-***-4567",
  "order_type": "delivery",
  "address": "City, State",
  "status": "preparing",
  "items": [
    {
      "name": "Espresso",
      "price": 3.99,
      "quantity": 2
    }
  ],
  "total": 7.98,
  "created_at": "2026-02-09T10:30:00.000Z"
}
```

**Note:** Sensitive data (full phone, full address) is masked for privacy.

---

### GET `/orders/history`

Get order history for authenticated user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "order_code": "PT-ABC123",
    "status": "completed",
    "order_type": "delivery",
    "total": 7.98,
    "items": [
      {
        "name": "Espresso",
        "quantity": 2
      }
    ],
    "created_at": "2026-02-09T10:30:00.000Z"
  }
]
```

---

## Reservations

### POST `/reservations`

Create a new reservation.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "date": "2026-02-15",
  "time": "19:00",
  "guests": 4,
  "message": "Window seat if possible"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "date": "2026-02-15T00:00:00.000Z",
  "time": "19:00",
  "guests": 4,
  "message": "Window seat if possible",
  "status": "pending",
  "createdAt": "2026-02-09T11:00:00.000Z"
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email, required
- `phone`: Phone format, required
- `date`: ISO 8601 date, required
- `time`: HH:MM format, required
- `guests`: Integer between 1-50, required
- `message`: Max 1000 characters, optional

---

## Contact

### POST `/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about menu",
  "message": "Do you have vegan options?"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about menu",
  "message": "Do you have vegan options?",
  "status": "new",
  "createdAt": "2026-02-09T11:15:00.000Z"
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email, required
- `subject`: 2-200 characters, required
- `message`: 10-2000 characters, required

---

## Admin

**All admin endpoints require authentication and admin role.**

**Headers:**
```
Authorization: Bearer <token>
```

### Orders Management

#### GET `/admin/orders`

Get all orders (admin view with full details).

**Query Parameters:**
- `status` (optional): Filter by status

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "order_code": "PT-ABC123",
    "customer_name": "John Doe",
    "customer_phone": "555-123-4567",
    "customer_email": "john@example.com",
    "order_type": "delivery",
    "address": "123 Main St, City, State 12345",
    "status": "received",
    "items": [...],
    "total": 7.98,
    "created_at": "2026-02-09T10:30:00.000Z"
  }
]
```

---

#### GET `/admin/orders/:id`

Get single order with full details.

---

#### PATCH `/admin/orders/:id/status`

Update order status.

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `received`
- `preparing`
- `ready`
- `completed`
- `cancelled`

---

### Menu Management

#### GET `/admin/menu`

Get all menu items.

---

#### POST `/admin/menu`

Create new menu item.

**Request Body:**
```json
{
  "name": "Latte",
  "description": "Espresso with steamed milk",
  "price": 4.99,
  "category": "coffees-teas",
  "image": "latte.jpg",
  "badge": "new",
  "sortOrder": 5
}
```

---

#### PUT `/admin/menu/:id`

Update menu item.

---

#### DELETE `/admin/menu/:id`

Delete menu item.

---

### Image Upload

#### POST `/admin/upload`

Upload menu item image.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: Image file (JPEG, PNG, GIF, WebP, max 5MB)

**Response (200):**
```json
{
  "filename": "1234567890-latte.jpg",
  "path": "/images/1234567890-latte.jpg",
  "message": "Image uploaded successfully"
}
```

---

### Categories

#### GET `/admin/categories`

Get all categories.

---

#### POST `/admin/categories/init`

Initialize default categories (one-time setup).

---

### Reservations Management

#### GET `/admin/reservations`

Get all reservations.

---

#### PATCH `/admin/reservations/:id/status`

Update reservation status.

**Valid Status Values:**
- `pending`
- `confirmed`
- `cancelled`
- `completed`

---

#### DELETE `/admin/reservations/:id`

Delete reservation.

---

### Contact Messages

#### GET `/admin/contacts`

Get all contact messages.

---

#### PATCH `/admin/contacts/:id/status`

Update contact message status.

**Valid Status Values:**
- `new`
- `read`
- `replied`

---

#### DELETE `/admin/contacts/:id`

Delete contact message.

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message description"
}
```

### Validation Error Format

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

## Rate Limiting

### General API Endpoints
- **Limit**: 100 requests per 15 minutes per IP
- **Header**: `X-RateLimit-Remaining`

### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes per IP
- **Applies to**: `/auth/login`, `/auth/register`

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Authentication Flow

1. **Register/Login**: POST to `/auth/register` or `/auth/login`
2. **Store Token**: Save the `token` from response
3. **Use Token**: Include in `Authorization: Bearer <token>` header for protected endpoints
4. **Token Expiry**: Tokens expire after 7 days (configurable)
5. **Refresh**: Login again to get new token

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123"}'
```

### Get Menu
```bash
curl http://localhost:5000/api/menu
```

### Create Order (with authentication)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"customer_name":"John","customer_phone":"555-1234","order_type":"pickup","items":[{"menu_item_id":"507f191e810c19729de860ea","quantity":1}]}'
```

---

## Postman Collection

Import the provided Postman collection for easy API testing:
- File: `postman/PatioTime-API.postman_collection.json`
- Environment: `postman/PatioTime-ENV.postman_environment.json`

---

## Additional Resources

- **GitHub Repository**: https://github.com/yourusername/patiotime-cafe
- **Live Demo**: https://patiotime-cafe.vercel.app
- **Support**: support@patiotime.com

---

*Last Updated: February 9, 2026*
*API Version: 1.0.0*
