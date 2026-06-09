import { validateCourierToken } from "../../services/courier/courierToken.service.js";
import { buildCourierOrderView } from "../../services/courier/courierDriver.service.js";
import { broadcastToCourier } from "../../services/realtime/realtime.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const getCourierOrderView = wrap(async (req) => {
    try {
        const token = req.query.token;
        const order = await validateCourierToken(token);
        if (!order) {
            throw fail("UNAUTHORIZED", "Invalid or expired token");
        }
        broadcastToCourier(token, "connected", { ok: true });
        return buildCourierOrderView(order);
    }
    catch (err) {
        console.error(err);
        throw fail("INTERNAL_ERROR", "Server error");
    }
});
