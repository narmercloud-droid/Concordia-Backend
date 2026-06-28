import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const orders = await p.order.findMany({
  where: { branchId: "concordia-straelen" },
  orderBy: { createdAt: "desc" },
  take: 20,
  include: {
    items: { include: { variants: true, extras: true, item: true } }
  }
});

for (const o of orders) {
  const short = o.id.replace(/-/g, "").slice(0, 8).toUpperCase();
  const display = `${short.slice(0, 3)} ${short.slice(3, 6)}`;
  console.log(
    JSON.stringify({
      display,
      id: o.id,
      total: Number(o.orderTotal),
      discount: Number(o.discount),
      fulfillment: o.fulfillmentType,
      items: o.items.map((it) => ({
        qty: it.quantity,
        name: it.item?.name,
        price: Number(it.price),
        variants: it.variants.map((v) => ({ name: v.name, price: Number(v.price) })),
        extras: it.extras.map((e) => ({ name: e.name, price: Number(e.price) }))
      }))
    })
  );
}

await p.$disconnect();
