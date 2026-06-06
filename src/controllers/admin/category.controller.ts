import type { Request } from "express";
import { CategoryService } from "../../services/admin/category.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class CategoryController {
  static getAll = wrap(async (_req: Request) => {
    const categories = await CategoryService.getAll();
    return categories;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const category = await CategoryService.getById(id);

    if (!category) throw fail('NOT_FOUND', 'Category not found');

    return category;
  });

  static create = wrap(async (req: Request) => {
    const category = await CategoryService.create(req.body);
    return category;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const category = await CategoryService.update(id, req.body);
    return category;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await CategoryService.remove(id);
    return { success: true };
  });
}






