"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraService = void 0;
const client_1 = require("../../prisma/client");
class ExtraService {
    static async getAll() {
        return client_1.prisma.extra.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return client_1.prisma.extra.findUnique({
            where: { extra_id: id }
        });
    }
    static async create(data) {
        return client_1.prisma.extra.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.extra.update({
            where: { extra_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.extra.delete({
            where: { extra_id: id }
        });
    }
}
exports.ExtraService = ExtraService;
