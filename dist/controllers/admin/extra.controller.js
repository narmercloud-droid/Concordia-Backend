"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraController = void 0;
const extra_service_1 = require("../../services/admin/extra.service");
class ExtraController {
    static async getAll(_req, res) {
        const extras = await extra_service_1.ExtraService.getAll();
        res.json(extras);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const extra = await extra_service_1.ExtraService.getById(id);
        if (!extra) {
            return res.status(404).json({ error: "Extra not found" });
        }
        res.json(extra);
        return;
    }
    static async create(req, res) {
        const extra = await extra_service_1.ExtraService.create(req.body);
        res.status(201).json(extra);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const extra = await extra_service_1.ExtraService.update(id, req.body);
        res.json(extra);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await extra_service_1.ExtraService.remove(id);
        res.json({ success: true });
    }
}
exports.ExtraController = ExtraController;
