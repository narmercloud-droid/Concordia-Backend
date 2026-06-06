import { prisma } from "../../prisma/client.js";
export class ToppingService {
    static async getAll() {
        const db = prisma;
        return db.topping.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        const db = prisma;
        return db.topping.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        const db = prisma;
        return db.topping.create({ data });
    }
    static async update(id, data) {
        const db = prisma;
        return db.topping.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        const db = prisma;
        return db.topping.delete({
            where: { id },
        });
    }
}
