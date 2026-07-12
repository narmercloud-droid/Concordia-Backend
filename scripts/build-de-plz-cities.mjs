import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/data/de-plz-cities.json");

async function fetchAllLocalities() {
  const map = new Map();

  for (let prefix = 0; prefix <= 99; prefix += 1) {
    const rx = `^${String(prefix).padStart(2, "0")}`;
    let page = 1;

    while (page <= 50) {
      const url = new URL("https://openplzapi.org/de/Localities");
      url.searchParams.set("postalCode", rx);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", "50");

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        throw new Error(`OpenPLZ ${rx} page ${page} failed with ${res.status}`);
      }

      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) break;

      for (const row of rows) {
        const plz = String(row.postalCode ?? "").trim();
        const name = String(row.name ?? "").trim();
        if (/^\d{5}$/.test(plz) && name && !map.has(plz)) {
          map.set(plz, name);
        }
      }

      if (rows.length < 50) break;
      page += 1;
    }
  }

  return Object.fromEntries([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

const map = await fetchAllLocalities();
fs.mkdirSync(dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(map));
console.log(`Wrote ${Object.keys(map).length} PLZ entries to ${outPath}`);
