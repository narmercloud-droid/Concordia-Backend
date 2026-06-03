import { createIssue } from '../../services/issues/orderIssue.service.js';

export async function reportIssue(req, res) {
  const { orderId, userId, type, description } = req.body;

  const issue = await createIssue({
    orderId,
    userId,
    type,
    description
  });

  res.json(issue);
}
