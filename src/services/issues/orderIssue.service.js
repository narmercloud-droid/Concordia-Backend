
import { PrismaClient } from '@prisma/client';
import { getIO } from '../../ws/ws.js';
import { sendWS } from '../notifications/notification.service.js';
import { NOTIFY } from '../../ws/notificationEvents.js';
const prisma = new PrismaClient();

export async function createIssue(data) {
  const issue = await prisma.orderIssue.create({ data });
  const io = getIO();
  io.emit('order_issue_created', issue);
  // High-level notification
  sendWS(NOTIFY.ISSUE_CREATED, issue);
  return issue;
}

export async function listIssues(filter = {}) {
  return prisma.orderIssue.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateIssue(issueId, data) {
  const updated = await prisma.orderIssue.update({
    where: { id: issueId },
    data
  });

  const io = getIO();
  io.emit('order_issue_updated', updated);

  // High-level notification
  sendWS(NOTIFY.ISSUE_UPDATED, updated);

  return updated;
}

export async function getIssue(issueId) {
  return prisma.orderIssue.findUnique({ where: { id: issueId } });
}
