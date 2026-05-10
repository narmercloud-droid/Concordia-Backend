"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantController = void 0;
const variant_service_1 = require("../../services/admin/variant.service");
class VariantController {
    static async getAll(_req, res) {
        const variants = await variant_service_1.VariantService.getAll();
        res.json(variants);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const variant = await variant_service_1.VariantService.getById(id);
        if (!variant) {
            return res.status(404).json({ error: "Variant not found" });
        }
        res.json(variant);
        return;
    }
    static async create(req, res) {
        const variant = await variant_service_1.VariantService.create(req.body);
        res.status(201).json(variant);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const variant = await variant_service_1.VariantService.update(id, req.body);
        res.json(variant);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await variant_service_1.VariantService.remove(id);
        res.json({ success: true });
    }
}
exports.VariantController = VariantController;
