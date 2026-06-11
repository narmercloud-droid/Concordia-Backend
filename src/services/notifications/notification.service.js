import { getIO } from '../../ws/ws.js';
import webpush from 'web-push';

export function sendWS(event, payload) {
  const io = getIO();
  io.emit(event, payload);
}

export async function sendPush(subscription, title, body, data = {}) {
  if (!subscription) return;

  let sub = subscription;
  if (typeof sub === 'string') {
    try {
      sub = JSON.parse(sub);
    } catch {
      return;
    }
  }

  const payload = JSON.stringify({ title, body, url: data.url, data });

  try {
    await webpush.sendNotification(sub, payload);
  } catch (err) {
    console.error('Push send error:', err);
  }
}

export async function sendSMS(phone, message) {
  console.log('[SMS]', phone, message);
}

export async function sendEmail(email, subject, message) {
  console.log('[EMAIL]', email, subject, message);
}

export async function notifyCustomer(order, payload) {
  const message = payload.message || payload.type;

  if (order.customerPhone) {
    await sendSMS(order.customerPhone, message);
  }

  if (order.customerEmail) {
    await sendEmail(order.customerEmail, 'Order Update', message);
  }

  // Backwards-compatible: support old pushToken or new pushSubscription
  const pushSub = order.pushSubscription || order.pushToken;
  if (pushSub) {
    const trackingUrl = payload.reviewUrl || payload.trackingUrl;
    await sendPush(pushSub, 'Order Update', message, {
      orderId: order.id,
      url: trackingUrl
    });
  }
}
