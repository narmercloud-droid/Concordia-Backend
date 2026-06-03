import { prisma } from "../src/prisma/client.ts";

async function main() {
  const item = await prisma.menuItem.findFirst({ select: { id: true, name: true } });
  if (!item) {
    console.error("NO_ITEM_FOUND");
    process.exit(1);
  }
  console.log(item.id);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
