import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getDeliverySettings(req, res) {
  try {
    const { branchId } = req.params;

    const settings = await prisma.branchConfig.findUnique({
      where: { branchId }
    });

    res.json(settings);
  } catch (error) {
    console.error('Get delivery settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateDeliverySettings(req, res) {
  try {
    const { branchId } = req.params;
    const data = req.body;

    const settings = await prisma.branchConfig.update({
      where: { branchId },
      data
    });

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update delivery settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
