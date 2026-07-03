/**
 * Fix orders paid via PayPal that were incorrectly stored as CARD.
 *
 * Usage: node scripts/fix-paypal-payment-methods.mjs
 */
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const result = await prisma.order.updateMany({
  where: {
    paypalOrderId: { not: null },
    paymentMethod: { in: ["CARD", "card", "STRIPE", "stripe"] }
  },
  data: { paymentMethod: "PAYPAL" }
});

console.log(`Updated ${result.count} order(s) from CARD/STRIPE to PAYPAL.`);

await prisma.$disconnect();
