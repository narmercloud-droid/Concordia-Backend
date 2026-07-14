import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const BRANCH_ID = "concordia-straelen";
const PROMO = {
  code: "WEWO20",
  type: "percent",
  amount: 20,
  minOrder: 15,
  maxUses: null,
  branchId: BRANCH_ID
};

async function main() {
  const existing = await prisma.promoCode.findFirst({
    where: { code: { equals: PROMO.code, mode: "insensitive" } }
  });

  if (existing) {
    await prisma.promoCode.update({
      where: { id: existing.id },
      data: {
        type: PROMO.type,
        amount: PROMO.amount,
        minOrder: PROMO.minOrder,
        maxUses: PROMO.maxUses,
        branchId: PROMO.branchId,
        isActive: true,
        expiresAt: null
      }
    });
    console.log(`Updated promo ${PROMO.code} for ${BRANCH_ID}`);
    return;
  }

  await prisma.promoCode.create({
    data: {
      id: randomUUID(),
      code: PROMO.code,
      type: PROMO.type,
      amount: PROMO.amount,
      minOrder: PROMO.minOrder,
      maxUses: PROMO.maxUses,
      branchId: PROMO.branchId,
      isActive: true
    }
  });
  console.log(`Created promo ${PROMO.code} for ${BRANCH_ID}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
