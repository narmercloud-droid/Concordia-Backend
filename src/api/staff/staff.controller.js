import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createStaff(req, res) {
  try {
    const { name, phone, role, branchId } = req.body;

    const staff = await prisma.staff.create({
      data: { name, phone, role, branchId }
    });

    res.json({ success: true, staff });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateStaff(req, res) {
  try {
    const { staffId } = req.params;
    const data = req.body;

    const staff = await prisma.staff.update({
      where: { id: staffId },
      data
    });

    res.json({ success: true, staff });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
