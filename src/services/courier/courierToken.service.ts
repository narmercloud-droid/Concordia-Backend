import { randomBytes } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { OrderLifecycleService } from "../order/orderLifecycle.service.ts";

export async function generateCourierToken(orderId: string) {
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
  await OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
  return token;
}

export async function validateCourierToken(token: string) {
  if (!token) return null;

  const order = await prisma.order.findFirst({
    where: {
      courierToken: token,
      courierTokenExpiresAt: { gt: new Date() }
    },
    include: {
      branch: true,
      items: {
        include: {
          item: true
        }
      },
      customer: {
        include: { addresses: true }
      }
    }
  });

  return order;
}

