import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const res = await fetch("https://www.pizzeria-concordia-kempen.de/basket/api/restaurant", {
  headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json, text/html, */*" }
});

console.log("status", res.status);
const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  console.log("Not JSON, first 500 chars:", text.slice(0, 500));
  process.exit(1);
}

const outPath = path.join(__dirname, "kempen-lieferando-full.json");
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");

const products = data.products ?? data.restaurant?.products ?? [];
console.log("Saved to", outPath);
console.log("Top-level keys:", Object.keys(data));
console.log("Products:", products.length);

if (products[0]) {
  console.log("Sample product keys:", Object.keys(products[0]));
  const withSizes = products.find((p) => p.sizes?.length);
  if (withSizes) {
    console.log("Sample with sizes:", withSizes.name, withSizes.sizes?.length, "sizes");
    console.log("First size keys:", Object.keys(withSizes.sizes[0]));
    if (withSizes.sizes[0].sidedishgroups) {
      console.log("Sidedish groups:", withSizes.sizes[0].sidedishgroups.length);
    }
  }
}
