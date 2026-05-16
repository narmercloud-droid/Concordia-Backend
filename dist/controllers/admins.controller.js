import { adminService } from "../services/admins.service.js";
import { success, fail } from "./controllerHelper.js";
import { adminLoginSchema, adminRefreshSchema } from "../validation/auth.schema.js";
import { adminEntityBodySchema } from "../validation/admin.schema.js";
import { idParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const AdminController = {
    create: async (req, res, next) => {
        try {
            const parsed = adminEntityBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const admin = await adminService.createAdmin(parsed.data);
            return success(res, admin, "Admin created", 201);
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    login: async (req, res, next) => {
        try {
            const parsed = adminLoginSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { email, password } = parsed.data;
            const admin = await adminService.getAdminByEmail(email);
            if (!admin)
                return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
            const valid = await adminService.validatePassword(password, admin.password);
            if (!valid)
                return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
            const tokens = await adminService.generateTokens(admin);
            return success(res, { admin, ...tokens }, "Login successful");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const parsed = adminRefreshSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            if (!parsed.data.refreshToken) {
                return fail(res, "INVALID_CREDENTIALS", "Missing token", 401);
            }
            return fail(res, "FORBIDDEN", "Invalid token", 403);
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    getById: async (req, res, next) => {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const admin = await adminService.getAdminById(parsed.data.id);
            return success(res, admin, "Admin fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    list: async (req, res, next) => {
        try {
            const admins = await adminService.listAdmins();
            return success(res, admins, "Admins listed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    update: async (req, res, next) => {
        try {
            const parsedBody = adminEntityBodySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const admin = await adminService.updateAdmin(parsedParams.data.id, parsedBody.data);
            return success(res, admin, "Admin updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    delete: async (req, res, next) => {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const admin = await adminService.deleteAdmin(parsed.data.id);
            return success(res, admin, "Admin deleted");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
