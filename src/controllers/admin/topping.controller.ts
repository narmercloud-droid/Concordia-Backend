import { Request, Response } from "express";
import { ToppingService } from "../../services/admin/topping.service";

export class ToppingController {
  static async getAll(_req: Request, res: Response) {
    const toppings = await ToppingService.getAll();
    res.json(toppings);
    return;
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const topping = await ToppingService.getById(id);

    if (!topping) {
      return res.status(404).json({ error: "Topping not found" });
    }

    res.json(topping);
    return;
  }

  static async create(req: Request, res: Response) {
    const topping = await ToppingService.create(req.body);
    res.status(201).json(topping);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const topping = await ToppingService.update(id, req.body);
    res.json(topping);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await ToppingService.remove(id);
    res.json({ success: true });
  }
}
