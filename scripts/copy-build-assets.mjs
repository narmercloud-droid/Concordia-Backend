import { copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function copy(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

copy(
  join(root, "src/services/notifications/notification.service.js"),
  join(root, "dist/services/notifications/notification.service.js")
);

// Legacy plain-JS modules import from src/ws/ws.js (not emitted by tsc).
copy(join(root, "src/ws/ws.js"), join(root, "dist/ws/ws.js"));

copy(
  join(root, "src/data/de-plz-cities.json"),
  join(root, "dist/data/de-plz-cities.json")
);
