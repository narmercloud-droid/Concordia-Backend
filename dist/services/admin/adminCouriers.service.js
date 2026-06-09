import { prisma } from "../../prisma/client.js";
export class AdminCouriersService {
    static async getAll(branchId) {
        return prisma.courier.findMany({
            where: { branchId },
            include: {
                locations: true
            },
            orderBy: { name: "asc" }
        });
    }
    static async getById(courierId, branchId) {
        return prisma.courier.findFirst({
            where: { id: courierId, branchId },
            include: {
                locations: true
            }
        });
    }
    static async create(branchId, data) {
        const { password: _password, ...courierData } = data;
        void _password;
        return prisma.courier.create({
            data: {
                ...courierData,
                branchId,
                active: true
            }
        });
    }
    static async update(courierId, branchId, data) {
        const updated = await prisma.courier.updateMany({
            where: { id: courierId, branchId },
            data
        });
        if (updated.count === 0)
            throw new Error("Courier not found for branch");
        return prisma.courier.findUnique({ where: { id: courierId } });
    }
    static async toggleActive(courierId, branchId) {
        const courier = await prisma.courier.findFirst({ where: { id: courierId, branchId } });
        if (!courier)
            throw new Error("Courier not found");
        return prisma.courier.update({
            where: { id: courierId },
            data: { active: !courier.active }
        });
    }
    static async getOrderHistory(courierId, branchId) {
        return prisma.order.findMany({
            where: { courierToken: courierId, branchId },
            include: {
                customer: true,
                items: {
                    include: {
                        item: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
}
