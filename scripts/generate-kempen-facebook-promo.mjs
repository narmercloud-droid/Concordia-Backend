/**
 * Kempen summer promo kit: verified QR + Facebook post copy + shareable HTML visual.
 *
 * Usage: node scripts/generate-kempen-facebook-promo.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import {
  KEMPEN_ORDER_URL,
  KEMPEN_PROMO,
  facebookPostText,
  facebookPostShort
} from "./kempen-promo-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "output", "kempen-facebook-promo");

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const qrPng = await QRCode.toBuffer(KEMPEN_ORDER_URL, {
    type: "png",
    width: 520,
    margin: 1,
    errorCorrectionLevel: "H"
  });
  const qrDataUrl = `data:image/png;base64,${qrPng.toString("base64")}`;

  const qrStandalone = path.join(OUT, "kempen-order-qr.png");
  fs.writeFileSync(qrStandalone, qrPng);

  const postFull = facebookPostText();
  const postShort = facebookPostShort();
  fs.writeFileSync(path.join(OUT, "facebook-post.txt"), postFull);
  fs.writeFileSync(path.join(OUT, "facebook-post-short.txt"), postShort);

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pizzeria Concordia Kempen — Sommer-Aktion</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a2744;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      padding: 24px;
    }
    .card {
      width: 1080px;
      height: 1080px;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(165deg, #5eb3f6 0%, #87ceeb 38%, #b8e986 72%, #f7e98e 100%);
      box-shadow: 0 24px 80px rgba(0,0,0,.35);
    }
    .card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,.45), transparent 55%),
        radial-gradient(circle at 12% 88%, rgba(255,214,0,.35) 0, transparent 28%),
        radial-gradient(circle at 88% 92%, rgba(255,214,0,.3) 0, transparent 24%);
      pointer-events: none;
    }
    .inner {
      position: relative;
      z-index: 1;
      height: 100%;
      padding: 56px 52px 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .brand {
      font-size: 58px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 12px rgba(255,255,255,.5);
    }
    .brand .pizzeria { color: #1b7a3d; }
    .brand .name { color: #c41e24; }
    .badge {
      margin-top: 22px;
      background: linear-gradient(135deg, #ff8c00, #ff5e00);
      color: #fff;
      font-size: 26px;
      font-weight: 800;
      padding: 14px 36px;
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(255,94,0,.35);
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .sub {
      margin-top: 18px;
      font-size: 30px;
      font-weight: 700;
      color: #1a3d5c;
    }
    .benefits {
      margin-top: 28px;
      width: 100%;
      max-width: 820px;
      display: grid;
      gap: 12px;
      text-align: left;
    }
    .benefit {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(255,255,255,.82);
      border-radius: 16px;
      padding: 14px 18px;
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      box-shadow: 0 4px 16px rgba(0,0,0,.08);
    }
    .benefit span:first-child { flex-shrink: 0; font-size: 26px; }
    .qr-block {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 28px;
      background: rgba(255,255,255,.92);
      border-radius: 20px;
      padding: 22px 28px;
      box-shadow: 0 8px 32px rgba(0,0,0,.12);
    }
    .qr-block img {
      width: 200px;
      height: 200px;
      border-radius: 12px;
      border: 4px solid #fff;
      box-shadow: 0 4px 16px rgba(0,0,0,.15);
    }
    .qr-text { text-align: left; }
    .qr-text .cta {
      font-size: 28px;
      font-weight: 800;
      color: #c41e24;
      margin-bottom: 6px;
    }
    .qr-text .url {
      font-size: 17px;
      font-weight: 600;
      color: #374151;
      word-break: break-all;
      line-height: 1.35;
    }
    .qr-text .loc {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #1b7a3d;
    }
    .footer {
      margin-top: 18px;
      font-size: 18px;
      font-weight: 600;
      color: rgba(26,39,68,.75);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="inner">
      <div class="brand">
        <span class="pizzeria">Pizzeria</span>
        <span class="name"> Concordia</span>
      </div>
      <div class="badge">${KEMPEN_PROMO.headline}</div>
      <div class="sub">${KEMPEN_PROMO.subheadline}</div>
      <div class="benefits">
        ${KEMPEN_PROMO.benefits
          .map((b) => `<div class="benefit"><span>✅</span><span>${b}</span></div>`)
          .join("\n        ")}
      </div>
      <div class="qr-block">
        <img src="${qrDataUrl}" alt="QR Code — Online bestellen" width="200" height="200" />
        <div class="qr-text">
          <div class="cta">${KEMPEN_PROMO.cta}</div>
          <div class="url">${KEMPEN_ORDER_URL}</div>
          <div class="loc">📍 ${KEMPEN_PROMO.location}</div>
        </div>
      </div>
      <div class="footer">❤️ ${KEMPEN_PROMO.slogan}</div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, "facebook-post-visual.html"), html);

  fs.writeFileSync(
    path.join(OUT, "README.txt"),
    [
      "Kempen Facebook promo kit",
      "",
      `Order URL (QR target): ${KEMPEN_ORDER_URL}`,
      "",
      "Files:",
      "  facebook-post.txt         — full post copy (paste into Facebook)",
      "  facebook-post-short.txt   — shorter variant",
      "  facebook-post-visual.html — open in browser, screenshot 1080×1080 for image post",
      "  kempen-order-qr.png       — standalone QR (print / Canva)",
      "",
      "Regenerate: npm run generate:kempen-facebook-promo"
    ].join("\n")
  );

  console.log("Kempen Facebook promo generated");
  console.log(`QR URL:  ${KEMPEN_ORDER_URL}`);
  console.log(`Output:  ${OUT}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
