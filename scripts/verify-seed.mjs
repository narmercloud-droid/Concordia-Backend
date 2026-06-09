import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const item = await prisma.menuItem.findFirst({
  where: { name: "Pizza Margherita" },
  include: {
    variantGroups: { include: { variants: true } },
    addOnGroups: { include: { addOns: true } }
  }
});

console.log("Item:", item?.name, "basePrice:", item?.basePrice);
console.log(
  "Variants:",
  item?.variantGroups[0]?.variants.map((v) => `${v.name}: €${v.price}`).join(", ")
);
console.log("Extra count:", item?.addOnGroups[0]?.addOns.length);
console.log(
  "Extras sample:",
  item?.addOnGroups[0]?.addOns
    .slice(0, 5)
    .map((a) => `${a.name}: €${a.price}`)
    .join(", ")
);

const [items, variants, addons, categories] = await Promise.all([
  prisma.menuItem.count(),
  prisma.variant.count(),
  prisma.addOn.count(),
  prisma.branchCategory.count({ where: { branchId: "concordia-kempen" } })
]);

console.log("DB counts - items:", items, "variants:", variants, "addons:", addons, "categories:", categories);

await prisma.$disconnect();
