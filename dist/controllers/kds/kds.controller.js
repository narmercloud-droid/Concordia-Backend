import { KdsService } from "../../services/kds/kds.service.js";
import { success, fail } from "../controllerHelper.js";
import { kdsUpdateStatusSchema } from "../../validation/kds.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const KdsController = {
    getOrders: async (req, res, next) => {
        try {
            const kds = req.user;
            const orders = await KdsService.getActiveOrders(kds.branchId);
            return success(res, { orders }, "KDS orders fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const parsed = kdsUpdateStatusSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { orderId, status } = parsed.data;
            const kds = req.user;
            const order = await KdsService.updateStatus(orderId, status);
            req.app
                .get("io")
                .to(`branch_${kds.branchId}`)
                .emit("order_status_updated", order);
            req.app
                .get("io")
                .to(`customer_${order.id}`)
                .emit("order_update", order);
            return success(res, { success: true, order }, "Order status updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
