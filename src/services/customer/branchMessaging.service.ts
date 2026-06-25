import logger from "../../logger.ts";
import { smsService } from "../sms.service.ts";
import { sendOfferPushToCustomerEmail } from "../notifications/webPushSubscription.service.ts";
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
  text: string,
  options?: { url?: string }
) {
  const channel = customer.preferredChannel as PreferredChannel | null;
  let sent = false;
  let usedChannel: string | null = null;

  if (channel === "email" && customer.email) {
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.5"><p>${text.replace(/\n/g, "<br/>")}</p></div>`;
    sent = await sendEmail(customer.email, subject, html);
    usedChannel = "email";
  } else if (channel === "whatsapp") {
    sent = await sendWhatsApp(customer.phone, text);
    usedChannel = "whatsapp";
  } else if (channel === "sms") {
    sent = await sendSms(customer.phone, text);
    usedChannel = "sms";
  }

  const offerUrl = options?.url ?? "/offers";
  try {
    const pushResult = await sendOfferPushToCustomerEmail(
      customer.email,
      subject,
      text.replace(/\n/g, " "),
      offerUrl
    );
    if (pushResult.sent > 0) {
      sent = true;
      usedChannel = usedChannel ?? "push";
    }
  } catch (err) {
    logger.warn({ err, customerId: customer.id }, "Branch offer push failed");
  }

  return { sent, channel: usedChannel };
}
