import { prisma } from "../../prisma/client.js";
export class VariantService {
    static async getAll() {
        const db = prisma;
        return db.variant.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        const db = prisma;
        return db.variant.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        const db = prisma;
        return db.variant.create({ data });
    }
    static async update(id, data) {
        const db = prisma;
        return db.variant.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        const db = prisma;
        return db.variant.delete({
            where: { id },
        });
    }
}
