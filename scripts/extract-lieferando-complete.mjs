import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.pizzeria-concordia-kempen.de";
const REST_ID = "R5QN5103";
const TEMPLATE = "templaterevamped";
const HTML_PATH = path.join(__dirname, "kempen-home.html");

function stripTags(text) {
  return text
    .replace(/<span[\s\S]*?<\/span>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseHtmlMenu() {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const productMeta = new Map();
  const categories = [];

  const categoryBlocks = html.split(/<div class="menucat menucard__meals-group"/).slice(1);

  for (const block of categoryBlocks) {
    const nameMatch = block.match(/<div class="category-name">\s*([\s\S]*?)\s*<\/div>/);
    const descMatch = block.match(/<div class="category-description">\s*([\s\S]*?)\s*<\/div>/);
    if (!nameMatch) continue;

    const categoryName = stripTags(nameMatch[1]);
    const categoryDescription = descMatch ? stripTags(descMatch[1]) : null;
    const categoryProducts = [];

    const productBlocks = block.split(/<div itemscope itemtype="http:\/\/schema\.org\/Product">/).slice(1);

    for (const productBlock of productBlocks) {
      const nameMatch = productBlock.match(
        /<div class="product-name" itemprop="name">\s*([\s\S]*?)\s*<\/div>/
      );
      const descMatch = productBlock.match(
        /<div class="product-description"[\s\S]*?itemprop="description">([\s\S]*?)<\/div>/
      );
      const sidedishMatch = productBlock.match(
        /menucard_ShowSideDishes\('([^']+)','([^']+)'/
      );
      const simpleMatch = productBlock.match(/data-productId="([^"]+)"/);

      const productId = sidedishMatch?.[1] ?? simpleMatch?.[1];
      if (!productId || !nameMatch) continue;

      const menucatId = sidedishMatch?.[2] ?? productBlock.match(/id="([^/]+)\//)?.[1] ?? null;
      const name = stripTags(nameMatch[1]);
      const description = descMatch ? stripTags(descMatch[1]) : null;
      const hasVariants = !!sidedishMatch;

      productMeta.set(productId, {
        name,
        description,
        categoryName,
        menucatId,
        hasVariants
      });

      categoryProducts.push({ productId, name, description, hasVariants });
    }

    categories.push({
      name: categoryName,
      description: categoryDescription,
      products: categoryProducts
    });
  }

  return { productMeta, categories };
}

async function fetchRestaurant() {
  const res = await fetch(`${BASE}/basket/api/restaurant`, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }
  });
  if (!res.ok) throw new Error(`restaurant API ${res.status}`);
  return res.json();
}

async function fetchSidedishes(productId, menucatId) {
  const body = new URLSearchParams({
    action: "add",
    menucat: menucatId,
    product: productId,
    rest: REST_ID,
    template: TEMPLATE
  });

  const res = await fetch(`${BASE}/basket/api/add-sidedish`, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache"
    },
    body: body.toString()
  });

  const data = await res.json();
  return data.json ?? [];
}

function normalizeSize(size) {
  return {
    externalId: size.id,
    name: size.name,
    priceDelivery: Number(size.price ?? 0),
    pricePickup: Number(size.price_pickup ?? size.price ?? 0),
    minAge: size.minAge ?? 0,
    groups: (size.sidedishgroups ?? []).map((group) => ({
      type: group.type,
      name: group.name ?? null,
      required: group.required === "1" || group.required === 1,
      min: Number(group.min ?? 0),
      max: Number(group.max ?? 0),
      options: (group.sidedishes ?? []).map((opt) => ({
        externalId: opt.id,
        name: opt.name,
        priceDelivery: Number(opt.price ?? 0),
        pricePickup: Number(opt.price_pickup ?? opt.price ?? 0),
        minAge: opt.minAge ?? 0
      }))
    }))
  };
}

function parseOpeningHours(times) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const delivery = [];
  const pickup = [];

  for (let day = 0; day < 7; day++) {
    const deliverySlot = times.deliveryopentimes?.[day]?.[0];
    const pickupSlot = times.pickupopentimes?.[day]?.[0];

    const toEntry = (slot) => {
      if (!slot || (slot.starttime === "00:00:00" && slot.endtime === "00:00:00")) {
        return { day, dayName: dayNames[day], closed: true };
      }
      return {
        day,
        dayName: dayNames[day],
        open: slot.starttime.slice(0, 5),
        close: slot.endtime.slice(0, 5)
      };
    };

    delivery.push(toEntry(deliverySlot));
    pickup.push(toEntry(pickupSlot));
  }

  return { delivery, pickup };
}

