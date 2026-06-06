import { AdminCustomersService } from "../../services/admin/adminCustomers.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminCustomerFiltersSchema, adminCustomerUpdateSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class AdminCustomersController {
    static async getAll(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = adminCustomerFiltersSchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const customers = await AdminCustomersService.getAll(branchId, parsed.data);
            return success(res, customers, "Customers fetched");
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
            const customer = await AdminCustomersService.getById(parsed.data.id, branchId);
            if (!customer) {
                return fail(res, "NOT_FOUND", "Customer not found", 404);
            }
            return success(res, customer, "Customer fetched");
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
            const parsedBody = adminCustomerUpdateSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const customer = await AdminCustomersService.update(parsedParams.data.id, branchId, parsedBody.data);
            return success(res, customer, "Customer updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async toggleBan(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const customer = await AdminCustomersService.toggleBan(parsed.data.id, branchId);
            return success(res, customer, "Customer ban status toggled");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getOrderHistory(req, res, next) {
        try {
            const branchId = req.user?.branchId;
            if (!branchId) {
                return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
            }
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const orders = await AdminCustomersService.getOrderHistory(parsed.data.id, branchId);
            return success(res, orders, "Order history fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
