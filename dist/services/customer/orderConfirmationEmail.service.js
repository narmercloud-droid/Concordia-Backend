import logger from "../../logger.js";
import { prisma } from "../../prisma/client.js";
import { buildOrderTrackingUrl } from "../../utils/customerOrderUrls.js";
import { formatEuro, legalPageLinksHtml, orderFromEmail } from "../../utils/legalEmail.util.js";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
function fulfillmentLabel(type) {
    if (type === "pickup")
        return "Abholung";
    if (type === "delivery")
        return "Lieferung";
    return type ?? "Bestellung";
}
function paymentLabel(method) {
    const value = (method ?? "").toUpperCase();
    if (value === "COD")
        return "Barzahlung bei Lieferung/Abholung";
    if (value === "CARD")
        return "Karte (Stripe)";
    if (value === "PAYPAL")
        return "PayPal";
    if (value === "KLARNA")
        return "Klarna";
    if (value === "SEPA")
        return "SEPA-Lastschrift";
    return method ?? "—";
}
async function sendEmail(to, subject, html) {
    if (!RESEND_API_KEY) {
        logger.warn({ to, subject }, "Skipping order confirmation email: RESEND_API_KEY not set");
        return false;
    }
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: orderFromEmail(),
            to,
            subject,
            html
        })
    });
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        logger.warn({ to, subject, status: res.status, body }, "Order confirmation email failed");
    }
    return res.ok;
}
function buildOrderConfirmationHtml(params) {
    const { customerName, orderShortId, branchName, fulfillmentType, paymentMethod, orderTotal, deliveryFee, discount, deliveryAddress, scheduledFor, trackingUrl, items } = params;
    const itemRows = items
        .map((item) => {
        const details = [...item.variants, ...item.extras].filter(Boolean).join(", ");
        const notes = item.notes ? `<br><span style="color:#666;font-size:13px">${item.notes}</span>` : "";
        return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${item.quantity}× ${item.name}${details ? `<br><span style="color:#666;font-size:13px">${details}</span>` : ""}${notes}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${formatEuro(item.lineTotal)}</td>
        </tr>
      `;
    })
        .join("");
    const scheduledLine = scheduledFor
        ? `<p><strong>Geplant für:</strong> ${scheduledFor.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}</p>`
        : "";
    const addressLine = fulfillmentType === "delivery" && deliveryAddress
        ? `<p><strong>Lieferadresse:</strong> ${deliveryAddress}</p>`
        : "";
    return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px">
      <p>Hallo ${customerName},</p>
      <p>vielen Dank für Ihre Bestellung bei <strong>${branchName}</strong>. Hiermit bestätigen wir den Vertragsschluss.</p>
      <p><strong>Bestellnummer:</strong> ${orderShortId}</p>
      <p><strong>Art:</strong> ${fulfillmentLabel(fulfillmentType)}</p>
      <p><strong>Zahlungsart:</strong> ${paymentLabel(paymentMethod)}</p>
      ${scheduledLine}
      ${addressLine}
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tbody>${itemRows}</tbody>
      </table>
      ${discount > 0
        ? `<p style="margin:0"><strong>Rabatt:</strong> −${formatEuro(discount)}</p>`
        : ""}
      ${deliveryFee > 0
        ? `<p style="margin:0"><strong>Liefergebühr:</strong> ${formatEuro(deliveryFee)}</p>`
        : ""}
      <p style="margin:12px 0 0"><strong>Gesamtbetrag (inkl. MwSt.):</strong> ${formatEuro(orderTotal)}</p>
      <p style="margin:24px 0">
        <a href="${trackingUrl}" style="display:inline-block;padding:12px 22px;background:#1b7340;color:#fff;text-decoration:none;border-radius:999px;font-weight:600">
          Bestellung verfolgen
        </a>
      </p>
      <p style="font-size:13px;color:#666">
        Allergene und Zusatzstoffe können auf Anfrage in der Filiale eingesehen werden.
        Vertragssprache: Deutsch.
      </p>
      ${legalPageLinksHtml()}
    </div>
  `;
}
export async function sendOrderConfirmationEmail(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            branch: { select: { name: true } },
            items: {
                include: {
                    item: { select: { name: true } },
                    variants: true,
                    extras: true
                }
            }
        }
    });
    if (!order)
        return { sent: false, reason: "not_found" };
    if (order.confirmationEmailSentAt)
        return { sent: false, reason: "already_sent" };
    const email = order.customerEmail?.trim();
    if (!email)
        return { sent: false, reason: "no_email" };
    const orderTotal = Number(order.orderTotal ?? 0);
    const deliveryFee = Number(order.deliveryFee ?? 0);
    const discount = Number(order.discount ?? 0);
    const items = order.items.map((line) => {
        const unit = Number(line.price ?? 0);
        const qty = line.quantity;
        return {
            quantity: qty,
            name: line.item?.name ?? "Artikel",
            lineTotal: unit * qty,
            notes: line.notes,
            variants: line.variants.map((v) => v.name),
            extras: line.extras.map((e) => e.name)
        };
    });
    const html = buildOrderConfirmationHtml({
        customerName: order.customerName?.trim() || "Kunde",
        orderShortId: order.id.slice(0, 8).toUpperCase(),
        branchName: order.branch.name,
        fulfillmentType: order.fulfillmentType,
        paymentMethod: order.paymentMethod,
        orderTotal,
        deliveryFee,
        discount,
        deliveryAddress: order.deliveryAddress,
        scheduledFor: order.scheduledFor,
        trackingUrl: buildOrderTrackingUrl(order.id),
        items
    });
    const sent = await sendEmail(email, `Bestellbestätigung ${order.id.slice(0, 8).toUpperCase()} – Concordia Pizza`, html);
    if (sent) {
        await prisma.order.update({
            where: { id: orderId },
            data: { confirmationEmailSentAt: new Date() }
        });
    }
    return { sent, reason: sent ? "sent" : "send_failed" };
}
function buildGiftCardConfirmationHtml(params) {
    const { purchaserName, branchName, amount, code, expiresAt } = params;
    const expiryLine = expiresAt
        ? `<p><strong>Gültig bis:</strong> ${expiresAt.toLocaleDateString("de-DE")}</p>`
        : "";
    return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px">
      <p>Hallo ${purchaserName},</p>
      <p>vielen Dank für Ihren Gutscheinkauf bei <strong>${branchName}</strong>. Hiermit bestätigen wir den Vertragsschluss.</p>
      <p><strong>Gutscheinwert (inkl. MwSt.):</strong> ${formatEuro(amount)}</p>
      <p style="font-size:22px;font-weight:700;letter-spacing:0.08em">${code}</p>
      ${expiryLine}
      <p style="font-size:13px;color:#666">
        Der Gutschein kann in der jeweiligen Filiale eingelöst werden. Bitte bewahren Sie diesen Code sicher auf.
      </p>
      ${legalPageLinksHtml()}
    </div>
  `;
}
export async function sendGiftCardConfirmationEmail(purchaseId) {
    const card = await prisma.branchGiftCard.findUnique({
        where: { id: purchaseId }
    });
    if (!card || card.paymentStatus !== "paid") {
        return { sent: false, reason: "not_paid" };
    }
    const email = card.purchaserEmail?.trim();
    if (!email)
        return { sent: false, reason: "no_email" };
    const branch = await prisma.branch.findUnique({
        where: { id: card.branchId },
        select: { name: true }
    });
    const html = buildGiftCardConfirmationHtml({
        purchaserName: card.purchaserName?.trim() || "Kunde",
        branchName: branch?.name ?? card.branchId,
        amount: Number(card.initialAmount),
        code: card.code,
        expiresAt: card.expiresAt
    });
    const sent = await sendEmail(email, `Gutscheinbestätigung – Concordia Pizza`, html);
    return { sent, reason: sent ? "sent" : "send_failed" };
}
