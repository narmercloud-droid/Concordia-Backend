import { VariantService } from "../../services/admin/variant.service.js";
import { success, fail } from "../controllerHelper.js";
export class VariantController {
    static async getAll(_req, res, next) {
        try {
            const variants = await VariantService.getAll();
            return success(res, variants);
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const variant = await VariantService.getById(id);
            if (!variant) {
                return fail(res, "Variant not found", 404);
            }
            return success(res, variant);
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const variant = await VariantService.create(req.body);
            return success(res, variant);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const variant = await VariantService.update(id, req.body);
            return success(res, variant);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await VariantService.remove(id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
