import { Request, Response } from "express";
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service";

export class TerminalAdminController {
  // -----------------------------------------------------
  // GET ALL TERMINALS
  // -----------------------------------------------------
  static async getAllTerminals(_req: Request, res: Response) {
    try {
      const terminals = await TerminalAdminService.getAllTerminals();

      res.json(terminals);
      return;
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch terminals" });
      return;
    }
  }

  // -----------------------------------------------------
  // GET TERMINAL ACTIVITY
  // -----------------------------------------------------
  static async getTerminalActivity(_req: Request, res: Response) {
    try {
      const activity = await TerminalAdminService.getTerminalActivity();

      res.json(activity);
      return;
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch terminal activity" });
      return;
    }
  }
}