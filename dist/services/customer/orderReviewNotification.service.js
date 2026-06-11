import { randomUUID } from "crypto";
import logger from "../../logger.js";
import { prisma } from "../../prisma/client.js";
import { smsService } from "../sms.service.js";
import { buildOrderReviewUrl, buildOrderTrackingUrl } from "../../utils/customerOrderUrls.js";
import { sendPush } from "../notifications/notification.service.js";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.CAMPAIGN_FROM_EMAIL || "marketing@concordia.de";
const REVIEW_INVITED_STATUS = "review_invited";
function shouldSendReviewInvitation(order) {
    if (order.fulfillmentType === "delivery") {
        return order.status === "delivered";
    }
    return order.status === "picked_up" || order.status === "completed";
}
async function sendEmail(to, subject, html) {
    if (!RESEND_API_KEY) {
        logger.warn({ to, subject }, "Skipping review email: RESEND_API_KEY not set");
        return false;
    }
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to,
            subject,
            html
        })
    });
    return res.ok;
}
async function sendSms(phone, message) {
    if (!process.env.MESSAGEBIRD_API_KEY && !process.env.TWILIO_ACCOUNT_SID) {
        logger.warn({ phone }, "Skipping review SMS: no SMS provider configured");
        return false;
    }
    try {
        await smsService.sendSMS(phone, message);
        return true;
    }
    catch (err) {
        logger.error({ err, phone }, "Review SMS send failed");
        return false;
    }
}
function buildReviewEmailHtml(params) {
    const { customerName, orderShortId, reviewUrl, trackingUrl, isDelivery } = params;
    const intro = isDelivery
        ? "Ihre Bestellung wurde zugestellt."
        : "Ihre Bestellung ist abgeschlossen.";
    return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px">
      <p>Hallo ${customerName},</p>
      <p>${intro} Wie zufrieden waren Sie mit <strong>Essen</strong>${isDelivery ? " und <strong>Lieferung</strong>" : ""}?</p>
      <p style="margin:24px 0">
        <a href="${reviewUrl}" style="display:inline-block;padding:12px 22px;background:#1b7340;color:#fff;text-decoration:none;border-radius:999px;font-weight:600">
          Jetzt bewerten
        </a>
      </p>
      <p style="font-size:14px;color:#666">
        Bestellung #${orderShortId}<br/>
        <a href="${trackingUrl}">Bestellung ansehen</a>
      </p>
      <p style="font-size:13px;color:#888">Concordia Pizzeria</p>
    </div>
  `;
}
export async function sendOrderReviewInvitation(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { review: true, trackingEvents: true }
    });
    if (!order || order.review)
        return { sent: false, reason: "not_eligible" };
    if (!shouldSendReviewInvitation(order))
        return { sent: false, reason: "status" };
    const alreadyInvited = order.trackingEvents.some((event) => event.status === REVIEW_INVITED_STATUS);
    if (alreadyInvited)
        return { sent: false, reason: "already_sent" };
    const reviewUrl = buildOrderReviewUrl(order.id);
    const trackingUrl = buildOrderTrackingUrl(order.id);
    const orderShortId = order.id.slice(0, 8).toUpperCase();
    const isDelivery = order.fulfillmentType === "delivery";
    const customerName = order.customerName?.trim() || "Gast";
    const smsText = isDelivery
        ? `Concordia: Wie war Essen & Lieferung? Bewerten Sie Ihre Bestellung #${orderShortId}: ${reviewUrl}`
        : `Concordia: Wie war Ihr Essen? Bewerten Sie Ihre Bestellung #${orderShortId}: ${reviewUrl}`;
    const pushTitle = "Wie war Ihre Bestellung?";
    const pushBody = isDelivery
        ? "Bewerten Sie Essen und Lieferung — nur einen Moment."
        : "Bewerten Sie Ihr Essen — nur einen Moment.";
    const tasks = [];
    if (order.customerEmail) {
        tasks.push(sendEmail(order.customerEmail, `Concordia — Bewerten Sie Ihre Bestellung #${orderShortId}`, buildReviewEmailHtml({
            customerName,
            orderShortId,
            reviewUrl,
            trackingUrl,
            isDelivery
        })));
    }
    if (order.customerPhone) {
        tasks.push(sendSms(order.customerPhone, smsText));
    }
    if (order.pushToken) {
        tasks.push(sendPush(order.pushToken, pushTitle, pushBody, {
            orderId: order.id,
            url: reviewUrl
        }).then(() => true));
    }
    await Promise.all(tasks);
    await prisma.orderTrackingEvent.create({
        data: {
            id: randomUUID(),
            orderId: order.id,
            status: REVIEW_INVITED_STATUS,
            timestamp: new Date()
        }
    });
    logger.info({ orderId: order.id }, "Review invitation sent");
    return { sent: true };
}
