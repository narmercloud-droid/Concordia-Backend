/**
 * Generate printable QR codes that link to a branch ordering page.
 *
 * Usage:
 *   node scripts/generate-branch-qr.mjs
 *   node scripts/generate-branch-qr.mjs concordia-kempen
 *   node scripts/generate-branch-qr.mjs concordia-kempen --size 1200 --out ./my-qr.png
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import { KEMPEN_ORDER_URL } from "./kempen-promo-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BRANCHES = {
  "concordia-kempen": {
    label: "Concordia Kempen",
    slug: "kempen"
  },
  "concordia-straelen": {
    label: "Concordia Straelen",
    slug: "straelen"
  }
};

const DEFAULT_BRANCH = "concordia-kempen";
const DEFAULT_SIZE = 1024;

/** Production order URLs for print/social QR — never use staging or localhost. */
const PRODUCTION_BRANCH_ORDER_URLS = {
  "concordia-kempen": KEMPEN_ORDER_URL,
  "concordia-straelen": "https://www.concordiapizza.de/branch/concordia-straelen"
};

function parseArgs(argv) {
  const args = { branchId: DEFAULT_BRANCH, size: DEFAULT_SIZE, out: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--size") {
      args.size = Number(argv[++i]);
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (!arg.startsWith("-")) {
      args.branchId = arg;
    }
  }
  return args;
}

function buildBranchOrderUrl(branchId) {
  return PRODUCTION_BRANCH_ORDER_URLS[branchId] ?? `https://www.concordiapizza.de/branch/${branchId}`;
}

async function main() {
  const { branchId, size, out } = parseArgs(process.argv.slice(2));
  const meta = BRANCHES[branchId];

  if (!meta) {
    console.error(`Unknown branch: ${branchId}`);
    console.error(`Known branches: ${Object.keys(BRANCHES).join(", ")}`);
    process.exit(1);
  }

  if (!Number.isFinite(size) || size < 128) {
    console.error("--size must be at least 128");
    process.exit(1);
  }

  const orderUrl = buildBranchOrderUrl(branchId);
  const outputDir = path.join(__dirname, "output", "branch-qr");
  const defaultFile = path.join(outputDir, `${meta.slug}-order-qr.png`);
  const outputPath = out ? path.resolve(out) : defaultFile;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const png = await QRCode.toBuffer(orderUrl, {
    type: "png",
    width: size,
    margin: 2,
    errorCorrectionLevel: "H"
  });

  fs.writeFileSync(outputPath, png);

  const readmePath = path.join(outputDir, "README.txt");
  fs.writeFileSync(
    readmePath,
    [
      "Branch order QR codes",
      "",
      "Drop the PNG into your flyer (e.g. bottom-right, white background).",
      "Scan target: branch ordering page on concordiapizza.de",
      "",
      `Kempen:    ${KEMPEN_ORDER_URL}`,
      `Straelen:  ${PRODUCTION_BRANCH_ORDER_URLS["concordia-straelen"]}`,
      "",
      "Regenerate:",
      "  npm run generate:branch-qr",
      "  npm run generate:kempen-facebook-promo"
    ].join("\n")
  );

  console.log(`Branch:  ${meta.label} (${branchId})`);
  console.log(`URL:     ${orderUrl}`);
  console.log(`PNG:     ${outputPath}`);
  console.log(`Size:    ${size}px`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
