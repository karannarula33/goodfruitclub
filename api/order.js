import { getOrderByToken } from '../lib/db.js';

// Public order lookup by unguessable token. Anyone with the link can view the
// order (that's the point of a shareable tracking link), so we only ever return
// a single order matched by its exact token.
export async function GET(request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return Response.json({ error: 'Missing token' }, { status: 400 });
  }

  let order;
  try {
    order = await getOrderByToken(token);
  } catch (err) {
    console.error('Failed to fetch order:', err);
    return Response.json({ error: 'Lookup failed' }, { status: 500 });
  }

  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  return Response.json({
    orderNo: order.order_no,
    token: order.public_token,
    items: order.items,
    total: order.total,
    name: order.customer_name,
    phone: order.phone,
    address: order.address,
    lat: order.lat,
    lng: order.lng,
    paymentMode: order.payment_mode,
    paymentStatus: order.payment_status,
    fulfilmentStatus: order.fulfilment_status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  });
}
