"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../../services/admin/category.service");
class CategoryController {
    static async getAll(_req, res) {
        const categories = await category_service_1.CategoryService.getAll();
        res.json(categories);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const category = await category_service_1.CategoryService.getById(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
        return;
    }
    static async create(req, res) {
        const category = await category_service_1.CategoryService.create(req.body);
        res.status(201).json(category);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const category = await category_service_1.CategoryService.update(id, req.body);
        res.json(category);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await category_service_1.CategoryService.remove(id);
        res.json({ success: true });
    }
}
exports.CategoryController = CategoryController;
