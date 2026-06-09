import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pasta = await prisma.menuItem.findFirst({
  where: { name: "Pasta Napoli" },
  include: {
    variantGroups: { include: { variants: true } },
    addOnGroups: { include: { addOns: true } }
  }
});

console.log(
  "Pasta Napoli:",
  pasta?.basePrice,
  pasta?.variantGroups.map((g) => ({
    name: g.name,
    opts: g.variants.map((v) => `${v.name}:${v.price}`)
  })),
  "extras:",
  pasta?.addOnGroups.flatMap((g) => g.addOns.map((a) => `${a.name}:${a.price}`))
);

const schnitzel = await prisma.menuItem.findFirst({
  where: { name: { contains: "Wiener" } },
  include: { variantGroups: { include: { variants: true } } }
});

console.log(
  "Schnitzel:",
  schnitzel?.name,
  schnitzel?.variantGroups.map((g) => ({
    name: g.name,
    opts: g.variants.map((v) => `${v.name}:${v.price}`)
  }))
);

await prisma.$disconnect();
