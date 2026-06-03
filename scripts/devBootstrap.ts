import { execSync } from "child_process";

function run(cmd: string) {
  console.log("▶", cmd);
  execSync(cmd, { stdio: "inherit" });
}

console.log("🔧 Bootstrapping development environment...");

run("npx prisma generate");
run("npx prisma migrate deploy");
run("npx tsx prisma/seed.ts");

console.log("✅ Bootstrap complete. You can now run: npm run dev");