function normalizeProduct(product, htmlMeta, sizes) {
  const meta = htmlMeta.get(product.productId);
  const normalizedSizes = sizes.map(normalizeSize);

  const extraGroups = normalizedSizes[0]?.groups.filter((g) => g.type === "2") ?? [];
  const requiredGroups = normalizedSizes[0]?.groups.filter((g) => g.type === "1" || g.type === "3") ?? [];

  return {
    externalId: product.productId,
    categoryId: product.categoryId,
    menucatId: meta?.menucatId ?? product.categoryId,
    categoryName: meta?.categoryName ?? null,
    name: meta?.name ?? product.name,
    description: meta?.description ?? product.description ?? null,
    priceDelivery: product.price,
    pricePickup: product.price_pickup ?? product.price,
    hasSizes: product.hasSizes,
    deliveryMethod: product.deliverymethod,
    isMeal: product.is_meal,
    sizes: normalizedSizes,
    extraGroups,
    requiredGroups,
    stats: {
      sizeCount: normalizedSizes.length,
      extraOptionCount: extraGroups.reduce((sum, g) => sum + g.options.length, 0)
    }
  };
}

function buildCategoryGroups(products, htmlCategories) {
  const byCategory = new Map();

  for (const cat of htmlCategories) {
    byCategory.set(cat.name, {
      name: cat.name,
      description: cat.description,
      products: []
    });
  }

  for (const product of products) {
    const catName = product.categoryName ?? "Other";
    if (!byCategory.has(catName)) {
      byCategory.set(catName, { name: catName, description: null, products: [] });
    }
    byCategory.get(catName).products.push(product);
  }

  return [...byCategory.values()].filter((c) => c.products.length > 0);
}

async function main() {
  console.log("Parsing HTML menu...");
  const { productMeta, categories: htmlCategories } = parseHtmlMenu();
  console.log(`  ${productMeta.size} products in ${htmlCategories.length} HTML categories`);

  console.log("Fetching restaurant API...");
  const restaurant = await fetchRestaurant();
  const apiProducts = restaurant.MenucardJson?.products ?? [];
  console.log(`  ${apiProducts.length} products from API`);

  const skipIds = new Set(["3P5OP1QPQO"]);
  const toProcess = apiProducts.filter((p) => !skipIds.has(p.productId));
  const withSizes = toProcess.filter((p) => p.hasSizes);
  console.log(`Fetching variants/extras for ${withSizes.length} products...`);

  const enriched = [];
  let fetched = 0;

  for (const product of toProcess) {
    let sizes = [];
    if (product.hasSizes) {
      const menucatId = productMeta.get(product.productId)?.menucatId ?? product.categoryId;
      sizes = await fetchSidedishes(product.productId, menucatId);
      fetched++;
      if (fetched % 10 === 0) {
        console.log(`  ${fetched}/${withSizes.length} variant products fetched`);
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    enriched.push(normalizeProduct(product, productMeta, sizes));
  }

  const output = {
    extractedAt: new Date().toISOString(),
    source: {
      lieferando: "https://www.lieferando.de/speisekarte/pizzeria-concordia-concordienplatz",
      website: BASE,
      restaurantId: restaurant.Id,
      restaurantName: restaurant.Name
    },
    openingHours: parseOpeningHours(restaurant.Times ?? {}),
    deliveryAreas: (restaurant.Locations ?? []).map((loc) => ({
      deliveryAreaId: loc.deliveryareaid,
      postalCode: String(loc.deliveryareaid),
      city: loc.city,
      minimumOrder: Number(loc.minimumcosts ?? 0),
      deliveryFee: Number(loc.costs?.[0]?.costs ?? 0)
    })),
    deliveryPolygons: restaurant.Polygons ?? [],
    paymentMethods: restaurant.Settings?.PaymentMethods ?? [],
    categories: buildCategoryGroups(enriched, htmlCategories),
    products: enriched,
    stats: {
      totalProducts: enriched.length,
      withSizes: enriched.filter((p) => p.sizes.length > 0).length,
      withExtras: enriched.filter((p) => p.stats.extraOptionCount > 0).length,
      totalExtraOptions: enriched.reduce((sum, p) => sum + p.stats.extraOptionCount, 0),
      deliveryAreas: (restaurant.Locations ?? []).length
    }
  };

  const outPath = path.join(__dirname, "kempen-lieferando-complete.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  fs.writeFileSync(
    path.join(__dirname, "kempen-lieferando-full.json"),
    JSON.stringify(restaurant, null, 2),
    "utf8"
  );

  console.log("\nSaved:", outPath);
  console.log("Stats:", output.stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
