import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createBranch(req, res) {
  const branch = await prisma.branch.create({ data: req.body });
  res.json(branch);
}

export async function updateBranch(req, res) {
  const { branchId } = req.params;
  const branch = await prisma.branch.update({
    where: { id: branchId },
    data: req.body
  });
  res.json(branch);
}

export async function deleteBranch(req, res) {
  const { branchId } = req.params;
  await prisma.branch.delete({ where: { id: branchId } });
  res.json({ success: true });
}

export async function listBranches(req, res) {
  const branches = await prisma.branch.findMany();
  res.json(branches);
}
