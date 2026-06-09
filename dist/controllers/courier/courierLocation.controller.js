import { updateDriverLocation } from "../../services/courier/courierDriver.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const updateCourierLocation = wrap(async (req) => {
    try {
        const { token, lat, lng, accuracy } = req.body;
        if (!token || lat == null || lng == null) {
            throw fail("INVALID_INPUT", "token, lat, and lng are required");
        }
        return await updateDriverLocation(token, Number(lat), Number(lng), accuracy);
    }
    catch (err) {
        console.error(err);
        if (err?.message === "Invalid or expired driver link") {
            throw fail("UNAUTHORIZED", err.message);
        }
        if (err?.message === "Driver must accept the order before sharing location") {
            throw fail("FORBIDDEN", err.message);
        }
        throw fail("INTERNAL_ERROR", err?.message ?? "Server error");
    }
});
