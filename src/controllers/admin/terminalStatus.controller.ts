import { Request, Response, NextFunction } from "express";
import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";

export class TerminalStatusController {
  // -----------------------------------------------------
  // GET TERMINAL STATUS
  // -----------------------------------------------------
  static async getTerminalStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = await TerminalStatusService.getTerminalStatus();
      res.json(status);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }
}

