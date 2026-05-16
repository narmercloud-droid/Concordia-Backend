import { prisma } from "../../prisma/client.js";
export class DealService {
    static async getAll() {
        return prisma.deal.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        return prisma.deal.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        return prisma.deal.create({ data });
    }
    static async update(id, data) {
        return prisma.deal.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        return prisma.deal.delete({
            where: { id },
        });
    }
}
