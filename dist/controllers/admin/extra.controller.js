import { ExtraService } from "../../services/admin/extra.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminEntityBodySchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class ExtraController {
    static async getAll(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const extras = await ExtraService.getAll(branchId);
            return success(res, extras, "Extras listed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getById(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const extra = await ExtraService.getById(parsed.data.id, branchId);
            if (!extra) {
                return fail(res, "NOT_FOUND", "Extra not found", 404);
            }
            return success(res, extra, "Extra fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async create(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = adminEntityBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const extra = await ExtraService.create(branchId, parsed.data);
            return success(res, extra, "Extra created", 201);
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async update(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = adminEntityBodySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const extra = await ExtraService.update(parsedParams.data.id, branchId, parsedBody.data);
            return success(res, extra, "Extra updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async remove(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            await ExtraService.remove(parsed.data.id, branchId);
            return success(res, { success: true }, "Extra removed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
