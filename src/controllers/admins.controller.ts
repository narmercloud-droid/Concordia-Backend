import type { Request } from "express";
import { adminService } from "../services/admins.service.ts";
import { wrap, fail } from "../contracts/api.js";

export const AdminController = {
  create: wrap(async (req: Request) => {
    const admin = await adminService.createAdmin(req.body);
    return admin;
  }),

  login: wrap(async (req: Request) => {
    const admin = await adminService.getAdminByEmail(req.body.email);
    if (!admin) throw fail('UNAUTHORIZED', 'Invalid credentials');

    const valid = await adminService.validatePassword(req.body.password, admin.password);
    if (!valid) throw fail('UNAUTHORIZED', 'Invalid credentials');

    const tokens = await adminService.generateTokens(admin);
    return { admin, ...tokens };
  }),

  refresh: wrap(async (req: Request) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw fail('UNAUTHORIZED', 'Missing token');

    // Admin model in prisma/schema.prisma has no refreshToken field.
    // Reject to avoid Prisma type mismatch.
    throw fail('FORBIDDEN', 'Invalid token');
  }),

  getById: wrap(async (req: Request) => {
    const admin = await adminService.getAdminById(req.params.id);
    return admin;
  }),

  list: wrap(async () => {
    const admins = await adminService.listAdmins();
    return admins;
  }),

  update: wrap(async (req: Request) => {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    return admin;
  }),

  delete: wrap(async (req: Request) => {
    const admin = await adminService.deleteAdmin(req.params.id);
    return admin;
  })
};







