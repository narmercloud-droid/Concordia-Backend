import { Request, Response, NextFunction } from "express";
import { ToppingService } from "../../services/admin/topping.service.js";

export class ToppingController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const toppings = await ToppingService.getAll();
      res.json(toppings);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const topping = await ToppingService.getById(id);

      if (!topping) {
        return res.status(404).json({ error: "Topping not found" });
      }

      res.json(topping);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const topping = await ToppingService.create(req.body);
      res.status(201).json(topping);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const topping = await ToppingService.update(id, req.body);
      res.json(topping);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await ToppingService.remove(id);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}
