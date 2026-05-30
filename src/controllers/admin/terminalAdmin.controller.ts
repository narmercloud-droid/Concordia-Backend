import type { Request, Response, NextFunction  } from "express";
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
import { success } from "../controllerHelper.js";

export class TerminalAdminController {
  // -----------------------------------------------------
  // GET ALL TERMINALS
  // -----------------------------------------------------
  static async getAllTerminals(_req: Request, res: Response, next: NextFunction) {
    try {
      const terminals = await TerminalAdminService.getAllTerminals();
      return success(res, terminals);
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
      return success(res, activity);
    } catch (err: unknown) {
      next(err);
    }
  }
}






