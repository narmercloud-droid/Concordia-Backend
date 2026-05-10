"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("../../prisma/client");
class CategoryService {
    static async getAll() {
        return client_1.prisma.category.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return client_1.prisma.category.findUnique({
            where: { category_id: id }
        });
    }
    static async create(data) {
        return client_1.prisma.category.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.category.update({
            where: { category_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.category.delete({
            where: { category_id: id }
        });
    }
}
exports.CategoryService = CategoryService;
