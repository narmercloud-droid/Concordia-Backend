import { prisma } from "../../prisma/client.js";
export class AdminCustomersService {
    static async getAll(branchId, filters) {
        const { page = 1, limit = 20, search } = filters;
        const where = {
            OR: [
                { orders: { some: { branchId } } }
            ]
        };
        if (search) {
            where.AND = [
                { OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search } }
                    ] }
            ];
        }
        const customers = await prisma.customer.findMany({
            where,
            include: {
                addresses: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { name: "asc" },
            skip: (page - 1) * limit,
            take: limit
        });
        const total = await prisma.customer.count({ where });
        return { customers, total, page, limit };
    }
    static async getById(customerId, branchId) {
        return prisma.customer.findFirst({
            where: {
                id: customerId,
                OR: [
                    { orders: { some: { branchId } } }
                ]
            },
            include: {
                addresses: true,
                orders: {
                    where: { branchId },
                    include: {
                        items: {
                            include: {
                                item: true
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
    }
    static async update(customerId, branchId, data) {
        return prisma.customer.update({
            where: { id: customerId },
            data
        });
    }
    static async toggleBan(customerId, branchId) {
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer)
            throw new Error("Customer not found");
        return customer;
    }
    static async getOrderHistory(customerId, branchId) {
        return prisma.order.findMany({
            where: { customerId, branchId },
            include: {
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
