"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToppingService = void 0;
const client_1 = require("../../prisma/client");
class ToppingService {
    static async getAll() {
        return client_1.prisma.topping.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return client_1.prisma.topping.findUnique({
            where: { topping_id: id }
        });
    }
    static async create(data) {
        return client_1.prisma.topping.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.topping.update({
            where: { topping_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.topping.delete({
            where: { topping_id: id }
        });
    }
}
exports.ToppingService = ToppingService;
