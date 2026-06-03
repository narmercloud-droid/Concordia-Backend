import { KdsService } from "../../services/kds/kds.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const KdsController = {
    getOrders: wrap(async (req) => {
        const kds = req.user;
        const orders = await KdsService.getActiveOrders(kds.branchId);
        return { orders };
    }),
    updateStatus: wrap(async (req) => {
        const { orderId, status } = req.body;
        const kds = req.user;
        const valid = ["preparing", "ready", "completed"];
        if (!valid.includes(status)) {
            throw fail('INVALID_INPUT', 'Invalid status');
        }
        const order = await KdsService.updateStatus(orderId, status);
        req.app
            .get("io")
            .to(`branch_${kds.branchId}`)
            .emit("order_status_updated", order);
        req.app
            .get("io")
            .to(`customer_${order.id}`)
            .emit("order_update", order);
        return { success: true, order };
    })
};
