/**
 * Compare Kempen website menu vs printed flyer reference.
 * Usage: node scripts/compare-kempen-menu.mjs
 */

const API = process.env.API_URL ?? "https://api.concordiapizza.de";

/** Printed flyer reference (Kempen menu photos). */
const FLYER = {
  pizzas: {
    "01": { name: "Margherita", klein: 5.0, gross: 7.0 },
    "02": { name: "Broccoli", klein: 6.5, gross: 8.5 },
    "03": { name: "Salami", klein: 6.5, gross: 8.5 },
    "04": { name: "Prosciutto", klein: 6.5, gross: 8.5 },
    "05": { name: "Funghi", klein: 6.5, gross: 8.5 },
    "06": { name: "Tonno", klein: 7.0, gross: 9.0 },
    "07": { name: "Spinaci", klein: 6.5, gross: 8.5 },
    "08": { name: "Scampi", klein: 8.0, gross: 10.0 },
    "09": { name: "Frutti di Mare", klein: 8.0, gross: 10.0 },
    "10": { name: "Sucuk", klein: 7.0, gross: 9.0 },
    "11": { name: "Tonno e Cipolla", klein: 7.5, gross: 9.5 },
    "12": { name: "Prosciutto Funghi", klein: 7.5, gross: 9.5 },
    "13": { name: "Hawaii", klein: 7.5, gross: 9.5 },
    "14": { name: "Mozzarella", klein: 7.5, gross: 9.5 },
    "15": { name: "Bolognese", klein: 7.0, gross: 9.0 },
    "16": { name: "Spaghetti Bolognese", klein: 7.5, gross: 9.5 },
    "17": { name: "Milano", klein: 8.0, gross: 10.0 },
    "18": { name: "Lachs", klein: 8.0, gross: 10.0 },
    "19": { name: "Quattro Stagioni", klein: 8.5, gross: 10.5 },
    "20": { name: "Quattro Formaggi", klein: 8.5, gross: 10.5 },
    "21": { name: "Pizza Spargel", klein: 8.5, gross: 10.5 },
    "22": { name: "Pizza Rustica", klein: 8.5, gross: 10.5 },
    "23": { name: "Bruno", klein: 8.5, gross: 10.5 },
    "24": { name: "Enzo", klein: 7.5, gross: 9.5 },
    "25": { name: "Hähnchen", klein: 8.5, gross: 10.5 },
    "26": { name: "Chef", klein: 8.5, gross: 11.0 },
    "27": { name: "Italia", klein: 8.0, gross: 10.0 },
    "28": { name: "Vegetaria A", klein: 8.5, gross: 10.5 },
    "29": { name: "Vegetaria B", klein: 8.5, gross: 10.5 },
    "30": { name: "Vegetaria C", klein: 8.5, gross: 10.5 },
    "31": { name: "Vegetaria D", klein: 8.5, gross: 11.0 },
    "32": { name: "Mexico", klein: 8.5, gross: 10.5 },
    "33": { name: "Concordia", klein: 8.5, gross: 11.0 },
    "34": { name: "Bella", klein: 8.5, gross: 10.5 },
    "35": { name: "Vegas", klein: 8.5, gross: 11.0 },
    "36": { name: "Calzone Spezial", klein: null, gross: 10.5 },
    "37": { name: "Calzone Concordia", klein: null, gross: 10.5 },
    "38": { name: "Calzone Döner", klein: null, gross: 10.5 },
    "39": { name: "Parma", klein: 8.5, gross: 12.0 },
    "40": { name: "Diavolo", klein: 8.0, gross: 10.0 },
    "200": { name: "Partyblech Margherita", single: 26.0 },
    "201": { name: "Familien-Pizza Margherita", single: 17.0 }
  },
  pizzabroetchen: {
    "45": { name: "Pizzabrötchen 10 Stück", price: 3.5 },
    "45a": { name: "Kräuterbutter Portion", price: 1.5 },
    "46": { name: "mit Käse", price: 6.0 },
    "47": { name: "mit Thunfisch", price: 7.0 },
    "48": { name: "mit Salami", price: 7.0 },
    "49": { name: "mit Schinken", price: 7.0 },
    "50": { name: "mit Bolognese", price: 7.0 },
    "51": { name: "mit Sucuk", price: 7.0 },
    "52": { name: "mit Spinat und Feta", price: 7.5 },
    "53": { name: "mit Thunfisch, Zwiebeln, Feta", price: 8.0 },
    "54": { name: "mit Dönerfleisch", price: 8.0 }
  },
  schnitzel: {
    "60": { name: "Wiener Art", haehnchen: 10.5, schwein: 10.0 },
    "61": { name: "Jägerschnitzel", haehnchen: 11.0, schwein: 10.5 },
    "62": { name: "Paprikaschnitzel", haehnchen: 11.0, schwein: 10.5 },
    "63": { name: "Champignonschnitzel", haehnchen: 12.0, schwein: 11.5 },
    "64": { name: "Schnitzel Hawaii", haehnchen: 12.0, schwein: 11.5 },
    "65": { name: "Broccoli Schnitzel", haehnchen: 12.0, schwein: 11.5 },
    "66": { name: "Spinat Schnitzel", haehnchen: 12.0, schwein: 11.5 },
    "67": { name: "Zwiebel Schnitzel", haehnchen: 12.0, schwein: 11.5 },
    "68": { name: "Hollandaise Schnitzel", haehnchen: 12.5, schwein: 12.0 }
  },
  burger: {
    "70": { name: "Burger Klassik", price: 8.5 },
    "71": { name: "Doppel-Burger", price: 11.5 },
    "72": { name: "Cheese Burger", price: 9.0 },
    "73": { name: "Doppel Cheese Burger", price: 12.0 },
    "74": { name: "Chicken Burger", price: 8.0 },
    "75": { name: "Chicken Nugget Burger", price: 8.0 }
  },
  imbiss: {
    "80": { name: "Pommes frites", price: 3.0 },
    "81": { name: "Pommes Spezial", price: 4.5 },
    "82": { name: "Bratrolle mit Pommes", price: 6.0 },
    "83": { name: "Bratrolle Spezial mit Pommes", price: 7.5 },
    "84": { name: "Bratwurst mit Pommes", price: 6.0 },
    "85": { name: "Currywurst mit Pommes", price: 6.5 },
    "86": { name: "Chicken Nuggets (6) mit Pommes", price: 6.0 },
    "87": { name: "Chicken Wings (8) mit Pommes", price: 8.5 },
    "88": { name: "Kartoffel-Kroketten (6)", price: 3.5 },
    "89": { name: "Mozzarella Sticks (6) mit Pommes", price: 8.0 },
    "90": { name: "Rindfleischkrokette mit Pommes", price: 5.0 },
    "95": { name: "Mayonnaise", price: 1.0 },
    "96": { name: "Ketchup", price: 1.0 }
  },
  pasta: {
    "100": { name: "Napoli", price: 9.0 },
    "101": { name: "Bolognese", price: 10.0 },
    "102": { name: "Carbonara", price: 10.0 },
    "103": { name: "Alla Panna", price: 10.5 },
    "104": { name: "Toscana", price: 11.0 },
    "105": { name: "Gorgonzola", price: 10.0 },
    "106": { name: "Salmone", price: 11.0 },
    "107": { name: "Vegetarisch", price: 11.0 },
    "108": { name: "Alla Chef", price: 11.0 },
    "109": { name: "Pasta Concordia", price: 10.5 },
    "110": { name: "Formaggi", price: 10.5 }
  },
  alForno: {
    "120": { name: "Gemüse Auflauf", price: 12.0 },
    "121": { name: "Döner Auflauf", price: 12.0 },
    "122": { name: "Penne Auflauf", price: 12.0 },
    "123": { name: "Spaghetti Auflauf", price: 12.0 },
    "124": { name: "Tortellini Auflauf", price: 12.0 }
  },
  salate: {
    "151": { name: "Salat Mista", price: 7.5 },
    "152": { name: "Salat Fantasia", price: 10.0 },
    "153": { name: "Salat Tonno", price: 9.0 },
    "154": { name: "Salat Concordia", price: 10.0 },
    "155": { name: "Salat Primavera", price: 10.0 },
    "156": { name: "Salat Caprese", price: 9.0 },
    "157": { name: "Salat Capricciosa", price: 10.0 },
    "158": { name: "Salat Hawaii", price: 9.5 },
    "159": { name: "Salat Casa", price: 10.5 },
    "160": { name: "Salat Hähnchen", price: 11.0 }
  },
  baguettes: {
    "161": { name: "Baguette mit Salami", price: 7.0 },
    "162": { name: "Baguette mit Hinterschinken", price: 7.0 },
    "163": { name: "Baguette mit Thunfisch", price: 7.0 },
    "164": { name: "Baguette mit Thunfisch und Ei", price: 7.5 },
    "165": { name: "Baguette mit Sucuk", price: 7.0 },
    "166": { name: "Baguette mit Sucuk und Ei", price: 7.5 },
    "167": { name: "Baguette mit Mozzarella", price: 7.5 }
  },
  getraenke: {
    "Coca-Cola 0.33l": 2.0,
    "Cola Zero 0.33l": 2.0,
    "Fanta 0.33l": 2.0,
    "Sprite 0.33l": 2.0,
    "Mineralwasser 0.25l": 2.0,
    "Uludog 0.33l": 2.0,
    "Fanta Exotik 0.33l": 2.0,
    "Durstlöscher 0.5l": 2.0,
    "Coca-Cola 1.0l": 3.0,
    "Cola Zero 1.0l": 3.0,
    "Fanta 1.0l": 3.0,
    "Sprite 1.0l": 3.0,
    "Mezzo-Mix 1.0l": 3.0,
    "Apfelschorle 1.0l": 3.0,
    "Krombacher Pils 0.5l": 3.0,
    "Radler 0.5l": 3.0,
    "Weizenbier 0.5l": 4.0
  }
};

