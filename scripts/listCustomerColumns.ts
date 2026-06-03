import { prisma } from "../src/prisma/client.ts";

async function main() {
  try {
    const rows = await (prisma as any).$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name = 'Customer';");
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
