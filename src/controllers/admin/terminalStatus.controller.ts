import type { Request, Response, NextFunction  } from "express";
import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
import { success } from "../controllerHelper.js";

export class TerminalStatusController {
  // -----------------------------------------------------
  // GET TERMINAL STATUS
  // -----------------------------------------------------
  static async getTerminalStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = await TerminalStatusService.getTerminalStatus();
      return success(res, status);
    } catch (err: unknown) {
      next(err);
    }
  }
}






