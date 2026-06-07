import logger from "../../logger.ts";
import { smsService } from "../sms.service.ts";
import type { BranchCustomer } from "@prisma/client";
import type { PreferredChannel } from "./branchCustomer.service.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CAMPAIGN_FROM_EMAIL =
  process.env.CAMPAIGN_FROM_EMAIL || "marketing@concordia.de";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    logger.warn({ to, subject }, "Skipping email: RESEND_API_KEY not set");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: CAMPAIGN_FROM_EMAIL,
      to,
      subject,
      html
    })
  });

  return res.ok;
}

async function sendSms(phone: string, message: string) {
  if (!process.env.MESSAGEBIRD_API_KEY && !process.env.TWILIO_ACCOUNT_SID) {
    logger.warn({ phone }, "Skipping SMS: no SMS provider configured");
    return false;
  }
  try {
    await smsService.sendSMS(phone, message);
    return true;
  } catch (err) {
    logger.error({ err, phone }, "SMS send failed");
    return false;
  }
}

async function sendWhatsApp(phone: string, message: string) {
  // Twilio WhatsApp uses sms channel with whatsapp: prefix when configured
  if (!process.env.TWILIO_ACCOUNT_SID) {
    logger.warn({ phone }, "WhatsApp not configured — falling back to SMS");
    return sendSms(phone, message);
  }
  try {
    await smsService.sendSMS(`whatsapp:${phone}`, message);
    return true;
  } catch (err) {
    logger.error({ err, phone }, "WhatsApp send failed");
    return sendSms(phone, message);
  }
}

export async function sendBranchMessage(
  customer: BranchCustomer,
  subject: string,
  text: string
) {
  const channel = customer.preferredChannel as PreferredChannel | null;
  if (!channel) return { sent: false, channel: null };

  if (channel === "email" && customer.email) {
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.5"><p>${text.replace(/\n/g, "<br/>")}</p></div>`;
    const sent = await sendEmail(customer.email, subject, html);
    return { sent, channel };
  }

  if (channel === "whatsapp") {
    const sent = await sendWhatsApp(customer.phone, text);
    return { sent, channel: "whatsapp" };
  }

  if (channel === "sms") {
    const sent = await sendSms(customer.phone, text);
    return { sent, channel: "sms" };
  }

  return { sent: false, channel };
}
