import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createPromo(req, res) {
  const promo = await prisma.promoCode.create({ data: req.body });
  res.json(promo);
}

export async function updatePromo(req, res) {
  const { promoId } = req.params;
  const promo = await prisma.promoCode.update({
    where: { id: promoId },
    data: req.body
  });
  res.json(promo);
}

export async function listPromos(req, res) {
  const promos = await prisma.promoCode.findMany();
  res.json(promos);
}

export async function deletePromo(req, res) {
  const { promoId } = req.params;
  await prisma.promoCode.delete({ where: { id: promoId } });
  res.json({ success: true });
}
