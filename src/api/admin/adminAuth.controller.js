import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function adminRegister(req, res) {
  const { email, password, name } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: { email, password: hashed, name }
  });

  res.json({ success: true, adminId: admin.id });
}

export async function adminLogin(req, res) {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
}
