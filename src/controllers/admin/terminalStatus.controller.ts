import type { Request } from "express";
import { TerminalStatusService } from "../../services/admin/terminalStatus.service.ts";
import { wrap } from "../../contracts/api.js";

export class TerminalStatusController {
  // -----------------------------------------------------
  // GET TERMINAL STATUS
  // -----------------------------------------------------
  static getTerminalStatus = wrap(async (_req: Request) => {
    const status = await TerminalStatusService.getTerminalStatus();
    return status;
  });
}






