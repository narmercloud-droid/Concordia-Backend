import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../services/admin/category.service.js";

export class CategoryController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const category = await CategoryService.getById(id);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(category);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json(category);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const category = await CategoryService.update(id, req.body);
      res.json(category);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await CategoryService.remove(id);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}

