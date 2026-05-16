import { managerDashboardService } from "../services/managerDashboard.service.js";
import { success, fail } from "./controllerHelper.js";
import { managerItemAvailabilitySchema, managerScheduleUpdateSchema, managerOrdersQuerySchema } from "../validation/managerDashboard.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const ManagerDashboardController = {
    menu: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const data = await managerDashboardService.menu(branchId);
            return success(res, data, "Manager menu loaded");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    setItemAvailability: async (req, res, next) => {
        try {
            const parsed = managerItemAvailabilitySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const branchId = req.user.branchId;
            const { itemId, available } = parsed.data;
            await managerDashboardService.setItemAvailability(branchId, itemId, available);
            return success(res, { success: true }, "Item availability updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    orders: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const parsed = managerOrdersQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { status } = parsed.data;
            const data = await managerDashboardService.orders(branchId, status);
            return success(res, data, "Orders fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    couriers: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const data = await managerDashboardService.couriers(branchId);
            return success(res, data, "Couriers fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    terminals: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const data = await managerDashboardService.terminals(branchId);
            return success(res, data, "Terminals fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    getSchedule: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const data = await managerDashboardService.getSchedule(branchId);
            return success(res, data, "Schedule fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    updateSchedule: async (req, res, next) => {
        try {
            const parsed = managerScheduleUpdateSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const branchId = req.user.branchId;
            await managerDashboardService.updateSchedule(branchId, parsed.data);
            return success(res, { success: true }, "Schedule updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
