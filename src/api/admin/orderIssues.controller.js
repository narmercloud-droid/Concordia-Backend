import { listIssues, updateIssue, getIssue } from '../../services/issues/orderIssue.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function adminListIssues(req, res) {
  const issues = await listIssues();
  res.json(issues);
}

export async function adminGetIssue(req, res) {
  const { issueId } = req.params;
  const issue = await getIssue(issueId);
  res.json(issue);
}

export async function adminResolveIssue(req, res) {
  const { issueId } = req.params;
  const { status, resolution, refundAmount } = req.body;

  const updated = await updateIssue(issueId, {
    status,
    resolution,
    refundAmount
  });

  // Apply refund if needed
  if (refundAmount && refundAmount > 0) {
    await prisma.order.update({
      where: { id: updated.orderId },
      data: { refundAmount }
    });
  }

  res.json(updated);
}
