import { getBranchAnalytics } from '../../services/analytics/analytics.service.js';

export async function getAnalytics(req, res) {
  const { branchId } = req.params;

  const data = await getBranchAnalytics(branchId);

  res.json(data);
}
