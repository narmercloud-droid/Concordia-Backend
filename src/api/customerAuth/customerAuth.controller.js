import { PrismaClient } from '@prisma/client';
import { generateOtp, verifyOtp } from '../../services/auth/otp.service.js';
import { generateAccessToken, generateRefreshToken } from '../../services/auth/token.service.js';

const prisma = new PrismaClient();

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    let customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      customer = await prisma.customer.create({ data: { email } });
    }

    const code = generateOtp(email);

    console.log('OTP for', email, code);

    res.json({ success: true });

  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function verifyCustomerOtp(req, res) {
  try {
    const { email, code } = req.body;

    if (!verifyOtp(email, code)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });

    const accessToken = generateAccessToken({ customerId: customer.id });
    const refreshToken = await generateRefreshToken('customer', customer.id, req.headers['user-agent']);

    res.json({ accessToken, refreshToken, customer });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
