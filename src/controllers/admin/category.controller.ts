import { Request, Response } from "express";
import { CategoryService } from "../../services/admin/category.service";

export class CategoryController {
  static async getAll(_req: Request, res: Response) {
    const categories = await CategoryService.getAll();
    res.json(categories);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const category = await CategoryService.getById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
    return;
  }

  static async create(req: Request, res: Response) {
    const category = await CategoryService.create(req.body);
    res.status(201).json(category);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const category = await CategoryService.update(id, req.body);
    res.json(category);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await CategoryService.remove(id);
    res.json({ success: true });
  }
}
