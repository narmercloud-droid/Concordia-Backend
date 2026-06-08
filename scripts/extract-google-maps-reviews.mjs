/**
 * Extract public Google Maps reviews (author, photo, text, time) into snapshot JSON.
 * Usage: node scripts/extract-google-maps-reviews.mjs [branchId]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const branchPlaces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/config/branchGooglePlaces.json"), "utf8")
);
const snapshotPath = path.join(__dirname, "../src/config/googleReviewsSnapshot.json");
const snapshot = fs.existsSync(snapshotPath)
  ? JSON.parse(fs.readFileSync(snapshotPath, "utf8"))
  : {};

const branchId = process.argv[2] ?? "concordia-kempen";
const meta = branchPlaces[branchId];
if (!meta) {
  console.error(`Unknown branch: ${branchId}`);
  process.exit(1);
}

const mapsUrl =
  meta.googleMapsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${meta.googleMapsQuery ?? meta.textQuery}`;

function dedupeReviews(reviews) {
  const seen = new Set();
  return reviews.filter((r) => {
    const key = `${r.author}::${r.text.slice(0, 80)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickReviews(reviews) {
  return dedupeReviews(reviews)
    .filter((r) => r.rating >= 4 && r.text.length >= 20)
    .slice(0, 8);
}

async function extractReviews(page) {
  await page.goto(mapsUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);

  const firstResult = page.locator('a[href*="/maps/place/"]').first();
  if (mapsUrl.includes("/search/") && await firstResult.isVisible({ timeout: 5000 }).catch(() => false)) {
    const placeHref = await firstResult.getAttribute("href");
    if (placeHref?.startsWith("http")) {
      await page.goto(placeHref.split("?")[0], { waitUntil: "domcontentloaded", timeout: 60000 });
    } else if (placeHref) {
      await page.goto(`https://www.google.com${placeHref.split("?")[0]}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
    } else {
      await firstResult.click();
    }
    await page.waitForTimeout(3000);
  }

  const consent = page.locator('button:has-text("Accept all"), button:has-text("Alle akzeptieren"), button:has-text("Alles accepteren")');
  if (await consent.first().isVisible({ timeout: 4000 }).catch(() => false)) {
    await consent.first().click();
    await page.waitForTimeout(1500);
  }

  const reviewsTab = page.locator('button[aria-label*="Reviews"], button[aria-label*="Rezensionen"], button:has-text("Reviews"), button:has-text("Rezensionen")');
  if (await reviewsTab.first().isVisible({ timeout: 8000 }).catch(() => false)) {
    await reviewsTab.first().click();
    await page.waitForTimeout(2000);
  }

  const sortBtn = page.locator('button[aria-label*="Sort"], button[aria-label*="Sortieren"], button:has-text("Sortieren"), button:has-text("Sort")');
  if (await sortBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await sortBtn.first().click();
    await page.waitForTimeout(800);
    const newest = page.locator('[role="menuitem"]:has-text("Newest"), [role="menuitem"]:has-text("Neueste"), [data-index="1"]');
    if (await newest.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await newest.first().click();
      await page.waitForTimeout(2000);
    }
  }

  const ratingText = await page
    .locator('div.F7nice span[aria-hidden="true"], span.ceNzKf')
    .first()
    .textContent()
    .catch(() => null);
  const countText = await page
    .locator('button[jsaction*="reviews"], span:has-text("reviews"), span:has-text("Rezensionen")')
    .first()
    .textContent()
    .catch(() => null);

  const reviewCountMatch = countText?.match(/([\d.,]+)/);
  const reviewCount = reviewCountMatch ? Number(reviewCountMatch[1].replace(/\./g, "").replace(",", ".")) : null;
  const rating = ratingText ? Number(ratingText.replace(",", ".")) : null;

  const scrollPane = page.locator('div[role="main"] div.m6QErb.DxyBCb').first();
  for (let i = 0; i < 8; i++) {
    if (await scrollPane.isVisible({ timeout: 2000 }).catch(() => false)) {
      await scrollPane.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await page.waitForTimeout(1200);
    }
  }

  const cards = page.locator('div[data-review-id], div.jftiEf.fontBodyMedium');
  const count = Math.min(await cards.count(), 20);
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const author =
      (await card.locator("div.d4r55").first().textContent().catch(() => null))?.trim() ||
      (await card.locator("button.WEBjve").first().textContent().catch(() => null))?.trim() ||
      "Google user";
    const relativeTime =
      (await card.locator("span.rsqaWe").first().textContent().catch(() => null))?.trim() || undefined;
    const starsLabel = await card.locator('span[role="img"][aria-label*="star"], span[role="img"][aria-label*="Stern"]').first().getAttribute("aria-label").catch(() => "");
    const ratingMatch = starsLabel?.match(/(\d)/);
    const reviewRating = ratingMatch ? Number(ratingMatch[1]) : 5;
    const text =
      (await card.locator("span.wiI7pd").first().textContent().catch(() => null))?.trim() ||
      (await card.locator("div.MyEned").first().textContent().catch(() => null))?.trim() ||
      "";
    const photoUrl =
      (await card.locator("button.WEBjve img, img.NBa7we").first().getAttribute("src").catch(() => null)) || undefined;

    if (!text) continue;
    reviews.push({
      author,
      rating: reviewRating,
      text,
      relativeTime,
      profilePhotoUrl: photoUrl
    });
  }

  return {
    rating,
    reviewCount,
    googleMapsUrl: page.url(),
    reviews: pickReviews(reviews)
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  locale: "de-DE",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
});

try {
  const result = await extractReviews(page);
  const existing = snapshot[branchId] ?? {};
  snapshot[branchId] = {
    ...existing,
    ...result,
    googleMapsUrl: meta.googleMapsQuery
      ? `https://www.google.com/maps/search/?api=1&query=${meta.googleMapsQuery}`
      : result.googleMapsUrl
  };
  fs.writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Saved ${snapshot[branchId].reviews.length} reviews for ${branchId}`);
  console.log(JSON.stringify(snapshot[branchId].reviews.slice(0, 2), null, 2));
} finally {
  await browser.close();
}
