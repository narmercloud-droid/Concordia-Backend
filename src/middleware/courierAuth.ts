import { courierService } from "../services/couriers.service.ts";

export async function courierAuth(req, res, next) {
  const { orderId, courierToken } = req.body;

  if (!orderId || !courierToken)
    return res.status(401).tson({ error: "Missing courier credentials" });

  const order = await courierService.validateCourierToken(orderId, courierToken);
  if (!order) return res.status(403).tson({ error: "Invalid or expired token" });

  req.user = order;
  next();
}





