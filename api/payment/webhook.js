import { createHmac, timingSafeEqual } from 'node:crypto';
import { markPaidByRazorpayOrderId } from '../../lib/db.js';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

function signaturesMatch(expectedHex, providedHex) {
  try {
    const a = Buffer.from(expectedHex, 'hex');
    const b = Buffer.from(providedHex, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Server-to-server backup confirmation. Razorpay calls this directly, so an
// order still gets marked paid even if the customer's browser never completes
// the client-side /api/payment/verify round trip (closed tab, dropped network
// right after paying). The signature is HMAC-SHA256 of the raw request body,
// keyed by a secret shared only with Razorpay's webhook config — never the
// per-payment Checkout secret used in verify.js.
export async function POST(request) {
  if (!WEBHOOK_SECRET) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  // Must read the raw text before any parsing — the signature is computed
  // over the exact bytes Razorpay sent, not a re-serialized object.
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';

  const expected = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  if (!signaturesMatch(expected, signature)) {
    console.warn('Razorpay webhook signature mismatch');
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.event !== 'payment.captured') {
    // Acknowledge anything we don't act on so Razorpay doesn't retry it.
    return Response.json({ ok: true });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  const razorpayPaymentId = payment?.id;
  if (!razorpayOrderId || !razorpayPaymentId) {
    return Response.json({ ok: true });
  }

  try {
    const updated = await markPaidByRazorpayOrderId(razorpayOrderId, razorpayPaymentId);
    if (!updated) {
      console.warn(`Webhook: no order matches razorpay_order_id=${razorpayOrderId}`);
    }
  } catch (err) {
    console.error('Webhook markPaidByRazorpayOrderId failed:', err);
    // Non-2xx so Razorpay retries — this is a transient failure worth retrying.
    return Response.json({ error: 'Could not record payment' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
