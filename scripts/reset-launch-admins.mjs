/**
 * Reset launch admin accounts (super admin + branch managers).
 *
 * Required env:
 *   ADMIN_OWNER_PASSWORD
 *   ADMIN_KEMPEN_PASSWORD
 *   ADMIN_STRAELEN_PASSWORD
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ACCOUNTS = [
  {
    id: "admin-owner",
    email: "info@concordiapizza.de",
    envKey: "ADMIN_OWNER_PASSWORD",
    name: "Owner",
    role: "admin",
    branchId: null
  },
  {
    id: "admin-kempen",
    email: "kempen@concordiapizza.de",
    envKey: "ADMIN_KEMPEN_PASSWORD",
    name: "Kempen Manager",
    role: "manager",
    branchId: "concordia-kempen"
  },
  {
    id: "admin-straelen",
    email: "straelen@concordiapizza.de",
    envKey: "ADMIN_STRAELEN_PASSWORD",
    name: "Straelen Manager",
    role: "manager",
    branchId: "concordia-straelen"
  }
];

const LEGACY_EMAILS = [
  "owner@concordia.de",
  "kempen@concordia.de",
  "straelen@concordia.de"
];

function requirePassword(envKey) {
  const password = String(process.env[envKey] ?? "").trim();
  if (password.length < 8) {
    throw new Error(`Set ${envKey} (min 8 characters) before running.`);
  }
  return password;
}

async function main() {
  const targetEmails = new Set(ACCOUNTS.map((a) => a.email));
  const legacyToRemove = LEGACY_EMAILS.filter((e) => !targetEmails.has(e));

  if (legacyToRemove.length > 0) {
    const removed = await prisma.admin.deleteMany({
      where: { email: { in: legacyToRemove } }
    });
    if (removed.count > 0) {
      console.log(`Removed ${removed.count} legacy admin login(s).`);
    }
  }

  for (const account of ACCOUNTS) {
    const password = requirePassword(account.envKey);
    const hash = await bcrypt.hash(password, 10);

    const existingByEmail = await prisma.admin.findUnique({
      where: { email: account.email },
      select: { id: true }
    });
    if (existingByEmail && existingByEmail.id !== account.id) {
      await prisma.adminSession.deleteMany({
        where: { adminId: existingByEmail.id }
      });
      await prisma.admin.delete({ where: { id: existingByEmail.id } });
    }

    const admin = await prisma.admin.upsert({
      where: { id: account.id },
      update: {
        email: account.email,
        password: hash,
        name: account.name,
        role: account.role,
        branchId: account.branchId
      },
      create: {
        id: account.id,
        email: account.email,
        password: hash,
        name: account.name,
        role: account.role,
        branchId: account.branchId
      }
    });

    await prisma.adminSession.deleteMany({ where: { adminId: admin.id } });

    console.log(`✓ ${admin.role} — ${admin.email} (${admin.branchId ?? "all branches"})`);
  }

  console.log("\nLogin: https://www.concordiapizza.de/admin/login");
}

main()
  .catch((err) => {
    console.error("Reset failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
