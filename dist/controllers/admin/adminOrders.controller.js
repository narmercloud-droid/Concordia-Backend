import { AdminOrdersService } from "../../services/admin/adminOrders.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminOrderFiltersSchema, adminOrderStatusSchema, adminAssignCourierSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class AdminOrdersController {
    static async getAll(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = adminOrderFiltersSchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const filters = {
                ...parsed.data,
                startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
                endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
            };
            const orders = await AdminOrdersService.getAll(branchId, filters);
            return success(res, orders, "Orders fetched");
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
            const order = await AdminOrdersService.getById(parsed.data.id, branchId);
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            return success(res, order, "Order fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = adminOrderStatusSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const order = await AdminOrdersService.updateStatus(parsedParams.data.id, branchId, parsedBody.data.status, parsedBody.data.estimatedTime);
            return success(res, order, "Order status updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async assignCourier(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = adminAssignCourierSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const order = await AdminOrdersService.assignCourier(parsedParams.data.id, branchId, parsedBody.data.courierId);
            return success(res, order, "Courier assigned");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
