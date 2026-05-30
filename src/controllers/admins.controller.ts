import type { Request, Response, NextFunction  } from "express";
import { adminService } from "../services/admins.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";

export const AdminController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await adminService.createAdmin(req.body);
      return success(res, admin);
    } catch (err: unknown) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await adminService.getAdminByEmail(req.body.email);
      if (!admin) return fail(res, "Invalid credentials", 401);

      const valid = await adminService.validatePassword(
        req.body.password,
        admin.password
      );
      if (!valid) return fail(res, "Invalid credentials", 401);

      const tokens = await adminService.generateTokens(admin);
      return success(res, { admin, ...tokens });
    } catch (err: unknown) {
      next(err);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return fail(res, "Missing token", 401);

      // Admin model in prisma/schema.prisma has no refreshToken field.
      // Reject to avoid Prisma type mismatch.
      return fail(res, "Invalid token", 403);
    } catch (err: unknown) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await adminService.getAdminById(req.params.id);
      return success(res, admin);
    } catch (err: unknown) {
      next(err);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await adminService.listAdmins();
      return success(res, admins);
    } catch (err: unknown) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await adminService.updateAdmin(req.params.id, req.body);
      return success(res, admin);
    } catch (err: unknown) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await adminService.deleteAdmin(req.params.id);
      return success(res, admin);
    } catch (err: unknown) {
      next(err);
    }
  }
};







