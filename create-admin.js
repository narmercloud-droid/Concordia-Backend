import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "Admin123!";
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", user);
}

main()
  .catch((e) => {
    console.error("Error creating admin:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
