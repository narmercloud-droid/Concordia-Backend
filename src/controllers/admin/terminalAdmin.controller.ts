import { Request, Response, NextFunction } from "express";
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
import { success, fail } from "../controllerHelper.js";

export class TerminalAdminController {
  static async getAllTerminals(_req: Request, res: Response, next: NextFunction) {
    try {
      const terminals = await TerminalAdminService.getAllTerminals();

      return success(res, terminals, "Terminals listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async getTerminalActivity(_req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await TerminalAdminService.getTerminalActivity();

      return success(res, activity, "Terminal activity fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
