import { Request, Response, NextFunction } from "express";
import { TerminalService } from "../../services/terminal/terminal.service.js";

export class TerminalController {
  static async activate(req: Request, res: Response, next: NextFunction) {
    const { branchId } = req.body;

    if (!branchId) {
      return res.status(400).json({ error: "branchId is required" });
    }

    try {
      const activationToken = await TerminalService.activateTerminal(branchId);
      res.json({ token: activationToken });
    } catch (err: any) {
      const status = err.message === "Branch not found" ? 404 : 500;
      res.status(status).json({ error: err.message || "Failed to generate terminal activation token" });
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    const { activation_token, terminal_name } = req.body;

    if (!activation_token || !terminal_name) {
      return res.status(400).json({ error: "activation_token and terminal_name are required" });
    }

    try {
      const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
      res.status(201).json({ terminal_id: terminal.id, branchId: terminal.branchId });
    } catch (err: any) {
      let status = 400;
      if (err.message === "Branch not found") status = 404;
      if (err.message === "Terminal has already been registered") status = 409;
      res.status(status).json({ error: err.message || "Failed to register terminal" });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { terminal_token } = req.body;

    if (!terminal_token) {
      return res.status(400).json({ error: "terminal_token is required" });
    }

    try {
      const terminal = await TerminalService.loginTerminal(terminal_token);
      res.json({ terminal_id: terminal.id, branchId: terminal.branchId });
    } catch (err: any) {
      res.status(401).json({ error: err.message || "Failed to login terminal" });
    }
  }

  static async acknowledgeOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async assignOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      await TerminalService.assignOrder(order_id, terminal_id);
      res.json({ status: "assigned" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.acceptOrder(order_id, terminal_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    try {
      const order = await TerminalService.rejectOrder(order_id, terminal_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async heartbeat(req: Request, res: Response, next: NextFunction) {
    const terminal_id = req.user?.id as string;

    try {
      await TerminalService.updateHeartbeat(terminal_id);
      res.json({ status: "ok" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async ordersStream(req: Request, res: Response, next: NextFunction) {
    res.status(501).json({ error: "Not implemented" });
  }
}
