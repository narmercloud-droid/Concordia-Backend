import { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../../services/admin/adminAuth.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminRegisterSchema, adminLoginSchema, adminRefreshSchema } from "../../validation/admin.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

const adminAuthService = new AdminAuthService();

export const AdminAuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = adminRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const admin = await adminAuthService.register(parsed.data);
      return success(res, admin, "Admin registered successfully", 201);
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { email, password } = parsed.data;
      const tokens = await adminAuthService.login(email, password);
      if (!tokens) return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
      return success(res, tokens, "Login successful");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = adminRefreshSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { refreshToken } = parsed.data;
      const tokens = await adminAuthService.refresh(refreshToken);
      if (!tokens) return fail(res, "INVALID_TOKEN", "Invalid token", 403);
      return success(res, tokens, "Token refreshed successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  profile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = (req as any).user?.id;
      if (!adminId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const profile = await adminAuthService.getProfile(adminId);
      if (!profile) return fail(res, "NOT_FOUND", "Profile not found", 404);
      return success(res, profile, "Profile fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};