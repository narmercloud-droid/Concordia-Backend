import { execSync } from "node:child_process";

if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  console.log("[prestart] Applying pending database migrations…");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
