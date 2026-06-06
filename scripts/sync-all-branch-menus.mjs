import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const syncScript = path.join(__dirname, "sync-kempen-menu.mjs");
const branches = ["concordia-kempen", "concordia-straelen"];

function runSync(branchId) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [syncScript], {
      stdio: "inherit",
      env: { ...process.env, SYNC_BRANCH_ID: branchId }
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Sync failed for ${branchId} (exit ${code})`));
    });
  });
}

for (const branchId of branches) {
  console.log(`\n=== Syncing ${branchId} ===`);
  await runSync(branchId);
}

console.log("\nAll branch menus synced.");
