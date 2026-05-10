import { Request, Response } from "express";
import { DealService } from "../../services/admin/deal.service";

export class DealController {
  static async getAll(_req: Request, res: Response) {
    const deals = await DealService.getAll();
    res.json(deals);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deal = await DealService.getById(id);

    if (!deal) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json(deal);
    return;
  }

  static async create(req: Request, res: Response) {
    const deal = await DealService.create(req.body);
    res.status(201).json(deal);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deal = await DealService.update(id, req.body);
    res.json(deal);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await DealService.remove(id);
    res.json({ success: true });
  }

  static async addItem(req: Request, res: Response) {
    const dealId = Number(req.params.dealId);
    const { itemId } = req.body;

    const result = await DealService.addItem(dealId, itemId);
    res.status(201).json(result);
  }

  static async removeItem(req: Request, res: Response) {
    const dealId = Number(req.params.dealId);
    const itemId = Number(req.params.itemId);

    await DealService.removeItem(dealId, itemId);
    res.json({ success: true });
  }
}
