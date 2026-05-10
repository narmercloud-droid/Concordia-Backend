import { Request, Response } from "express";
import { MenuService } from "../services/menu.service";

export class MenuController {
  static async getMenu(req: Request, res: Response) {
    try {
      const menu = await MenuService.getFullMenu();
      res.status(200).json(menu);
    } catch (error) {
      console.error("Menu fetch error:", error);
      res.status(500).json({ error: "Failed to load menu" });
    }
  }
}
