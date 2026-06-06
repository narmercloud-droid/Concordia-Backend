import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAddresses(req, res) {
  try {
    const addresses = await prisma.customerAddress.findMany({
      where: { customerId: req.customerId }
    });

    res.json(addresses);

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createAddress(req, res) {
  try {
    const data = req.body;

    const address = await prisma.customerAddress.create({
      data: { ...data, customerId: req.customerId }
    });

    res.json({ success: true, address });

  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const data = req.body;

    const address = await prisma.customerAddress.update({
      where: { id: addressId },
      data
    });

    res.json({ success: true, address });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;

    await prisma.customerAddress.delete({
      where: { id: addressId }
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
