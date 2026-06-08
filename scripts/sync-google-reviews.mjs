/**
 * Pull Google reviews into googleReviewsSnapshot.json (offline fallback).
 * Requires GOOGLE_PLACES_API_KEY in env.
 *
 * Usage: node scripts/sync-google-reviews.mjs [branchId]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
if (!apiKey) {
  console.error("Missing GOOGLE_PLACES_API_KEY");
  process.exit(1);
}

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

async function findPlaceId() {
  if (meta.placeId) return meta.placeId;
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", meta.textQuery);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.candidates?.[0]?.place_id) {
    throw new Error(`Place lookup failed: ${data.status}`);
  }
  return data.candidates[0].place_id;
}

async function fetchDetails(placeId) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "rating,user_ratings_total,reviews,url,place_id");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("reviews_sort", "newest");
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK") throw new Error(`Details failed: ${data.status}`);
  return data.result;
}

function pickBest(reviews = []) {
  return reviews
    .map((r) => ({
      author: r.author_name,
      rating: r.rating,
      text: String(r.text ?? "").trim(),
      relativeTime: r.relative_time_description,
      profilePhotoUrl: r.profile_photo_url?.replace(/=w\d+-h\d+/, "=w72-h72")
    }))
    .filter((r) => r.rating >= 4 && r.text.length >= 20)
    .slice(0, 8);
}

const placeId = await findPlaceId();
const details = await fetchDetails(placeId);

snapshot[branchId] = {
  rating: details.rating ?? null,
  reviewCount: details.user_ratings_total ?? null,
  googleMapsUrl: details.url ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
  reviews: pickBest(details.reviews)
};

fs.writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Saved ${snapshot[branchId].reviews.length} reviews for ${branchId}`);
if (placeId && !meta.placeId) {
  meta.placeId = placeId;
  fs.writeFileSync(
    path.join(__dirname, "../src/config/branchGooglePlaces.json"),
    `${JSON.stringify(branchPlaces, null, 2)}\n`
  );
  console.log(`Stored placeId ${placeId} in branchGooglePlaces.json`);
}
