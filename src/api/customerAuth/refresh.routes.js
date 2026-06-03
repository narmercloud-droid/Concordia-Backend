import express from 'express';
import { verifyRefreshToken, generateAccessToken } from '../../services/auth/token.service.js';

const router = express.Router();

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  const session = await verifyRefreshToken('customer', refreshToken);
  if (!session) return res.status(401).json({ error: 'Invalid refresh token' });

  const accessToken = generateAccessToken({ customerId: session.customerId });

  res.json({ accessToken });
});

export default router;
