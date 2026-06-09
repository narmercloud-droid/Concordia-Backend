import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.pizzeria-concordia-kempen.de";
const REST_ID = "R5QN5103";
const TEMPLATE = "templaterevamped";

const jar = new Map();

function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const [name, value] = pair.split("=");
    if (name && value !== undefined) jar.set(name.trim(), value.trim());
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json, text/html, */*",
      Cookie: cookieHeader(),
      ...(options.headers ?? {})
    }
  });
  storeCookies(res);
  return res;
}

async function loadRestaurant() {
  const res = await fetchJson(`${BASE}/basket/api/restaurant`);
  const data = await res.json();
  const out = path.join(__dirname, "kempen-lieferando-full.json");
  fs.writeFileSync(out, JSON.stringify(data, null, 2), "utf8");
  return data;
}

async function fetchSidedishes(productId, categoryId) {
  const body = new URLSearchParams({
    action: "add",
    menucat: categoryId,
    product: productId,
    rest: REST_ID,
    template: TEMPLATE
  });

  const res = await fetchJson(`${BASE}/basket/api/add-sidedish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache"
    },
    body: body.toString()
  });

  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    return parsed.json ?? [];
  } catch {
    return [];
  }
}

function parseCategoriesFromHtml() {
  const html = fs.readFileSync(path.join(__dirname, "kempen-home.html"), "utf8");
  const categories = [];
  const re = /<div class="menucat menucard__meals-group"[^>]*id="(cat\d+)"[\s\S]*?<div class="category-name">\s*([\s\S]*?)\s*<\/div>/g;
  let match;
  while ((match = re.exec(html))) {
    categories.push({
      htmlId: match[1],
      name: match[2].replace(/\s+/g, " ").trim()
    });
  }
  return categories;
}

function groupProductsByCategory(products, htmlCategories) {
  const catIdToName = new Map();
  for (const p of products) {
    if (!catIdToName.has(p.categoryId)) {
      const htmlCat = htmlCategories.find((c) => c.htmlId);
      catIdToName.set(p.categoryId, p.categoryId);
    }
  }

  const htmlNames = parseCategoriesFromHtml();
  const categoryNameByLieferandoId = new Map();

  const blocks = fs.readFileSync(path.join(__dirname, "kempen-home.html"), "utf8")
    .split(/<div class="menucat menucard__meals-group"/)
    .slice(1);

  for (const block of blocks) {
    const catNameMatch = block.match(/<div class="category-name">\s*([\s\S]*?)\s*<\/div>/);
    const sidedishMatch = block.match(/menucard_ShowSideDishes\('[^']+','([^']+)'/);
    const simpleMatch = block.match(/data-productId="([^"]+)"[^>]*id="[^/]+\/([^"]+)"/);
    const catName = catNameMatch ? catNameMatch[1].replace(/\s+/g, " ").trim() : "Unknown";

    const productIds = [...block.matchAll(/data-productId="([^"]+)"/g)].map((m) => m[1]);
    const sidedishIds = [...block.matchAll(/menucard_ShowSideDishes\('([^']+)','([^']+)'/g)];

    for (const m of sidedishIds) {
      categoryNameByLieferandoId.set(m[2], catName);
    }

    const simpleProducts = [...block.matchAll(/data-productId="([^"]+)"/g)];
    for (const m of simpleProducts) {
      const catFromBlock = block.match(/menucard_ShowSideDishes\('[^']+','([^']+)'/);
      if (!catFromBlock) {
        categoryNameByLieferandoId.set("3R11R77PN", catName);
      }
    }
  }

  const grouped = new Map();
  for (const product of products) {
    const categoryName = categoryNameByLieferandoId.get(product.categoryId) ?? "Other";
    if (!grouped.has(categoryName)) grouped.set(categoryName, []);
    grouped.get(categoryName).push(product);
  }

  return [...grouped.entries()].map(([name, items]) => ({ name, items }));
}

function normalizeProduct(product, sizes) {
  const base = {
    externalId: product.productId,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description ?? null,
    priceDelivery: product.price,
    pricePickup: product.price_pickup ?? product.price,
    hasSizes: product.hasSizes,
    deliveryMethod: product.deliverymethod,
    isMeal: product.is_meal,
    sizes: [],
    extras: []
  };

  if (sizes?.length) {
    base.sizes = sizes.map((size) => ({
      externalId: size.id,
      name: size.name,
      priceDelivery: Number(size.price ?? size.priceincvat ?? 0),
      pricePickup: Number(size.price_pickup ?? size.price ?? 0),
      groups: (size.sidedishgroups ?? []).map((group) => ({
        id: group.id,
        name: group.name,
        type: group.type,
        required: group.required === "1" || group.required === 1,
        min: Number(group.min ?? 0),
        max: Number(group.max ?? 0),
        options: (group.sidedishes ?? []).map((opt) => ({
          externalId: opt.id,
          name: opt.name,
          priceDelivery: Number(opt.price ?? 0),
          pricePickup: Number(opt.price_pickup ?? opt.price ?? 0),
          isDefault: !!opt.isSelected
        }))
      }))
    }));
  }

  return base;
}

async function main() {
  console.log("Loading restaurant data...");
  const restaurant = await loadRestaurant();
  const products = restaurant.MenucardJson?.products ?? [];
  console.log(`Found ${products.length} products from Lieferando API`);

  const htmlCategories = parseCategoriesFromHtml();
  const needVariants = products.filter((p) => p.hasSizes);

  console.log(`Fetching variants/extras for ${needVariants.length} products...`);

  const enriched = [];
  let done = 0;

  for (const product of products) {
    let sizes = [];
    if (product.hasSizes) {
      sizes = await fetchSidedishes(product.productId, product.categoryId);
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${needVariants.length} variant products fetched`);
      await new Promise((r) => setTimeout(r, 120));
    }
    enriched.push(normalizeProduct(product, sizes));
  }

  const categoryGroups = groupProductsByCategory(products, htmlCategories);

  const output = {
    source: {
      lieferando: "https://www.lieferando.de/speisekarte/pizzeria-concordia-concordienplatz",
      website: BASE,
      restaurantId: restaurant.Id,
      restaurantName: restaurant.Name
    },
    openingHours: {
      delivery: restaurant.Times?.deliveryopentimes ?? [],
      pickup: restaurant.Times?.pickupopentimes ?? []
    },
    deliveryAreas: restaurant.Locations ?? [],
    deliveryPolygons: restaurant.Polygons ?? [],
    paymentMethods: restaurant.Settings?.PaymentMethods ?? [],
    categories: categoryGroups,
    products: enriched,
    stats: {
      totalProducts: enriched.length,
      withSizes: enriched.filter((p) => p.sizes.length > 0).length,
      withExtras: enriched.filter((p) => p.sizes.some((s) => s.groups.some((g) => g.options.length > 0))).length
    }
  };

  const outPath = path.join(__dirname, "kempen-lieferando-complete.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  console.log("Saved", outPath);
  console.log("Stats:", output.stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
