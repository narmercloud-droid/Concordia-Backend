import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createBranch(req, res) {
  try {
    const data = req.body;

    const branch = await prisma.branch.create({ data });

    res.json({ success: true, branch });

  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateBranch(req, res) {
  try {
    const { branchId } = req.params;
    const data = req.body;

    const branch = await prisma.branch.update({
      where: { id: branchId },
      data
    });

    res.json({ success: true, branch });

  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteBranch(req, res) {
  try {
    const { branchId } = req.params;

    await prisma.branch.delete({
      where: { id: branchId }
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
