import { autoAssignDriver } from '../../services/dispatch/autoDispatch.service.js';

export async function triggerAutoDispatch(req, res) {
  const { orderId } = req.params;

  const result = await autoAssignDriver(orderId);

  if (!result) {
    return res.status(400).json({ error: 'No available drivers' });
  }

  res.json(result);
}
