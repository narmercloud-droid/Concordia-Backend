import { PrismaClient } from '@prisma/client';
import { updateBranchLoad } from '../../services/kitchen/kitchenLoad.service.js';

const prisma = new PrismaClient();

export async function getBranchLoad(req, res) {
  const { branchId } = req.params;
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  res.json({ load: branch?.currentLoadLevel });
}

export async function recalcLoad(req, res) {
  const { branchId } = req.params;
  const load = await updateBranchLoad(branchId);
  res.json({ load });
}
