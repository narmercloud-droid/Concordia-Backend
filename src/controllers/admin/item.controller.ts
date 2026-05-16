import { Request, Response, NextFunction } from "express";
import { ItemService } from "../../services/admin/item.service.js";

export class ItemController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await ItemService.getAll();
      res.json(items);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const item = await ItemService.getById(id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ItemService.create(req.body);
      res.status(201).json(item);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const item = await ItemService.update(id, req.body);
      res.json(item);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await ItemService.remove(id);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}
