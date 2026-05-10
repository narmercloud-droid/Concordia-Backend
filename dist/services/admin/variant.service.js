"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const client_1 = require("../../prisma/client");
class VariantService {
    static async getAll() {
        return client_1.prisma.variant.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return client_1.prisma.variant.findUnique({
            where: { variant_id: id }
        });
    }
    static async create(data) {
        return client_1.prisma.variant.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.variant.update({
            where: { variant_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.variant.delete({
            where: { variant_id: id }
        });
    }
}
exports.VariantService = VariantService;
