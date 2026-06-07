import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const DEFAULT_CODES = [
  {
    code: "WELCOME10",
    type: "percent",
    amount: 10,
    minOrder: 15,
    maxUses: 500
  },
  {
    code: "KEMPEN5",
    type: "fixed",
    amount: 5,
    minOrder: 20,
    maxUses: 200
  },
  {
    code: "BIRTHDAY",
    type: "fixed",
    amount: 8,
    minOrder: 15,
    maxUses: 5000
  }
];

async function main() {
  for (const promo of DEFAULT_CODES) {
    const existing = await prisma.promoCode.findFirst({
      where: { code: { equals: promo.code, mode: "insensitive" } }
    });

    if (existing) {
      await prisma.promoCode.update({
        where: { id: existing.id },
        data: {
          type: promo.type,
          amount: promo.amount,
          minOrder: promo.minOrder,
          maxUses: promo.maxUses,
          isActive: true,
          expiresAt: null
        }
      });
      console.log(`Updated promo: ${promo.code}`);
      continue;
    }

    await prisma.promoCode.create({
      data: {
        id: randomUUID(),
        code: promo.code,
        type: promo.type,
        amount: promo.amount,
        minOrder: promo.minOrder,
        maxUses: promo.maxUses,
        isActive: true
      }
    });
    console.log(`Created promo: ${promo.code}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
