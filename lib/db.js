// Thin data layer over Neon Postgres (works with any Postgres DATABASE_URL).
// The @neondatabase/serverless driver speaks HTTP, so it's a good fit for
// short-lived Vercel Functions — no connection pool to manage.
import { neon } from '@neondatabase/serverless';

export const FULFILMENT_STATUSES = [
  'received',
  'sourcing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

let _sql;
function sql() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Create the schema on first use. Guarded by a module-level promise so it runs
// at most once per warm instance. Idempotent, so safe to call on every request.
let schemaReady;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`
        CREATE TABLE IF NOT EXISTS orders (
          id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          order_no          text UNIQUE NOT NULL,
          public_token      text UNIQUE NOT NULL,
          items             jsonb NOT NULL,
          subtotal          integer NOT NULL,
          total             integer NOT NULL,
          customer_name     text NOT NULL,
          phone             text NOT NULL,
          address           text NOT NULL,
          email             text,
          payment_mode      text NOT NULL DEFAULT 'COD',
          payment_status    text NOT NULL DEFAULT 'unpaid',
          fulfilment_status text NOT NULL DEFAULT 'received',
          created_at        timestamptz NOT NULL DEFAULT now(),
          updated_at        timestamptz NOT NULL DEFAULT now()
        )`;
      // Human-friendly, sequential order numbers: GFC-1001, GFC-1002, ...
      await q`CREATE SEQUENCE IF NOT EXISTS order_no_seq START 1001`;
      // Payment fields (added in Phase 2 — Razorpay). Idempotent so existing
      // deployments migrate on first request.
      await q`ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id text`;
      await q`ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id text`;
      await q`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz`;
      // Delivery pin dropped on the map at checkout (Phase 3). Nullable —
      // older orders and the WhatsApp-only fallback path never set these.
      await q`ALTER TABLE orders ADD COLUMN IF NOT EXISTS lat double precision`;
      await q`ALTER TABLE orders ADD COLUMN IF NOT EXISTS lng double precision`;
    })().catch((err) => {
      // Reset so a transient failure can be retried on the next request.
      schemaReady = undefined;
      throw err;
    });
  }
  return schemaReady;
}

export async function createOrder({
  items, subtotal, total, name, phone, address, email, paymentMode, lat, lng,
}) {
  await ensureSchema();
  const q = sql();
  const token = crypto.randomUUID();
  const rows = await q`
    INSERT INTO orders
      (order_no, public_token, items, subtotal, total,
       customer_name, phone, address, email, payment_mode, lat, lng)
    VALUES
      ('GFC-' || nextval('order_no_seq'), ${token},
       ${JSON.stringify(items)}::jsonb, ${subtotal}, ${total},
       ${name}, ${phone}, ${address}, ${email || null}, ${paymentMode},
       ${lat != null ? lat : null}, ${lng != null ? lng : null})
    RETURNING *`;
  return rows[0];
}

export async function getOrderByToken(token) {
  await ensureSchema();
  const q = sql();
  const rows = await q`SELECT * FROM orders WHERE public_token = ${token} LIMIT 1`;
  return rows[0] || null;
}

export async function updateFulfilment(token, status) {
  if (!FULFILMENT_STATUSES.includes(status)) {
    throw new Error(`Invalid fulfilment status: ${status}`);
  }
  await ensureSchema();
  const q = sql();
  const rows = await q`
    UPDATE orders
       SET fulfilment_status = ${status}, updated_at = now()
     WHERE public_token = ${token}
    RETURNING *`;
  return rows[0] || null;
}

// Attach a freshly-created Razorpay order id to a GFC order before checkout.
export async function setRazorpayOrderId(token, razorpayOrderId) {
  await ensureSchema();
  const q = sql();
  const rows = await q`
    UPDATE orders
       SET razorpay_order_id = ${razorpayOrderId}, updated_at = now()
     WHERE public_token = ${token}
    RETURNING *`;
  return rows[0] || null;
}

// Mark an order paid after the Razorpay signature is verified. Idempotent and
// safe against replays: only flips an unpaid order whose stored razorpay_order_id
// matches, so a captured payment can't be re-applied to a different order.
export async function markOrderPaid(token, { razorpayOrderId, razorpayPaymentId }) {
  await ensureSchema();
  const q = sql();
  const rows = await q`
    UPDATE orders
       SET payment_status = 'paid',
           razorpay_payment_id = ${razorpayPaymentId},
           paid_at = COALESCE(paid_at, now()),
           updated_at = now()
     WHERE public_token = ${token}
       AND razorpay_order_id = ${razorpayOrderId}
    RETURNING *`;
  return rows[0] || null;
}

// Backup confirmation path for the Razorpay webhook, which only knows the
// Razorpay-side order id (not our customer token). Safe to match on
// razorpay_order_id alone: it's unique per GFC order and set once, by us, at
// checkout — never client-supplied. Idempotent against Razorpay's webhook
// retries and against a client-side /verify call that already landed.
export async function markPaidByRazorpayOrderId(razorpayOrderId, razorpayPaymentId) {
  await ensureSchema();
  const q = sql();
  const rows = await q`
    UPDATE orders
       SET payment_status = 'paid',
           razorpay_payment_id = ${razorpayPaymentId},
           paid_at = COALESCE(paid_at, now()),
           updated_at = now()
     WHERE razorpay_order_id = ${razorpayOrderId}
    RETURNING *`;
  return rows[0] || null;
}

export async function listRecentOrders(limit = 50) {
  await ensureSchema();
  const q = sql();
  const n = Math.min(Math.max(Number(limit) || 50, 1), 200);
  return q`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${n}`;
}
