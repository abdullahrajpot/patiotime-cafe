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
