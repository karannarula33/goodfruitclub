import Razorpay from 'razorpay';
import { getOrderByToken, setRazorpayOrderId } from '../../lib/db.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Creates a Razorpay order for an existing GFC order and returns the params the
// browser needs to open Razorpay Checkout. The amount always comes from the DB
// (server-computed), never from the client.
export async function POST(request) {
  if (!KEY_ID || !KEY_SECRET) {
    return Response.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = String(data.token || '').trim();
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

  let order;
  try {
    order = await getOrderByToken(token);
  } catch (err) {
    console.error('Order lookup failed:', err);
    return Response.json({ error: 'Lookup failed' }, { status: 500 });
  }
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });
  if (order.payment_status === 'paid') {
    return Response.json({ error: 'Order is already paid' }, { status: 409 });
  }

  const razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

  let rzpOrder;
  try {
    rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt: order.order_no,
      notes: { gfc_token: token, gfc_order_no: order.order_no },
    });
  } catch (err) {
    console.error('Razorpay order create failed:', err?.error || err);
    return Response.json({ error: 'Could not start payment' }, { status: 502 });
  }

  await setRazorpayOrderId(token, rzpOrder.id);

  return Response.json({
    keyId: KEY_ID,
    rzpOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    orderNo: order.order_no,
    name: order.customer_name,
    email: order.email || '',
    phone: order.phone,
  });
}
