import { Request, Response } from "express";
import { ItemService } from "../../services/admin/item.service";

export class ItemController {
  static async getAll(_req: Request, res: Response) {
    const items = await ItemService.getAll();
    res.json(items);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const item = await ItemService.getById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
    return;
  }

  static async create(req: Request, res: Response) {
    const item = await ItemService.create(req.body);
    res.status(201).json(item);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const item = await ItemService.update(id, req.body);
    res.json(item);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await ItemService.remove(id);
    res.json({ success: true });
  }
}
