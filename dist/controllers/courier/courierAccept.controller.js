import { acceptCourierOrder } from "../../services/courier/courierDriver.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const acceptCourierOrderHandler = wrap(async (req) => {
    try {
        const token = (req.body.token ?? req.query.token);
        if (!token) {
            throw fail("INVALID_INPUT", "token is required");
        }
        return await acceptCourierOrder(token);
    }
    catch (err) {
        console.error(err);
        if (err?.message === "Invalid or expired driver link") {
            throw fail("UNAUTHORIZED", err.message);
        }
        throw fail("INTERNAL_ERROR", err?.message ?? "Server error");
    }
});
