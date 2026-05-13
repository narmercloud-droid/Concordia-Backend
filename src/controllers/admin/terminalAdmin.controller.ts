import { Request, Response, NextFunction } from "express";
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";

export class TerminalAdminController {
  // -----------------------------------------------------
  // GET ALL TERMINALS
  // -----------------------------------------------------
  static async getAllTerminals(_req: Request, res: Response, next: NextFunction) {
    try {
      const terminals = await TerminalAdminService.getAllTerminals();

      res.json(terminals);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // GET TERMINAL ACTIVITY
  // -----------------------------------------------------
  static async getTerminalActivity(_req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await TerminalAdminService.getTerminalActivity();

      res.json(activity);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }
}

