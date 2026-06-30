import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { requireSeedPassword } from "./lib/require-seed-password.mjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = requireSeedPassword();
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.admin.upsert({
    where: { id: "admin-owner" },
    update: { password: hash, name: "Owner", role: "admin", branchId: null, email: "info@concordiapizza.de" },
    create: {
      id: "admin-owner",
      email: "info@concordiapizza.de",
      password: hash,
      name: "Owner",
      role: "admin",
      branchId: null
    }
  });

  await prisma.admin.upsert({
    where: { id: "admin-kempen" },
    update: {
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen",
      email: "kempen@concordiapizza.de"
    },
    create: {
      id: "admin-kempen",
      email: "kempen@concordiapizza.de",
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen"
    }
  });

  await prisma.admin.upsert({
    where: { id: "admin-straelen" },
    update: {
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: "concordia-straelen",
      email: "straelen@concordiapizza.de"
    },
    create: {
      id: "admin-straelen",
      email: "straelen@concordiapizza.de",
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: "concordia-straelen"
    }
  });

  console.log("Admin users ready:");
  console.log("  info@concordiapizza.de    (super admin)");
  console.log("  kempen@concordiapizza.de  (Kempen manager)");
  console.log("  straelen@concordiapizza.de (Straelen manager)");
  console.log("  Password: set via SEED_ADMIN_PASSWORD (not logged)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
