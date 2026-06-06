// Minimal ambient test globals for typecheck environment
declare const describe: any;
declare const it: any;
declare const expect: any;

import { OrderFactory } from "../factories/orderFactory.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("OrderFactory", () => {
  it("creates a fully valid order", async () => {
    const order = await OrderFactory.createTestOrder();

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();

    const dbOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        customer: true,
        branch: true
      }
    });

    expect(dbOrder).not.toBeNull();
    expect(dbOrder?.items.length).toBeGreaterThan(0);
    expect(dbOrder?.customerId).toBeDefined();
    expect(dbOrder?.branchId).toBeDefined();
    expect(dbOrder?.createdAt).toBeDefined();
  });
});
