import { CategoryService } from "../../services/admin/category.service.js";
export class CategoryController {
    static async getAll(_req, res, next) {
        try {
            const categories = await CategoryService.getAll();
            res.json(categories);
            return;
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
                return res.status(404).json({ error: "Category not found" });
            }
            res.json(category);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const category = await CategoryService.create(req.body);
            res.status(201).json(category);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const category = await CategoryService.update(id, req.body);
            res.json(category);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await CategoryService.remove(id);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
