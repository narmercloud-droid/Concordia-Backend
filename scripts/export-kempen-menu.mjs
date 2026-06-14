/**
 * Export Kempen branch menu to Microsoft Word (.docx).
 * Usage: node scripts/export-kempen-menu.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";

const BASE = process.env.BASE_URL ?? "https://concordia-backend-web.onrender.com";
const BRANCH = "concordia-kempen";
const LANG = "de";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "exports");

async function fetchJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success && json.data === undefined) throw new Error(`${path} → ${JSON.stringify(json)}`);
  return json.data ?? json;
}

function mapVariantGroup(group) {
  return {
    id: group.id,
    name: group.name,
    required: Boolean(group.required),
    minSelect: group.minSelect ?? null,
    maxSelect: group.maxSelect ?? null,
    options: (group.options ?? []).map((o) => ({
      id: o.id,
      name: o.name,
      price: Number(o.price ?? 0),
      included: Boolean(o.included),
      pricesBySize: o.pricesBySize ?? null,
    })),
  };
}

function mapAddOnGroup(group) {
  return {
    id: group.id,
    name: group.name,
    minSelect: group.minSelect ?? null,
    maxSelect: group.maxSelect ?? null,
    options: (group.options ?? []).map((o) => ({
      id: o.id,
      name: o.name,
      price: Number(o.price ?? 0),
      pricesBySize: o.pricesBySize ?? null,
    })),
  };
}

async function fetchItemDetails(itemId) {
  const detail = await fetchJson(`/api/branches/${BRANCH}/items/${itemId}?lang=${LANG}`);
  return {
    id: detail.id,
    itemNumber: detail.itemNumber ?? null,
    name: detail.name,
    description: detail.description ?? "",
    basePrice: Number(detail.price ?? detail.basePrice ?? 0),
    kitchen: detail.kitchen ?? null,
    variantGroups: (detail.variantGroups ?? []).map(mapVariantGroup),
    addOnGroups: (detail.addOnGroups ?? []).map(mapAddOnGroup),
    extraPricing: detail.extraPricing ?? null,
  };
}

async function mapPool(items, fn, concurrency = 8) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

function fmt(n) {
  return Number(n).toFixed(2).replace(".", ",") + " €";
}

function fmtPricesBySize(pricesBySize) {
  if (!pricesBySize || typeof pricesBySize !== "object") return "";
  return Object.entries(pricesBySize)
    .map(([size, price]) => `${size}: ${fmt(price)}`)
    .join(", ");
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 } });
}

function categoryHeading(name, itemCount) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { color: "999999", space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [new TextRun({ text: name, bold: true, size: 32 })],
  });
}

function itemHeading(item) {
  const label = item.itemNumber ? `${item.itemNumber} – ${item.name}` : item.name;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 26 }),
      new TextRun({ text: `   (${fmt(item.basePrice)})`, size: 24, color: "444444" }),
    ],
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, ...opts })],
  });
}

function bulletLine(text, indent = 0) {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 + indent * 360 },
    children: [new TextRun({ text: `• ${text}`, size: 22 })],
  });
}

function buildItemParagraphs(item) {
  const paragraphs = [itemHeading(item)];

  if (item.description?.trim()) {
    paragraphs.push(bodyText(item.description, { italics: true, color: "555555" }));
  }

  for (const vg of item.variantGroups) {
    if (!vg.options.length) continue;
    const req = vg.required ? " (Pflicht)" : "";
    const select =
      vg.minSelect != null || vg.maxSelect != null
        ? ` [min ${vg.minSelect ?? 0}, max ${vg.maxSelect ?? "∞"}]`
        : "";
    paragraphs.push(bodyText(`Variante: ${vg.name}${req}${select}`, { bold: true }));
    for (const opt of vg.options) {
      const included = opt.included ? " – inklusive" : "";
      paragraphs.push(bulletLine(`${opt.name}: ${fmt(opt.price)}${included}`));
    }
  }

  for (const ag of item.addOnGroups) {
    if (!ag.options.length) continue;
    const select =
      ag.minSelect != null || ag.maxSelect != null
        ? ` [min ${ag.minSelect ?? 0}, max ${ag.maxSelect ?? "∞"}]`
        : "";
    paragraphs.push(bodyText(`Extras: ${ag.name}${select}`, { bold: true }));
    for (const opt of ag.options) {
      const sizePrices = fmtPricesBySize(opt.pricesBySize);
      const priceText = sizePrices ? `${fmt(opt.price)} (${sizePrices})` : fmt(opt.price);
      paragraphs.push(bulletLine(`${opt.name}: ${priceText}`));
    }
  }

  paragraphs.push(emptyLine());
  return paragraphs;
}

function buildDocument(exportData) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: exportData.branchName, bold: true, size: 48 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `Speisekarte – ${exportData.language.toUpperCase()} – ${exportData.currency}`,
          size: 28,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Exportiert am ${new Date(exportData.exportedAt).toLocaleString("de-DE")} · ${exportData.categoryCount} Kategorien · ${exportData.itemCount} Artikel`,
          size: 22,
          color: "888888",
        }),
      ],
    }),
  ];

  for (const cat of exportData.categories) {
    children.push(categoryHeading(cat.name, cat.itemCount));
    if (cat.description?.trim()) {
      children.push(bodyText(cat.description, { italics: true }));
    }
    for (const item of cat.items) {
      children.push(...buildItemParagraphs(item));
    }
  }

  return new Document({
    creator: "Concordia Backend",
    title: `${exportData.branchName} – Speisekarte`,
    description: "Kempen menu export for editing",
    sections: [{ properties: {}, children }],
  });
}

async function main() {
  console.log(`Fetching menu from ${BASE} …`);
  const menu = await fetchJson(`/api/branches/${BRANCH}/menu?lang=${LANG}`);
  const categories = menu.categories ?? menu;

  const exportData = {
    exportedAt: new Date().toISOString(),
    branchId: BRANCH,
    branchName: "Concordia Kempen",
    language: LANG,
    currency: "EUR",
    categoryCount: categories.length,
    itemCount: categories.reduce((n, c) => n + (c.items?.length ?? 0), 0),
    categories: [],
  };

  for (const cat of categories) {
    const items = cat.items ?? [];
    process.stdout.write(`Category: ${cat.name} (${items.length} items)…\n`);

    const detailedItems = await mapPool(items, async (row) => fetchItemDetails(row.id));

    exportData.categories.push({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? "",
      sortOrder: cat.sortOrder ?? null,
      itemCount: detailedItems.length,
      items: detailedItems.sort((a, b) => (a.itemNumber ?? "").localeCompare(b.itemNumber ?? "")),
    });
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const docxPath = join(OUT_DIR, "kempen-menu-export.docx");

  const doc = buildDocument(exportData);
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(docxPath, buffer);

  console.log("\nDone.");
  console.log("Word:", docxPath);
  console.log(`Categories: ${exportData.categoryCount}, Items: ${exportData.itemCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
