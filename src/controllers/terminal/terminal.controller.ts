import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../globalTypes.js";
import { TerminalService } from "../../services/terminal/terminal.service.js";
import { success, fail } from "../controllerHelper.js";
import {
  terminalActivateSchema,
  terminalRegisterSchema,
  terminalLoginSchema,
  terminalOrderIdParamSchema
} from "../../validation/terminal.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class TerminalController {
  static async activate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsed = terminalActivateSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;
      const activationToken = await TerminalService.activateTerminal(branchId);
      return success(res, { token: activationToken }, "Activation token created");
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message === "Branch not found") {
        return fail(res, "NOT_FOUND", message, 404);
      }
      return fail(res, "UNKNOWN_ERROR", message || "Failed to generate terminal activation token", 500);
    }
  }

  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsed = terminalRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { activation_token, terminal_name } = parsed.data;
      const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
      return success(
        res,
        { terminal_id: terminal.id, branchId: terminal.branchId },
        "Terminal registered",
        201
      );
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message === "Branch not found") return fail(res, "NOT_FOUND", message, 404);
      if (message === "Terminal has already been registered") {
        return fail(res, "CONFLICT", message, 409);
      }
      return fail(res, "UNKNOWN_ERROR", message || "Failed to register terminal", 400);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsed = terminalLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { terminal_token } = parsed.data;
      const terminal = await TerminalService.loginTerminal(terminal_token);
      return success(res, { terminal_id: terminal.id, branchId: terminal.branchId }, "Terminal logged in");
    } catch (err: unknown) {
      return fail(res, "UNAUTHORIZED", (err as Error).message || "Failed to login terminal", 401);
    }
  }

  static async acknowledgeOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsedParams = terminalOrderIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const terminal_id = req.user?.id as string;
      const order = await TerminalService.acknowledgeOrder(parsedParams.data.order_id, terminal_id);
      return success(res, order, "Order acknowledged");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 400);
    }
  }

  static async assignOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsedParams = terminalOrderIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const terminal_id = req.user?.id as string;
      await TerminalService.assignOrder(parsedParams.data.order_id, terminal_id);
      return success(res, { status: "assigned" }, "Order assigned");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 400);
    }
  }

  static async acceptOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsedParams = terminalOrderIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const terminal_id = req.user?.id as string;
      const order = await TerminalService.acceptOrder(parsedParams.data.order_id, terminal_id);
      return success(res, order, "Order accepted");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 400);
    }
  }

  static async rejectOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsedParams = terminalOrderIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const terminal_id = req.user?.id as string;
      const order = await TerminalService.rejectOrder(parsedParams.data.order_id, terminal_id);
      return success(res, order, "Order rejected");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 400);
    }
  }

  static async heartbeat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const terminal_id = req.user?.id as string;
      await TerminalService.updateHeartbeat(terminal_id);
      return success(res, { status: "ok" }, "Heartbeat OK");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async ordersStream(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return fail(res, "NOT_IMPLEMENTED", "Not implemented", 501);
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
