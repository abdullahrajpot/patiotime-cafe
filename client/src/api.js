const BASE = '/api';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export function getMenu() {
  return fetch(`${BASE}/menu`).then(handle);
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

export function getAdminOrders(status) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE}/admin/orders${qs}`).then(handle);
}

export function updateOrderStatus(id, status) {
  return fetch(`${BASE}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handle);
}

// Admin Menu Management APIs
export function getAdminMenu() {
  return fetch(`${BASE}/admin/menu`).then(handle);
}

export function createMenuItem(payload) {
  return fetch(`${BASE}/admin/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function updateMenuItem(id, payload) {
  return fetch(`${BASE}/admin/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
