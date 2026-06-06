import { selectBestBranch } from '../../services/branchSelection.service.js';

export async function selectBranch(req, res) {
  try {
    const { address, lat, lng, orderTotal } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing coordinates (lat, lng)' });
    }

    const customer = { lat, lng };
    const result = await selectBestBranch(customer, orderTotal);

    return res.json(result);

  } catch (error) {
    console.error('Branch selection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
