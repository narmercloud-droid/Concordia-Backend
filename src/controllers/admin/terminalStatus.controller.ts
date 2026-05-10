import { Request, Response } from "express";
import { TerminalStatusService } from "../../services/admin/terminalStatus.service";

export class TerminalStatusController {
  // -----------------------------------------------------
  // GET TERMINAL STATUS
  // -----------------------------------------------------
  static async getTerminalStatus(_req: Request, res: Response) {
    try {
      const status = await TerminalStatusService.getTerminalStatus();
      res.json(status);
      return;
    } catch (err: any) {
      res.status(500).json({ error: err.message });
      return;
    }
  }
}