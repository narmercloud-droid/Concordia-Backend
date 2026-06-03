import type { Request } from "express";
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.ts";
import { wrap } from "../../contracts/api.js";

export class TerminalAdminController {
  // -----------------------------------------------------
  // GET ALL TERMINALS
  // -----------------------------------------------------
  static getAllTerminals = wrap(async (_req: Request) => {
    const terminals = await TerminalAdminService.getAllTerminals();
    return terminals;
  });

  // -----------------------------------------------------
  // GET TERMINAL ACTIVITY
  // -----------------------------------------------------
  static getTerminalActivity = wrap(async (_req: Request) => {
    const activity = await TerminalAdminService.getTerminalActivity();
    return activity;
  });
}






