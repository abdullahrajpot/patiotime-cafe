const BASE = import.meta.env.VITE_API_URL || '/api';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export function getMenu() {
  return fetch(`${BASE}/menu`).then(handle);
}

export function getMenuByCategory(category) {
  return fetch(`${BASE}/menu?category=${encodeURIComponent(category)}`).then(handle);
}

export function createOrder(payload) {
  return fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function trackOrder(code) {
  return fetch(`${BASE}/orders/track/${encodeURIComponent(code)}`).then(handle);
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

export function getAdminOrders(status) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE}/admin/orders${qs}`, {
    headers: getAuthHeaders()
  }).then(handle);
}

export function updateOrderStatus(id, status) {
  return fetch(`${BASE}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  }).then(handle);
}

// Admin Menu Management APIs
export function getAdminMenu() {
  return fetch(`${BASE}/admin/menu`, {
    headers: getAuthHeaders()
  }).then(handle);
}

export function createMenuItem(payload) {
  return fetch(`${BASE}/admin/menu`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handle);
}

export function updateMenuItem(id, payload) {
  return fetch(`${BASE}/admin/menu/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handle);
}

export function deleteMenuItem(id) {
  return fetch(`${BASE}/admin/menu/${id}`, {
    method: 'DELETE',
  }).then(handle);
}

export function getCategories() {
  return fetch(`${BASE}/admin/categories`).then(handle);
}

// Reservation APIs
export function createReservation(payload) {
  return fetch(`${BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getAdminReservations(status) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE}/admin/reservations${qs}`).then(handle);
}

export function updateReservationStatus(id, status) {
  return fetch(`${BASE}/admin/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handle);
}

export function deleteReservation(id) {
  return fetch(`${BASE}/admin/reservations/${id}`, {
    method: 'DELETE',
  }).then(handle);
}

// Contact APIs
export function submitContact(payload) {
  return fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getAdminContacts(status) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE}/admin/contacts${qs}`).then(handle);
}

export function updateContactStatus(id, status) {
  return fetch(`${BASE}/admin/contacts/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handle);
}

export function deleteContact(id) {
  return fetch(`${BASE}/admin/contacts/${id}`, {
    method: 'DELETE',
  }).then(handle);
}

// Auth APIs
export function register(payload) {
  return fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function login(payload) {
  return fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject(new Error('Not authenticated'));
  
  return fetch(`${BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handle);
}

export function updateProfile(payload) {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject(new Error('Not authenticated'));
  
  return fetch(`${BASE}/auth/me`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getUserOrderHistory(userId) {
  return fetch(`${BASE}/orders/history/${userId}`).then(handle);
}
