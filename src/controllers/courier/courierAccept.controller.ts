import { acceptCourierOrder } from "../../services/courier/courierDriver.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const acceptCourierOrderHandler = wrap(async (req) => {
  try {
    const token = (req.body.token ?? req.query.token) as string;
    if (!token) {
      throw fail("INVALID_INPUT", "token is required");
    }

    return await acceptCourierOrder(token);
  } catch (err: any) {
    console.error(err);
    if (err?.message === "Invalid or expired driver link") {
      throw fail("UNAUTHORIZED", err.message);
    }
    throw fail("INTERNAL_ERROR", err?.message ?? "Server error");
  }
});
