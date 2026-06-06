import type { Request } from "express";
import { AdminAuthService } from "../../services/admin/adminAuth.service.ts";
import { wrap, fail } from "../../contracts/api.js";
import { adminRegisterSchema, adminLoginSchema, adminRefreshSchema } from "../../validation/admin.schema.ts";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

const adminAuthService = new AdminAuthService();

export const AdminAuthController = {
  register: wrap(async (req: Request) => {
    const parsed = adminRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    }
    const admin = await adminAuthService.register(parsed.data);
    return admin;
  }),

  login: wrap(async (req: Request) => {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    }
    const { email, password } = parsed.data;
    const tokens = await adminAuthService.login(email, password);
    if (!tokens) throw fail('INVALID_CREDENTIALS', 'Invalid credentials');
    return tokens;
  }),

  refresh: wrap(async (req: Request) => {
    const parsed = adminRefreshSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    }
    const { refreshToken } = parsed.data;
    const tokens = await adminAuthService.refresh(refreshToken);
    if (!tokens) throw fail('INVALID_TOKEN', 'Invalid token');
    return tokens;
  }),

  profile: wrap(async (req: Request) => {
    const adminId = (req as any).user?.id;
    if (!adminId) throw fail('UNAUTHORIZED', 'Unauthorized');
    const profile = await adminAuthService.getProfile(adminId);
    if (!profile) throw fail('NOT_FOUND', 'Profile not found');
    return profile;
  })
};




