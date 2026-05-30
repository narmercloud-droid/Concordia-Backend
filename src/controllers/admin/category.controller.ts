import type { Request, Response, NextFunction  } from "express";
import { CategoryService } from "../../services/admin/category.service.js";
import { success, fail } from "../controllerHelper.js";

export class CategoryController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      return success(res, categories);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const category = await CategoryService.getById(id);

      if (!category) {
        return fail(res, "Category not found", 404);
      }

      return success(res, category);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.create(req.body);
      return success(res, category);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const category = await CategoryService.update(id, req.body);
      return success(res, category);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await CategoryService.remove(id);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}