function normNum(n) {
  return String(n ?? "").trim().toLowerCase();
}

function money(v) {
  return Math.round(Number(v) * 100) / 100;
}

function eq(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return money(a) === money(b);
}

function getSizePrices(item) {
  const sizeGroup = (item.variantGroups ?? []).find((g) =>
    /größe|groesse|size/i.test(g.name ?? "")
  );
  if (!sizeGroup) return null;
  const klein = sizeGroup.options?.find((o) => /klein/i.test(o.name ?? ""));
  const gross = sizeGroup.options?.find((o) => /groß|gross/i.test(o.name ?? ""));
  return {
    klein: klein?.price ?? null,
    gross: gross?.price ?? null
  };
}

function getMeatPrices(item) {
  const meatGroup = (item.variantGroups ?? []).find((g) =>
    /fleisch|hähnchen|schwein/i.test(g.name ?? "")
  );
  if (!meatGroup) return null;
  const haehnchen = meatGroup.options?.find((o) => /hähnchen|haehnchen/i.test(o.name ?? ""));
  const schwein = meatGroup.options?.find((o) => /schwein/i.test(o.name ?? ""));
  return {
    haehnchen: haehnchen?.price ?? null,
    schwein: schwein?.price ?? null
  };
}

function flattenFlyer() {
  const map = new Map();
  for (const [section, entries] of Object.entries(FLYER)) {
    if (section === "getraenke") continue;
    for (const [num, ref] of Object.entries(entries)) {
      map.set(normNum(num), { section, ...ref });
    }
  }
  return map;
}

