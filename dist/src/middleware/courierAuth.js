import { courierService } from "../services/couriers.service.js";
export async function courierAuth(req, res, next) {
    const { orderId, courierToken } = req.body;
    if (!orderId || !courierToken)
        return res.status(401).json({ error: "Missing courier credentials" });
    const order = await courierService.validateCourierToken(orderId, courierToken);
    if (!order)
        return res.status(403).json({ error: "Invalid or expired token" });
    req.order = order;
    next();
}
