import { Request, Response, NextFunction } from "express";
import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
import { success, fail } from "../controllerHelper.js";

export class TerminalStatusController {
  static async getTerminalStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = await TerminalStatusService.getTerminalStatus();
      return success(res, status, "Terminal status fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
