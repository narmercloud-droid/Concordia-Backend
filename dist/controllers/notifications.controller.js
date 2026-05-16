import { prisma } from "../prisma/client.js";
import { notificationsService } from "../services/notifications.service.js";
import { success, fail } from "./controllerHelper.js";
import { notificationPreferencesSchema, marketingSmsSchema } from "../validation/notifications.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const NotificationsController = {
    updatePreferences: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = notificationPreferencesSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const prefs = await prisma.notificationPreference.upsert({
                where: { customerId },
                update: parsed.data,
                create: {
                    customerId,
                    ...parsed.data
                }
            });
            return success(res, prefs, "Preferences updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    sendMarketingSMS: async (req, res, next) => {
        try {
            const parsed = marketingSmsSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { message, segment } = parsed.data;
            let customers = [];
            if (segment === "all") {
                customers = await prisma.customer.findMany();
            }
            else if (segment === "recent") {
                customers = await prisma.customer.findMany({
                    where: {
                        orders: {
                            some: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                }
                            }
                        }
                    }
                });
            }
            const phones = customers.filter((c) => c.phone).map((c) => c.phone);
            await notificationsService.sendMarketingSMS(phones, message);
            return success(res, { success: true, sent: phones.length }, "SMS sent");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
