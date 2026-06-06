import { validateCourierToken } from "../../services/courier/courierToken.service.js";
import { broadcastToCourier } from "../../services/realtime/realtime.service.js";
import { success, fail } from "../controllerHelper.js";
export const getCourierOrderView = async (req, res) => {
    try {
        const token = req.query.token;
        const order = await validateCourierToken(token);
        if (!order) {
            return fail(res, "Invalid or expired token", 401);
        }
        const response = {
            orderId: order.id,
            status: order.status,
            courierStatus: order.courierStatus,
            customer: {
                name: order.customer?.name,
                phone: order.customer?.phone
            },
            address: order.customer?.addresses?.[0] || null,
            items: order.items.map(i => ({
                name: i.item.name,
                quantity: i.quantity,
                notes: i.notes,
                price: i.price
            })),
            branch: {
                name: order.branch.name,
                address: order.branch.address || null,
                lat: order.branch.lat ?? null,
                lng: order.branch.lng ?? null
            },
            navigationUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer?.addresses?.[0]?.street || "")}`
        };
        broadcastToCourier(token, "connected", { ok: true });
        return success(res, response);
    }
    catch (err) {
        console.error(err);
        return fail(res, "Server error", 500);
    }
};
