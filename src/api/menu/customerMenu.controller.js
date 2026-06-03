import { getCustomerMenu } from '../../services/menu/customerMenu.service.js';

export async function fetchCustomerMenu(req, res) {
  const { branchId } = req.params;

  const menu = await getCustomerMenu(branchId);

  res.json({ branchId, menu });
}
