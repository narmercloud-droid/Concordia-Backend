import { prisma } from "../prisma/client.js";
import { pushService } from "./push.service";
import { smsService } from "./sms.service";
export class NotificationsService {
    async sendOrderStatusUpdate(order, status) {
        const customer = await prisma.customer.findUnique({
            where: { id: order.customerId }
        });
        if (!customer)
            return;
        const prefs = await prisma.notificationPreference.findUnique({
            where: { customerId: customer.id }
        });
        if (prefs?.allowPush && customer.deviceToken) {
            await pushService.sendToCustomer(customer.deviceToken, "Order Update", `Your order is now: ${status}`, { orderId: order.id });
        }
    }
    async sendScheduledReminder(order) {
        const customer = await prisma.customer.findUnique({
            where: { id: order.customerId }
        });
        if (!customer)
            return;
        const prefs = await prisma.notificationPreference.findUnique({
            where: { customerId: customer.id }
        });
        if (prefs?.allowPush && customer.deviceToken) {
            await pushService.sendToCustomer(customer.deviceToken, "Scheduled Order", "Your scheduled order is being prepared.", { orderId: order.id });
        }
    }
    async sendMarketingSMS(phones, message) {
        return smsService.sendBulkSMS(phones, message);
    }
}
export const notificationsService = new NotificationsService();
