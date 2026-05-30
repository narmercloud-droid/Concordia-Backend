import type { Request, Response, NextFunction  } from "express";
import { ToppingService } from "../../services/admin/topping.service.js";
import { success, fail } from "../controllerHelper.js";

export class ToppingController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const toppings = await ToppingService.getAll();
      return success(res, toppings);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const topping = await ToppingService.getById(id);

      if (!topping) {
        return fail(res, "Topping not found", 404);
      }

      return success(res, topping);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const topping = await ToppingService.create(req.body);
      return success(res, topping);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const topping = await ToppingService.update(id, req.body);
      return success(res, topping);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await ToppingService.remove(id);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}





