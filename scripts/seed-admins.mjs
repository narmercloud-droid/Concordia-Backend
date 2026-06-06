import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || "Kempen2026!";
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.admin.upsert({
    where: { email: "owner@concordia.de" },
    update: { password: hash, name: "Owner", role: "admin", branchId: null },
    create: {
      id: "admin-owner",
      email: "owner@concordia.de",
      password: hash,
      name: "Owner",
      role: "admin",
      branchId: null
    }
  });

  await prisma.admin.upsert({
    where: { email: "kempen@concordia.de" },
    update: {
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen"
    },
    create: {
      id: "admin-kempen",
      email: "kempen@concordia.de",
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen"
    }
  });

  console.log("Admin users ready:");
  console.log("  owner@concordia.de  (super admin)");
  console.log("  kempen@concordia.de (Kempen manager)");
  console.log(`  Password: ${defaultPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
