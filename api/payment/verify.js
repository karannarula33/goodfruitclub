import { createHmac, timingSafeEqual } from 'node:crypto';
import { getOrderByToken, markOrderPaid } from '../../lib/db.js';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function signaturesMatch(expectedHex, providedHex) {
  const a = Buffer.from(expectedHex, 'hex');
  const b = Buffer.from(providedHex, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

// Verifies the Razorpay Checkout callback signature and, only if valid, flips
// the order to paid. The signature is HMAC-SHA256(order_id|payment_id) keyed by
// the Razorpay secret — proof the callback genuinely came from Razorpay.
export async function POST(request) {
  if (!KEY_SECRET) {
    return Response.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = String(data.token || '').trim();
  const rzpOrderId = String(data.razorpay_order_id || '').trim();
  const rzpPaymentId = String(data.razorpay_payment_id || '').trim();
  const rzpSignature = String(data.razorpay_signature || '').trim();

  if (!token || !rzpOrderId || !rzpPaymentId || !rzpSignature) {
    return Response.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  const expected = createHmac('sha256', KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest('hex');

  if (!signaturesMatch(expected, rzpSignature)) {
    console.warn(`Payment signature mismatch for token=${token} rzpOrder=${rzpOrderId}`);
    return Response.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // markOrderPaid only updates when the stored razorpay_order_id matches, so a
  // valid signature still can't mark the wrong order paid.
  try {
    const updated = await markOrderPaid(token, {
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
    });

    if (!updated) {
      const existing = await getOrderByToken(token);
      if (existing && existing.payment_status === 'paid') {
        return Response.json({ ok: true, paymentStatus: 'paid' });
      }
      return Response.json({ error: 'Order/payment mismatch' }, { status: 409 });
    }
  } catch (err) {
    console.error('markOrderPaid failed:', err);
    return Response.json({ error: 'Could not record payment' }, { status: 500 });
  }

  return Response.json({ ok: true, paymentStatus: 'paid' });
}
