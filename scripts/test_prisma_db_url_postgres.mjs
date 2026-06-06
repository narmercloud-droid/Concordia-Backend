import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Set it in environment or .env before running this script.");
  process.exit(1);
}
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log("connected");
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
