import { computeOrderETA } from '../../services/eta/eta.service.js';

export async function getOrderETA(req, res) {
  const { orderId } = req.params;

  const eta = await computeOrderETA(orderId);

  res.json(eta);
}
