import { CategoryService } from "../../services/admin/category.service.js";
import { success, fail } from "../controllerHelper.js";
export class CategoryController {
    static async getAll(_req, res, next) {
        try {
            const categories = await CategoryService.getAll();
            return success(res, categories);
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const category = await CategoryService.getById(id);
            if (!category) {
                return fail(res, "Category not found", 404);
            }
            return success(res, category);
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const category = await CategoryService.create(req.body);
            return success(res, category);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const category = await CategoryService.update(id, req.body);
            return success(res, category);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await CategoryService.remove(id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
