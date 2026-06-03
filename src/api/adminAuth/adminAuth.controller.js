import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../services/auth/token.service.js';

const prisma = new PrismaClient();

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ adminId: admin.id });
    const refreshToken = await generateRefreshToken('admin', admin.id, req.headers['user-agent']);

    res.json({ accessToken, refreshToken, admin });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function adminMe(req, res) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId }
    });

    res.json(admin);

  } catch (error) {
    console.error('Admin me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
