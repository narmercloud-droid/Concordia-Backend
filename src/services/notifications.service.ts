import { sendPush } from "./notifications/notification.service.js";
import {
  broadcastOfferPush,
  parsePushToken,
  removeWebPushSubscription,
  sendOfferPushToCustomerEmail,
  upsertWebPushSubscription
} from "./notifications/webPushSubscription.service.ts";
import { smsService } from "./sms.service.ts";
import { prisma } from "../prisma/client.ts";

export const notificationsService = {
  isPushEnabled() {
    return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  },

  async registerPushSubscription(input: {
    token: unknown;
    customerId?: string | null;
    allowOffers?: boolean;
    allowOrders?: boolean;
    branchId?: string | null;
  }) {
    const row = await upsertWebPushSubscription(input);

    if (input.customerId) {
      await prisma.notificationPreference.upsert({
        where: { customerId: input.customerId },
        create: {
          customerId: input.customerId,
          allowPush: true,
          allowOffers: input.allowOffers ?? true
        },
        update: {
          allowPush: true,
          ...(typeof input.allowOffers === "boolean" ? { allowOffers: input.allowOffers } : {})
        }
      });
    }

    return row;
  },

  async unregisterPushSubscription(token: unknown) {
    return removeWebPushSubscription(token);
  },

  async updateCustomerPreferences(
    customerId: string,
    prefs: { allowPush?: boolean; allowOffers?: boolean; allowSMS?: boolean }
  ) {
    return prisma.notificationPreference.upsert({
      where: { customerId },
      create: { customerId, ...prefs },
      update: prefs
    });
  },

  async sendMarketingSMS(phones: string[], message: string) {
    const unique = [...new Set(phones.map((p) => p.trim()).filter(Boolean))];
    if (!unique.length) return { sent: 0 };

    if (!process.env.MESSAGEBIRD_API_KEY && !process.env.TWILIO_ACCOUNT_SID) {
      throw new Error("SMS provider is not configured on the server");
    }

    await smsService.sendBulkSMS(unique, message);
    return { sent: unique.length };
  },

  async sendOfferNotification(input: {
    title: string;
    body: string;
    url: string;
    branchId?: string | null;
    customerEmail?: string | null;
  }) {
    if (input.customerEmail) {
      const targeted = await sendOfferPushToCustomerEmail(
        input.customerEmail,
        input.title,
        input.body,
        input.url
      );
      if (targeted.sent > 0) return targeted;
    }

    return broadcastOfferPush(input);
  },

  parsePushToken,
  sendPush
};
