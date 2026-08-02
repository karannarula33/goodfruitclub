import { listRecentOrders, updateFulfilment, FULFILMENT_STATUSES } from '../lib/db.js';

// Owner-only endpoints, gated by a shared secret sent in the x-admin-secret
// header. Simple and sufficient for a single-operator family business.
function authorized(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}

function publicView(order) {
  return {
    orderNo: order.order_no,
    token: order.public_token,
    items: order.items,
    total: order.total,
    name: order.customer_name,
    phone: order.phone,
    address: order.address,
    paymentMode: order.payment_mode,
    paymentStatus: order.payment_status,
    fulfilmentStatus: order.fulfilment_status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await listRecentOrders(100);
    return Response.json({ statuses: FULFILMENT_STATUSES, orders: orders.map(publicView) });
  } catch (err) {
    console.error('Failed to list orders:', err);
    return Response.json({ error: 'List failed' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = String(data.token || '').trim();
  const status = String(data.status || '').trim();
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });
  if (!FULFILMENT_STATUSES.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const updated = await updateFulfilment(token, status);
    if (!updated) return Response.json({ error: 'Order not found' }, { status: 404 });
    return Response.json(publicView(updated));
  } catch (err) {
    console.error('Failed to update order:', err);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}
