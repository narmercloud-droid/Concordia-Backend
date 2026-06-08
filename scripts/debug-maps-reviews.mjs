import { chromium } from "@playwright/test";

const query = process.argv[2] ?? "Pizzeria Concordia II Straelen";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ locale: "de-DE" });
await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
  waitUntil: "domcontentloaded",
  timeout: 60000
});
await page.waitForTimeout(4000);
const consent = page.locator(
  'button:has-text("Alle akzeptieren"), button:has-text("Accept all")'
);
if (await consent.first().isVisible({ timeout: 3000 }).catch(() => false)) {
  await consent.first().click();
  await page.waitForTimeout(1500);
}
const href = await page.locator('a[href*="/maps/place/"]').first().getAttribute("href");
console.log("place", href);
if (href) {
  const placeUrl = href.startsWith("http") ? href.split("?")[0] : `https://www.google.com${href.split("?")[0]}`;
  await page.goto(placeUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const rev = page.locator(
    'button:has-text("Rezensionen"), button[aria-label*="Rezensionen"]'
  );
  if (await rev.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await rev.first().click();
    await page.waitForTimeout(3000);
  }
  const cards = page.locator("div.jftiEf.fontBodyMedium");
  const n = await cards.count();
  console.log("cards", n);
  for (let i = 0; i < Math.min(8, n); i++) {
    const c = cards.nth(i);
    const a = (await c.locator("div.d4r55").first().textContent().catch(() => ""))?.trim();
    const t = (await c.locator("span.wiI7pd").first().textContent().catch(() => ""))?.trim();
    const time = (await c.locator("span.rsqaWe").first().textContent().catch(() => ""))?.trim();
    console.log(`${i + 1}. ${a} (${time}) — ${t?.slice(0, 80)}`);
  }
}
await browser.close();
