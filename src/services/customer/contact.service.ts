import logger from "../../logger.ts";
import { prisma } from "../../prisma/client.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.CAMPAIGN_FROM_EMAIL || "marketing@concordia.de";

const BRANCH_INBOX: Record<string, string> = {
  "concordia-kempen": "kempen@concordia.de",
  "concordia-straelen": "kempen@concordia.de"
};

const DEFAULT_INBOX = "kempen@concordia.de";

export type ContactFormInput = {
  name: string;
  email: string;
  message: string;
  branchId?: string;
  orderNumber?: string;
  phone?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  if (!RESEND_API_KEY) {
    logger.warn({ to, subject }, "Skipping contact email: RESEND_API_KEY not set");
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
      reply_to: replyTo,
      subject,
      html
    })
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.error({ to, subject, body }, "Contact email send failed");
  }

  return res.ok;
}

export async function submitContactForm(input: ContactFormInput) {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const orderNumber = input.orderNumber?.trim() || "";
  const phone = input.phone?.trim() || "";
  const branchId = input.branchId?.trim() || "";

  if (!name || name.length < 2) {
    throw { code: "INVALID_INPUT", message: "Name is required" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw { code: "INVALID_INPUT", message: "Valid email is required" };
  }
  if (!message || message.length < 10) {
    throw { code: "INVALID_INPUT", message: "Message must be at least 10 characters" };
  }
  if (message.length > 4000) {
    throw { code: "INVALID_INPUT", message: "Message is too long" };
  }
  if (orderNumber.length > 64) {
    throw { code: "INVALID_INPUT", message: "Order number is too long" };
  }
  if (name.length > 120) {
    throw { code: "INVALID_INPUT", message: "Name is too long" };
  }
  if (phone.length > 40) {
    throw { code: "INVALID_INPUT", message: "Phone number is too long" };
  }

  const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 120);
  const safeOrderNumber = orderNumber.replace(/[\r\n]+/g, "").slice(0, 64);

  let branchName = "General enquiry";
  if (branchId) {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { id: true, name: true }
    });
    if (!branch) {
      throw { code: "INVALID_INPUT", message: "Unknown branch selected" };
    }
    branchName = branch.name;
  }

  const inbox = (branchId && BRANCH_INBOX[branchId]) || DEFAULT_INBOX;
  const subjectParts = ["Concordia contact"];
  if (safeOrderNumber) subjectParts.push(`Order #${safeOrderNumber}`);
  subjectParts.push(safeName);
  const subject = subjectParts.join(" — ").slice(0, 200);

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a">
      <h2 style="margin:0 0 12px;font-size:18px">New contact form message</h2>
      <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p><strong>Branch:</strong> ${escapeHtml(branchName)}</p>
      ${safeOrderNumber ? `<p><strong>Order number:</strong> ${escapeHtml(safeOrderNumber)}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  const sent = await sendEmail(inbox, subject, html, email);
  if (!sent) {
    throw { code: "SERVICE_UNAVAILABLE", message: "Could not send message right now. Please call us instead." };
  }

  return { sent: true };
}
