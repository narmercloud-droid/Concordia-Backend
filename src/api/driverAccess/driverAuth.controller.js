import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function driverRegister(req, res) {
  const { name, email, password, phone, branchId } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const driver = await prisma.driver.create({
    data: {
      name,
      email,
      password: hashed,
      phone,
      branchId
    }
  });

  res.json({ success: true, driverId: driver.id });
}

export async function driverLogin(req, res) {
  const { email, password } = req.body;

  const driver = await prisma.driver.findUnique({ where: { email } });

  if (!driver) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, driver.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { driverId: driver.id, branchId: driver.branchId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
}
