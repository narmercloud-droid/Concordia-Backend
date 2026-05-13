import { VariantService } from "../../services/admin/variant.service.js";
export class VariantController {
    static async getAll(_req, res, next) {
        try {
            const variants = await VariantService.getAll();
            res.json(variants);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const variant = await VariantService.getById(id);
            if (!variant) {
                return res.status(404).json({ error: "Variant not found" });
            }
            res.json(variant);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const variant = await VariantService.create(req.body);
            res.status(201).json(variant);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const variant = await VariantService.update(id, req.body);
            res.json(variant);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await VariantService.remove(id);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
