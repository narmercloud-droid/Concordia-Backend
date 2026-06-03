import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function driverLogin(req, res) {
  try {
    const { phone } = req.body;

    const driver = await prisma.driver.findUnique({
      where: { phone }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const token = jwt.sign(
      { driverId: driver.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, driver });

  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function driverMe(req, res) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.driverId }
    });

    res.json(driver);

  } catch (error) {
    console.error('Driver me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
