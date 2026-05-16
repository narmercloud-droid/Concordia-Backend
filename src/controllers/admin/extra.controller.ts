import { Request, Response, NextFunction } from "express";
import { ExtraService } from "../../services/admin/extra.service.js";

export class ExtraController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const extras = await ExtraService.getAll();
      res.json(extras);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const extra = await ExtraService.getById(id);

      if (!extra) {
        return res.status(404).json({ error: "Extra not found" });
      }

      res.json(extra);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const extra = await ExtraService.create(req.body);
      res.status(201).json(extra);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const extra = await ExtraService.update(id, req.body);
      res.json(extra);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await ExtraService.remove(id);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}
