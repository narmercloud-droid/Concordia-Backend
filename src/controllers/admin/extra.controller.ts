import { Request, Response } from "express";
import { ExtraService } from "../../services/admin/extra.service";

export class ExtraController {
  static async getAll(_req: Request, res: Response) {
    const extras = await ExtraService.getAll();
    res.json(extras);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const extra = await ExtraService.getById(id);

    if (!extra) {
      return res.status(404).json({ error: "Extra not found" });
    }

    res.json(extra);
    return;
  }

  static async create(req: Request, res: Response) {
    const extra = await ExtraService.create(req.body);
    res.status(201).json(extra);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const extra = await ExtraService.update(id, req.body);
    res.json(extra);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await ExtraService.remove(id);
    res.json({ success: true });
  }
}
