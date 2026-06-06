import { prisma } from "../prisma/client.js";
import { randomUUID } from "crypto";
export class ManagerDashboardService {
    // MENU ITEMS FOR BRANCH
    async menu(branchId) {
        return prisma.menuItem.findMany({
            include: { category: true }
        });
    }
    // UPDATE ITEM AVAILABILITY
    async setItemAvailability(branchId, itemId, available) {
        return prisma.menuItem.updateMany({
            where: { id: itemId },
            data: { available: available }
        });
    }
    // ORDERS FOR BRANCH
    async orders(branchId, status) {
        return prisma.order.findMany({
            where: {
                branchId,
                ...(status ? { status } : {})
            },
            include: {
                customer: true,
                items: true,
                courier: true
            },
            orderBy: { createdAt: "desc" }
        });
    }
    // COURIERS FOR BRANCH
    async couriers(branchId) {
        return prisma.courier.findMany({
            where: { branchId }
        });
    }
    // TERMINALS FOR BRANCH
    async terminals(branchId) {
        return prisma.terminal.findMany({
            where: { branchId }
        });
    }
    // OPENING HOURS
    async getSchedule(branchId) {
        return prisma.branchSchedule.findMany({
            where: { branchId }
        });
    }
    async updateSchedule(branchId, schedule) {
        await prisma.branchSchedule.deleteMany({ where: { branchId } });
        return prisma.branchSchedule.createMany({
            data: schedule.map(s => ({ id: randomUUID(), ...s, branchId }))
        });
    }
}
export const managerDashboardService = new ManagerDashboardService();
