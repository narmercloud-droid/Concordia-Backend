import { prisma } from "../../prisma/client.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
export class AdminOrdersService {
    static async getAll(branchId, filters) {
        const { status, customerId, startDate, endDate, page = 1, limit = 20 } = filters;
        const where = { branchId };
        if (status)
            where.status = status;
        if (customerId)
            where.customerId = customerId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const orders = await prisma.order.findMany({
            where,
            include: {
                customer: true,
                items: {
                    include: {
                        item: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit
        });
        const total = await prisma.order.count({ where });
        return { orders, total, page, limit };
    }
    static async getById(orderId, branchId) {
        return prisma.order.findFirst({
            where: { id: orderId, branchId },
            include: {
                customer: true,
                items: {
                    include: {
                        item: true
                    }
                }
            }
        });
    }
    static async updateStatus(orderId, branchId, status, estimatedTime) {
        const order = await prisma.order.findFirst({ where: { id: orderId, branchId } });
        if (!order)
            throw new Error("Order not found for branch");
        await OrderLifecycleService.updateStatus(orderId, status, estimatedTime ? new Date(Date.now() + estimatedTime * 60000) : undefined);
        return prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true
            }
        });
    }
    static async assignCourier(orderId, branchId, courierToken) {
        const order = await prisma.order.findFirst({ where: { id: orderId, branchId } });
        if (!order)
            throw new Error("Order not found for branch");
        await OrderLifecycleService.setCourierToken(orderId, courierToken, new Date(Date.now() + 1000 * 60 * 60 * 3));
        return prisma.order.findUnique({ where: { id: orderId }, include: { customer: true } });
    }
}
