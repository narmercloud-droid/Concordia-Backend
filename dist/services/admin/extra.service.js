import { prisma } from "../../prisma/client.js";
export class ExtraService {
    static async getAll() {
        const db = prisma;
        return db.extra.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        const db = prisma;
        return db.extra.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        const db = prisma;
        return db.extra.create({ data });
    }
    static async update(id, data) {
        const db = prisma;
        return db.extra.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        const db = prisma;
        return db.extra.delete({
            where: { id },
        });
    }
}
