import { prisma } from "../../prisma/client.js";
export class DealService {
    static async getAll() {
        const db = prisma;
        return db.deal.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        const db = prisma;
        return db.deal.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        const db = prisma;
        return db.deal.create({ data });
    }
    static async update(id, data) {
        const db = prisma;
        return db.deal.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        const db = prisma;
        return db.deal.delete({
            where: { id },
        });
    }
}
