import { Request, Response } from "express";
import { RelationService } from "../../services/admin/relation.service";

export class RelationController {
  static async getItemRelations(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const relations = await RelationService.getItemRelations(itemId);
    res.json(relations);
  }

  static async addVariant(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const { variantId } = req.body;

    const result = await RelationService.addVariant(itemId, variantId);
    res.status(201).json(result);
  }

  static async addTopping(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const { toppingId } = req.body;

    const result = await RelationService.addTopping(itemId, toppingId);
    res.status(201).json(result);
  }

  static async addExtra(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const { extraId } = req.body;

    const result = await RelationService.addExtra(itemId, extraId);
    res.status(201).json(result);
  }

  static async removeVariant(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const variantId = Number(req.params.variantId);

    await RelationService.removeVariant(itemId, variantId);
    res.json({ success: true });
  }

  static async removeTopping(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const toppingId = Number(req.params.toppingId);

    await RelationService.removeTopping(itemId, toppingId);
    res.json({ success: true });
  }

  static async removeExtra(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const extraId = Number(req.params.extraId);

    await RelationService.removeExtra(itemId, extraId);
    res.json({ success: true });
  }
}
