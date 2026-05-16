import { analyticsService } from "../services/analytics.service.js";
import { success, fail } from "./controllerHelper.js";
import { analyticsBranchQuerySchema } from "../validation/analytics.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const AnalyticsController = {
    totalRevenue: async (req, res, next) => {
        try {
            const parsed = analyticsBranchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId } = parsed.data;
            const data = await analyticsService.totalRevenue(branchId);
            return success(res, data, "Total revenue fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    ordersPerDay: async (req, res, next) => {
        try {
            const parsed = analyticsBranchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId } = parsed.data;
            const data = await analyticsService.ordersPerDay(branchId);
            return success(res, data, "Orders per day fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    bestSellingItems: async (req, res, next) => {
        try {
            const parsed = analyticsBranchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId } = parsed.data;
            const data = await analyticsService.bestSellingItems(branchId);
            return success(res, data, "Best selling items fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    customerStats: async (req, res, next) => {
        try {
            const data = await analyticsService.customerStats();
            return success(res, data, "Customer stats fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    courierPerformance: async (req, res, next) => {
        try {
            const data = await analyticsService.courierPerformance();
            return success(res, data, "Courier performance fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    hourlyOrders: async (req, res, next) => {
        try {
            const parsed = analyticsBranchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId } = parsed.data;
            const data = await analyticsService.hourlyOrders(branchId);
            return success(res, data, "Hourly orders fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
