import { Resend } from 'resend';
import { computeOrder } from '../lib/catalog.js';
import { createOrder } from '../lib/db.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const OWNER_EMAIL = process.env.ORDER_TO_EMAIL || process.env.FEEDBACK_TO_EMAIL || 'karan@goodfruit.club';
const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || 'Good Fruit Club <orders@goodfruit.club>';

function escapeHtml(str) {
  return String(str).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

function inr(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function paymentLabel(mode) {
  if (mode === 'COD') return 'Cash on Delivery';
  if (mode === 'ONLINE') return 'Online (Razorpay)';
  return 'UPI';
}

function lineRows(order) {
  return order.items
    .map((l) => `<tr>
      <td style="padding:4px 12px 4px 0">${escapeHtml(l.itemName)}</td>
      <td style="padding:4px 12px 4px 0">${escapeHtml(String(l.qty))} ${escapeHtml(l.unit)}</td>
      <td style="padding:4px 0;text-align:right">${inr(l.lineTotal)}</td>
    </tr>`)
    .join('');
}

function ownerEmailHtml(order, trackUrl) {
  return `
    <h2>New order ${escapeHtml(order.order_no)}</h2>
    <table style="border-collapse:collapse;font-size:14px">${lineRows({ items: order.items })}</table>
    <p><strong>Total: ${inr(order.total)}</strong></p>
    <p><strong>Payment:</strong> ${paymentLabel(order.payment_mode)} (${escapeHtml(order.payment_status)})</p>
    <hr/>
    <p><strong>Name:</strong> ${escapeHtml(order.customer_name)}<br/>
       <strong>Phone:</strong> ${escapeHtml(order.phone)}<br/>
       <strong>Address:</strong> ${escapeHtml(order.address)}${order.email ? `<br/><strong>Email:</strong> ${escapeHtml(order.email)}` : ''}</p>
    <p><a href="${trackUrl}">View / update order →</a></p>`;
}

function customerEmailHtml(order, trackUrl) {
  return `
    <h2>Thanks for your order, ${escapeHtml(order.customer_name)}! 🍊</h2>
    <p>We've received order <strong>${escapeHtml(order.order_no)}</strong> and will start sourcing fresh for you.</p>
    <table style="border-collapse:collapse;font-size:14px">${lineRows({ items: order.items })}</table>
    <p><strong>Total: ${inr(order.total)}</strong> · ${paymentLabel(order.payment_mode)}</p>
    <p>Track your order anytime: <a href="${trackUrl}">${trackUrl}</a></p>
    <p style="color:#6b6b5e;font-size:13px">Good Fruit Club · Gurgaon</p>`;
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  const address = String(data.address || '').trim();
  const email = String(data.email || '').trim();
  const paymentMode = ['ONLINE', 'UPI', 'COD'].includes(data.payment) ? data.payment : 'COD';

  if (!name) return Response.json({ error: 'Name is required' }, { status: 400 });
  if (!/^\d{10}$/.test(phone)) return Response.json({ error: 'Valid 10-digit phone is required' }, { status: 400 });
  if (!address) return Response.json({ error: 'Address is required' }, { status: 400 });

  // Recompute totals server-side from the authoritative catalog — never trust
  // prices sent by the client.
  const { lines, total } = computeOrder(data.cart);
  if (lines.length === 0 || total <= 0) {
    return Response.json({ error: 'Cart is empty or invalid' }, { status: 400 });
  }

  let order;
  try {
    order = await createOrder({
      items: lines,
      subtotal: total,
      total,
      name,
      phone,
      address,
      email: email || null,
      paymentMode,
    });
  } catch (err) {
    console.error('Failed to create order:', err);
    return Response.json({ error: 'Could not save order' }, { status: 500 });
  }

  // Notifications are best-effort — the order is already persisted, so email
  // failures must not fail the request.
  if (resend) {
    const origin = new URL(request.url).origin;
    const trackUrl = `${origin}/#/order/${order.public_token}`;
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `New order ${order.order_no} — ${inr(order.total)}`,
        html: ownerEmailHtml(order, trackUrl),
      });
    } catch (err) {
      console.error('Owner email failed:', err);
    }
    if (order.email) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: order.email,
          subject: `Order ${order.order_no} received — Good Fruit Club`,
          html: customerEmailHtml(order, trackUrl),
        });
      } catch (err) {
        console.error('Customer email failed:', err);
      }
    }
  }

  return Response.json({
    orderNo: order.order_no,
    token: order.public_token,
    total: order.total,
  });
}
