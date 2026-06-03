import { prisma } from "../prisma/client.js";
import { notificationsService } from "../services/notifications.service.js";
import { success } from "./controllerHelper.js";
export const NotificationsController = {
    updatePreferences: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const prefs = await prisma.notificationPreference.upsert({
                where: { customerId },
                update: req.body,
                create: {
                    customerId,
                    ...req.body
                }
            });
            return success(res, prefs);
        }
        catch (err) {
            next(err);
        }
    },
    sendMarketingSMS: async (req, res, next) => {
        try {
            const { message, segment } = req.body;
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
            const phones = customers
                .filter(c => c.phone)
                .map(c => c.phone);
            await notificationsService.sendMarketingSMS(phones, message);
            return success(res, { success: true, sent: phones.length });
        }
        catch (err) {
            next(err);
        }
    }
};
