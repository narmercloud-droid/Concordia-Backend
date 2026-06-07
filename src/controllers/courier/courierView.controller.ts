import { validateCourierToken } from "../../services/courier/courierToken.service.ts";
import { buildCourierOrderView } from "../../services/courier/courierDriver.service.ts";
import { broadcastToCourier } from "../../services/realtime/realtime.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const getCourierOrderView = wrap(async (req) => {
  try {
    const token = req.query.token as string;
    const order = await validateCourierToken(token);

    if (!order) {
      throw fail("UNAUTHORIZED", "Invalid or expired token");
    }

    broadcastToCourier(token, "connected", { ok: true });
    return buildCourierOrderView(order);
  } catch (err) {
    console.error(err);
    throw fail("INTERNAL_ERROR", "Server error");
  }
});
