import type { Request, Response, NextFunction  } from "express";
import { TerminalService } from "../../services/terminal/terminal.service.js";
import { success, fail } from "../controllerHelper.js";

export class TerminalController {
  static async activate(req: Request, res: Response, next: NextFunction) {
    const { branchId } = req.body;

    if (!branchId) {
      return fail(res, "branchId is required", 400);
    }

    try {
      const activationToken = await TerminalService.activateTerminal(branchId);
      return success(res, { token: activationToken });
    } catch (err: any) {
      const status = err.message === "Branch not found" ? 404 : 500;
      return fail(res, err.message || "Failed to generate terminal activation token", status);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    const { activation_token, terminal_name } = req.body;

    if (!activation_token || !terminal_name) {
      return fail(res, "activation_token and terminal_name are required", 400);
    }

    try {
      const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
      return success(res, { terminal_id: terminal.id, branchId: terminal.branchId }, "Created", 201);
    } catch (err: any) {
      let status = 400;
      if (err.message === "Branch not found") status = 404;
      if (err.message === "Terminal has already been registered") status = 409;
      return fail(res, err.message || "Failed to register terminal", status);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { terminal_token } = req.body;

    if (!terminal_token) {
      return fail(res, "terminal_token is required", 400);
    }

    try {
      const terminal = await TerminalService.loginTerminal(terminal_token);
      return success(res, { terminal_id: terminal.id, branchId: terminal.branchId });
    } catch (err: any) {
      return fail(res, err.message || "Failed to login terminal", 401);
    }
  }

  static async acknowledgeOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
      return success(res, order);
    } catch (err: any) {
      return fail(res, err.message, 400);
    }
  }

  static async assignOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      await TerminalService.assignOrder(order_id, terminal_id);
      return success(res, { status: "assigned" });
    } catch (err: any) {
      return fail(res, err.message, 400);
    }
  }

  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.acceptOrder(order_id, terminal_id);
      return success(res, order);
    } catch (err: any) {
      return fail(res, err.message, 400);
    }
  }

  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.rejectOrder(order_id, terminal_id);
      return success(res, order);
    } catch (err: any) {
      return fail(res, err.message, 400);
    }
  }

  static async heartbeat(req: Request, res: Response, next: NextFunction) {
    const terminal_id = req.user?.id as string;

    try {
      await TerminalService.updateHeartbeat(terminal_id);
      return success(res, { status: "ok" });
    } catch (err: any) {
      return fail(res, err.message, 500);
    }
  }

  static async ordersStream(req: Request, res: Response, next: NextFunction) {
    return fail(res, "Not implemented", 501);
  }
}





