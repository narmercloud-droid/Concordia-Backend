import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "kempen-home.html");
const html = fs.readFileSync(htmlPath, "utf8");

function parsePrice(raw) {
  const cleaned = raw.replace(/[^\d,]/g, "").replace(",", ".");
  return Number.parseFloat(cleaned) || 0;
}

function stripTags(text) {
  return text
    .replace(/<span[\s\S]*?<\/span>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExternalId(block) {
  const simple = block.match(/data-productId="([^"]+)"/);
  if (simple) return simple[1];
  const sidedish = block.match(/menucard_ShowSideDishes\('([^']+)'/);
  if (sidedish) return sidedish[1];
  return null;
}

function hasVariants(block) {
  return block.includes("menucard_ShowSideDishes");
}

const categories = [];
const categoryBlocks = html.split(/<div class="menucat menucard__meals-group"/).slice(1);

for (const block of categoryBlocks) {
  const idMatch = block.match(/id="(cat\d+)"/);
  const nameMatch = block.match(/<div class="category-name">\s*([\s\S]*?)\s*<\/div>/);
  const descMatch = block.match(/<div class="category-description">\s*([\s\S]*?)\s*<\/div>/);
  if (!idMatch || !nameMatch) continue;

  const products = [];
  const productBlocks = block.split(/<div itemscope itemtype="http:\/\/schema\.org\/Product">/).slice(1);

  for (const productBlock of productBlocks) {
    const nameMatch = productBlock.match(
      /<div class="product-name" itemprop="name">\s*([\s\S]*?)\s*<\/div>/
    );
    const priceMatch = productBlock.match(
      /<div class="product-price" itemprop="price">\s*([\s\S]*?)\s*<\/div>/
    );
    if (!nameMatch || !priceMatch) continue;

    const descriptionMatch = productBlock.match(
      /<div class="product-description"[\s\S]*?itemprop="description">([\s\S]*?)<\/div>/
    );

    const name = stripTags(nameMatch[1]);
    const price = parsePrice(priceMatch[1]);
    if (!name || price <= 0) continue;

    products.push({
      externalId: extractExternalId(productBlock),
      name,
      description: descriptionMatch ? stripTags(descriptionMatch[1]) : null,
      price,
      hasVariants: hasVariants(productBlock)
    });
  }

  categories.push({
    id: idMatch[1],
    name: stripTags(nameMatch[1]),
    description: descMatch ? stripTags(descMatch[1]) : null,
    products
  });
}

const output = {
  source: "https://www.lieferando.de/speisekarte/pizzeria-concordia-concordienplatz",
  website: "https://www.pizzeria-concordia-kempen.de/",
  restaurant: "Concordia Kempen",
  address: {
    street: "Concordienplatz 1",
    postalCode: "47906",
    city: "Kempen",
    lat: 51.3703503,
    lng: 6.4105939
  },
  openingHours: [
    { day: 1, open: "12:00", close: "21:00" },
    { day: 2, open: "12:00", close: "21:00" },
    { day: 3, closed: true },
    { day: 4, open: "12:00", close: "21:00" },
    { day: 5, open: "12:00", close: "21:00" },
    { day: 6, open: "12:00", close: "21:00" },
    { day: 0, open: "13:00", close: "21:00" }
  ],
  categories,
  stats: {
    categoryCount: categories.length,
    productCount: categories.reduce((sum, cat) => sum + cat.products.length, 0)
  }
};

const outPath = path.join(__dirname, "kempen-menu.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
console.log(`Parsed ${output.stats.productCount} products in ${output.stats.categoryCount} categories`);
console.log(`Saved to ${outPath}`);
