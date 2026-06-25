import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const email = "owner@concordia.de";
const password =
  process.env.NEW_ADMIN_PASSWORD?.trim() ||
  crypto.randomBytes(12).toString("base64url").slice(0, 16) + "Cx9!";

if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const hash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hash, name: "Owner", role: "admin", branchId: null },
    create: {
      id: "admin-owner",
      email,
      password: hash,
      name: "Owner",
      role: "admin",
      branchId: null
    }
  });

  console.log("Super admin password reset successfully.");
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
  console.log("Login: https://www.concordiapizza.de/admin/login");
} catch (err) {
  console.error("Reset failed:", err.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
