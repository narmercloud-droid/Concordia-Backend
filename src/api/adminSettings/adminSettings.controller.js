import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getGlobalSettings(req, res) {
  try {
    const settings = await prisma.globalSettings.findFirst();
    res.json(settings);
  } catch (error) {
    console.error('Get global settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateGlobalSettings(req, res) {
  try {
    const data = req.body;

    const settings = await prisma.globalSettings.updateMany({
      data
    });

    res.json({ success: true, settings });

  } catch (error) {
    console.error('Update global settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
