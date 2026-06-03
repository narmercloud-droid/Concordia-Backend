import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.ts";
import { wrap } from "../../contracts/api.js";

export const reprintKitchenTickets = wrap(async (req) => {
  const { orderId } = req.params;
  await routeOrderToKitchens(orderId);
  return { success: true };
});

