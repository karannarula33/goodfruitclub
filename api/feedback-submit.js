import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || 'karan@goodfruit.club';
const FROM_EMAIL = process.env.FEEDBACK_FROM_EMAIL || 'Good Fruit Club <feedback@goodfruit.club>';

function escapeHtml(str) {
  return str.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(data.name || '').trim();
  const date = String(data.date || '').trim();
  const orderId = String(data.orderId || '').trim();
  const item = String(data.item || '').trim();
  const details = String(data.details || '').trim();
  const mediaUrl = typeof data.mediaUrl === 'string' ? data.mediaUrl.trim() : '';

  if (!name || !details) {
    return Response.json({ error: 'Name and details are required' }, { status: 400 });
  }
  if (mediaUrl && !/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(mediaUrl)) {
    return Response.json({ error: 'Invalid media URL' }, { status: 400 });
  }

  const html = `
    <h2>New feedback — Good Fruit Club</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Date:</strong> ${escapeHtml(date || '—')}</p>
    <p><strong>Order ID:</strong> ${escapeHtml(orderId || '—')}</p>
    <p><strong>Item:</strong> ${escapeHtml(item || '—')}</p>
    <p><strong>Details:</strong><br/>${escapeHtml(details).replace(/\n/g, '<br/>')}</p>
    ${mediaUrl ? `<p><strong>Photo/Video proof:</strong> <a href="${mediaUrl}">${mediaUrl}</a></p>` : '<p><em>No photo/video attached</em></p>'}
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New feedback from ${name}${orderId ? ` (Order ${orderId})` : ''}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send feedback email:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
