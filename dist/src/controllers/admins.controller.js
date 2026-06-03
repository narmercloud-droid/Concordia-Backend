import { adminService } from "../services/admins.service.js";
import { success, fail } from "./controllerHelper.js";
export const AdminController = {
    create: async (req, res, next) => {
        try {
            const admin = await adminService.createAdmin(req.body);
            return success(res, admin);
        }
        catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const admin = await adminService.getAdminByEmail(req.body.email);
            if (!admin)
                return fail(res, "Invalid credentials", 401);
            const valid = await adminService.validatePassword(req.body.password, admin.password);
            if (!valid)
                return fail(res, "Invalid credentials", 401);
            const tokens = await adminService.generateTokens(admin);
            return success(res, { admin, ...tokens });
        }
        catch (err) {
            next(err);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return fail(res, "Missing token", 401);
            // Admin model in prisma/schema.prisma has no refreshToken field.
            // Reject to avoid Prisma type mismatch.
            return fail(res, "Invalid token", 403);
        }
        catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        try {
            const admin = await adminService.getAdminById(req.params.id);
            return success(res, admin);
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const admins = await adminService.listAdmins();
            return success(res, admins);
        }
        catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const admin = await adminService.updateAdmin(req.params.id, req.body);
            return success(res, admin);
        }
        catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const admin = await adminService.deleteAdmin(req.params.id);
            return success(res, admin);
        }
        catch (err) {
            next(err);
        }
    }
};
