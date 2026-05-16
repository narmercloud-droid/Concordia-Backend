import { prisma } from "../../prisma/client.js";
export class ToppingService {
    static async getAll() {
        return prisma.topping.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        return prisma.topping.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        return prisma.topping.create({ data });
    }
    static async update(id, data) {
        return prisma.topping.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        return prisma.topping.delete({
            where: { id },
        });
    }
}
