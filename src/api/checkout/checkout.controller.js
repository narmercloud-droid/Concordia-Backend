import { selectBestBranch } from '../../services/branchSelection.service.js';

export async function validateCheckout(req, res) {
  try {
    const { lat, lng, orderTotal } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing coordinates (lat, lng)' });
    }

    const customer = { lat, lng };
    const result = await selectBestBranch(customer, orderTotal);

    return res.json(result);

  } catch (error) {
    console.error('Checkout validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