const res = await fetch(`${API}/api/branches/concordia-kempen/menu`);
const json = await res.json();
const categories = json.data?.categories ?? json.categories ?? [];

const websiteByNum = new Map();
const websiteItems = [];
for (const cat of categories) {
  for (const item of cat.items ?? []) {
    const num = normNum(item.itemNumber);
    websiteByNum.set(num, { ...item, category: cat.name });
    websiteItems.push({ ...item, category: cat.name });
  }
}

const flyerByNum = flattenFlyer();
const differences = [];
const missingOnWebsite = [];
const extraOnWebsite = [];

for (const [num, ref] of flyerByNum) {
  const web = websiteByNum.get(num);
  if (!web) {
    missingOnWebsite.push({ num, section: ref.section, name: ref.name, flyer: ref });
    continue;
  }

  const label = `#${num} ${ref.name ?? web.name}`;

  if (ref.section === "pizzas") {
    const sizes = getSizePrices(web);
    if (ref.single != null) {
      const webPrice = web.price;
      if (!eq(webPrice, ref.single)) {
        differences.push({
          num,
          name: web.name,
          category: web.category,
          issue: "price",
          flyer: `€${ref.single}`,
          website: `€${webPrice}`
        });
      }
    } else if (ref.gross != null && ref.klein == null) {
      // calzone - only gross
      const gross = sizes?.gross ?? web.price;
      if (!eq(gross, ref.gross)) {
        differences.push({
          num,
          name: web.name,
          category: web.category,
          issue: "groß price",
          flyer: `€${ref.gross}`,
          website: `€${gross}`
        });
      }
    } else {
      if (sizes) {
        if (!eq(sizes.klein, ref.klein)) {
          differences.push({
            num,
            name: web.name,
            category: web.category,
            issue: "klein price",
            flyer: `€${ref.klein}`,
            website: `€${sizes.klein}`
          });
        }
        if (!eq(sizes.gross, ref.gross)) {
          differences.push({
            num,
            name: web.name,
            category: web.category,
            issue: "groß price",
            flyer: `€${ref.gross}`,
            website: `€${sizes.gross}`
          });
        }
      } else if (!eq(web.price, ref.klein)) {
        differences.push({
          num,
          name: web.name,
          category: web.category,
          issue: "base price",
          flyer: `€${ref.klein}`,
          website: `€${web.price}`
        });
      }
    }
  } else if (ref.section === "schnitzel") {
    const meats = getMeatPrices(web);
    if (meats) {
      if (!eq(meats.haehnchen, ref.haehnchen)) {
        differences.push({
          num,
          name: web.name,
          category: web.category,
          issue: "Hähnchen price",
          flyer: `€${ref.haehnchen}`,
          website: `€${meats.haehnchen}`
        });
      }
      if (!eq(meats.schwein, ref.schwein)) {
        differences.push({
          num,
          name: web.name,
          category: web.category,
          issue: "Schwein price",
          flyer: `€${ref.schwein}`,
          website: `€${meats.schwein}`
        });
      }
    } else if (!eq(web.price, ref.haehnchen)) {
      differences.push({
        num,
        name: web.name,
        category: web.category,
        issue: "price",
        flyer: `Hähnchen €${ref.haehnchen}`,
        website: `€${web.price}`
      });
    }
  } else if (ref.price != null) {
    if (!eq(web.price, ref.price)) {
      differences.push({
        num,
        name: web.name,
        category: web.category,
        issue: "price",
        flyer: `€${ref.price}`,
        website: `€${web.price}`
      });
    }
  }
}

