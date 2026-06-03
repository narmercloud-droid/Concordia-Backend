import { ExtraService } from "../../services/admin/extra.service.js";
import { success, fail } from "../controllerHelper.js";
export class ExtraController {
    static async getAll(_req, res, next) {
        try {
            const extras = await ExtraService.getAll();
            return success(res, extras);
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const extra = await ExtraService.getById(id);
            if (!extra) {
                return fail(res, "Extra not found", 404);
            }
            return success(res, extra);
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const extra = await ExtraService.create(req.body);
            return success(res, extra);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const extra = await ExtraService.update(id, req.body);
            return success(res, extra);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await ExtraService.remove(id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
