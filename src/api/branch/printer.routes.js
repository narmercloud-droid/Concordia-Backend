import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/set-printer', async (req, res) => {
  const { branchId, printerUrl } = req.body;

  await prisma.branch.update({
    where: { id: branchId },
    data: { printerUrl }
  });

  res.json({ success: true });
});

export default router;
