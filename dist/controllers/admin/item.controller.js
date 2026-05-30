import { ItemService } from "../../services/admin/item.service.js";
import { success, fail } from "../controllerHelper.js";
export class ItemController {
    static async getAll(_req, res, next) {
        try {
            const items = await ItemService.getAll();
            return success(res, items);
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const item = await ItemService.getById(id);
            if (!item) {
                return fail(res, "Item not found", 404);
            }
            return success(res, item);
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const item = await ItemService.create(req.body);
            return success(res, item);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const item = await ItemService.update(id, req.body);
            return success(res, item);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await ItemService.remove(id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
