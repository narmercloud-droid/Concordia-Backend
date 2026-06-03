import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCustomerProfile(req, res) {
  try {
    const profile = await prisma.customer.findUnique({
      where: { id: req.customerId }
    });

    res.json(profile);

  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCustomerProfile(req, res) {
  try {
    const data = req.body;

    const profile = await prisma.customer.update({
      where: { id: req.customerId },
      data
    });

    res.json({ success: true, profile });

  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
