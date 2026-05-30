import type { Request, Response, NextFunction  } from "express";
import { VariantService } from "../../services/admin/variant.service.js";
import { success, fail } from "../controllerHelper.js";

export class VariantController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const variants = await VariantService.getAll();
      return success(res, variants);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const variant = await VariantService.getById(id);

      if (!variant) {
        return fail(res, "Variant not found", 404);
      }

      return success(res, variant);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const variant = await VariantService.create(req.body);
      return success(res, variant);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const variant = await VariantService.update(id, req.body);
      return success(res, variant);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await VariantService.remove(id);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}





