import { Request, Response } from "express";
import { VariantService } from "../../services/admin/variant.service";

export class VariantController {
  static async getAll(_req: Request, res: Response) {
    const variants = await VariantService.getAll();
    res.json(variants);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const variant = await VariantService.getById(id);

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json(variant);
    return;
  }

  static async create(req: Request, res: Response) {
    const variant = await VariantService.create(req.body);
    res.status(201).json(variant);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const variant = await VariantService.update(id, req.body);
    res.json(variant);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await VariantService.remove(id);
    res.json({ success: true });
  }
}
