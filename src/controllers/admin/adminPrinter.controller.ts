import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.js";
import { success } from "../controllerHelper.js";

export const reprintKitchenTickets = async (req, res) => {
  const { orderId } = req.params;
  await routeOrderToKitchens(orderId);
  return success(res, { success: true });
};

