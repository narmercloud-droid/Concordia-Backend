import { validatePromo, applyPromo } from '../../services/promo/promo.service.js';

export async function applyPromoCode(req, res) {
  const { orderId, code } = req.body;

  const result = await validatePromo(orderId, code);

  if (!result.valid) {
    return res.status(400).json({ error: result.reason });
  }

  const applied = await applyPromo(orderId, result.promo, result.discount);

  res.json(applied);
}
