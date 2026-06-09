import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const samples = [
  "Pizza Margherita",
  "Pasta Napoli",
  "Baguette mit Salami",
  "Burger Klassik",
  "Schnitzel Wiener Art",
  "Pommes frites",
  "Coca-Cola 0,33l (MEHRWEG)"
];

for (const name of samples) {
  const item = await prisma.menuItem.findFirst({
    where: { name: { contains: name.split(" ")[0] === "Coca-Cola" ? "Coca-Cola" : name } },
    include: { addOnGroups: { include: { addOns: true } } }
  });
  if (!item) {
    console.log(name, "NOT FOUND");
    continue;
  }
  console.log(
    `\n${item.name}:`,
    item.addOnGroups.map((g) => `${g.name}(${g.addOns.length})`).join(", ") || "no extras"
  );
}

await prisma.$disconnect();