for (const [num, web] of websiteByNum) {
  if (!flyerByNum.has(num)) {
    extraOnWebsite.push({
      num,
      name: web.name,
      category: web.category,
      price: web.price
    });
  }
}

console.log("=== WEBSITE CATEGORIES ===");
for (const c of categories) console.log(`  ${c.name}: ${c.items?.length ?? 0} items`);
console.log(`\nTotal website items: ${websiteItems.length}`);
console.log(`Total flyer items (numbered): ${flyerByNum.size}`);

console.log("\n=== MISSING ON WEBSITE (on flyer, not on site) ===");
for (const m of missingOnWebsite.sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }))) {
  const p =
    m.flyer.single != null
      ? `€${m.flyer.single}`
      : m.flyer.price != null
        ? `€${m.flyer.price}`
        : m.flyer.klein != null
          ? `klein €${m.flyer.klein} / groß €${m.flyer.gross}`
          : m.flyer.haehnchen != null
            ? `Hähnchen €${m.flyer.haehnchen} / Schwein €${m.flyer.schwein}`
            : "";
  console.log(`  #${m.num} [${m.section}] ${m.name} — flyer: ${p}`);
}

console.log("\n=== PRICE / NUMBER MISMATCHES ===");
for (const d of differences.sort((a, b) => String(a.num).localeCompare(String(b.num), undefined, { numeric: true }))) {
  console.log(`  #${d.num} ${d.name} (${d.category}) — ${d.issue}: flyer ${d.flyer}, website ${d.website}`);
}
if (!differences.length) console.log("  (none among items present on both)");

console.log("\n=== ON WEBSITE BUT NOT ON FLYER ===");
for (const e of extraOnWebsite.sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }))) {
  console.log(`  #${e.num} ${e.name} (${e.category}) — €${e.price}`);
}
