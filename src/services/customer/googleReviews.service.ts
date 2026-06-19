import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../../prisma/client.ts";
import { getSimpleCache, setSimpleCache, deleteSimpleCache } from "../../lib/simpleCache.ts";
import { getCache, setCache, deleteCache } from "../../lib/redis.ts";
import logger from "../../logger.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.join(__dirname, "../../config");
const SNAPSHOT_PATH = path.join(CONFIG_DIR, "googleReviewsSnapshot.json");

type BranchPlacesConfig = Record<
  string,
  { textQuery?: string; googleMapsQuery?: string; placeId?: string }
>;

let branchPlacesCache: BranchPlacesConfig | null = null;

function getBranchPlaces(): BranchPlacesConfig {
  if (branchPlacesCache) return branchPlacesCache;
  const filePath = path.join(CONFIG_DIR, "branchGooglePlaces.json");
  try {
    branchPlacesCache = JSON.parse(fs.readFileSync(filePath, "utf8")) as BranchPlacesConfig;
  } catch (err) {
    logger.warn({ err, filePath }, "branchGooglePlaces.json missing or invalid");
    branchPlacesCache = {};
  }
  return branchPlacesCache;
}

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  profilePhotoUrl?: string;
};

export type BranchGoogleReviews = {
  branchId: string;
  branchName: string;
  source: "google" | "snapshot" | "unavailable";
  rating: number | null;
  reviewCount: number | null;
  googleMapsUrl: string | null;
  reviews: GoogleReview[];
};

const CACHE_TTL_SEC = 6 * 60 * 60;

function googleMapsUrlFor(branchId: string, placeId?: string | null) {
  const meta = getBranchPlaces()[branchId];
  if (placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  }
  if (meta?.googleMapsQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${meta.googleMapsQuery}`;
  }
  return null;
}

function enhancePhotoUrl(url?: string) {
  if (!url) return undefined;
  return url.replace(/=w\d+-h\d+/, "=w72-h72");
}

function relativeTimeSortKey(relativeTime?: string) {
  if (!relativeTime) return Number.MAX_SAFE_INTEGER;
  const t = relativeTime.toLowerCase();
  const week = t.match(/vor (\d+) woche/);
  if (week) return Number(week[1]) * 7;
  const weeks = t.match(/vor (\d+) wochen/);
  if (weeks) return Number(weeks[1]) * 7;
  const month = t.match(/vor (\d+) monat/);
  if (month) return Number(month[1]) * 30;
  const months = t.match(/vor (\d+) monaten/);
  if (months) return Number(months[1]) * 30;
  if (t.includes("vor einem monat")) return 30;
  if (t.includes("vor einem jahr")) return 365;
  const years = t.match(/vor (\d+) jahr/);
  if (years) return Number(years[1]) * 365;
  const yearsPlural = t.match(/vor (\d+) jahren/);
  if (yearsPlural) return Number(yearsPlural[1]) * 365;
  const parsed = Date.parse(relativeTime);
  if (!Number.isNaN(parsed)) return Math.max(0, Math.floor((Date.now() - parsed) / 86_400_000));
  return 10_000;
}

function normalizeReview(r: GoogleReview): GoogleReview {
  return {
    ...r,
    profilePhotoUrl: enhancePhotoUrl(r.profilePhotoUrl)
  };
}

function sortReviewsNewestFirst(reviews: GoogleReview[]) {
  return [...reviews].sort(
    (a, b) => relativeTimeSortKey(a.relativeTime) - relativeTimeSortKey(b.relativeTime)
  );
}

function pickBestReviews(
  reviews: Array<{ rating?: number; text?: string; author_name?: string; relative_time_description?: string; profile_photo_url?: string; time?: number }>
): GoogleReview[] {
  return sortReviewsNewestFirst(
    reviews
      .map((r) =>
        normalizeReview({
          author: String(r.author_name ?? "Google user"),
          rating: Number(r.rating ?? 0),
          text: String(r.text ?? "").trim(),
          relativeTime: r.relative_time_description,
          profilePhotoUrl: r.profile_photo_url
        })
      )
      .filter((r) => r.rating >= 4 && r.text.length >= 20)
  ).slice(0, 8);
}

function loadSnapshot(branchId: string): BranchGoogleReviews | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try {
    const all = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8")) as Record<
      string,
      Omit<BranchGoogleReviews, "branchId" | "source">
    >;
    const row = all[branchId];
    if (!row?.reviews?.length) return null;
    return {
      branchId,
      branchName: "",
      source: "snapshot",
      rating: row.rating ?? null,
      reviewCount: row.reviewCount ?? null,
      googleMapsUrl: row.googleMapsUrl ?? googleMapsUrlFor(branchId),
      reviews: sortReviewsNewestFirst(row.reviews.map(normalizeReview))
    };
  } catch {
    return null;
  }
}

async function resolvePlaceId(
  apiKey: string,
  branchId: string,
  configPlaceId?: string
): Promise<string | null> {
  if (configPlaceId) return configPlaceId;

  const meta = getBranchPlaces()[branchId];
  if (!meta?.textQuery) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", meta.textQuery);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = (await res.json()) as {
    status?: string;
    candidates?: Array<{ place_id?: string }>;
  };

  if (data.status !== "OK" || !data.candidates?.[0]?.place_id) {
    logger.warn({ branchId, status: data.status }, "Google place lookup failed");
    return null;
  }

  return data.candidates[0].place_id;
}

async function fetchFromGoogle(
  apiKey: string,
  placeId: string
): Promise<Pick<BranchGoogleReviews, "rating" | "reviewCount" | "googleMapsUrl" | "reviews"> | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "name,rating,user_ratings_total,reviews,url,place_id"
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("reviews_sort", "newest");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = (await res.json()) as {
    status?: string;
    result?: {
      rating?: number;
      user_ratings_total?: number;
      reviews?: Array<Record<string, unknown>>;
      url?: string;
      place_id?: string;
    };
  };

  if (data.status !== "OK" || !data.result) {
    logger.warn({ placeId, status: data.status }, "Google place details failed");
    return null;
  }

  const reviews = pickBestReviews((data.result.reviews ?? []) as Array<{
    rating?: number;
    text?: string;
    author_name?: string;
    relative_time_description?: string;
    profile_photo_url?: string;
  }>);

  return {
    rating: Number.isFinite(data.result.rating) ? Number(data.result.rating) : null,
    reviewCount: Number.isFinite(data.result.user_ratings_total)
      ? Number(data.result.user_ratings_total)
      : null,
    googleMapsUrl: data.result.url ?? googleMapsUrlFor("", data.result.place_id),
    reviews
  };
}

export function invalidateGoogleReviewsCache(branchId: string) {
  const cacheKey = `google-reviews:${branchId}`;
  deleteSimpleCache(cacheKey);
  void deleteCache(cacheKey);
}

export async function getBranchGoogleReviews(branchId: string): Promise<BranchGoogleReviews> {
  const cacheKey = `google-reviews:${branchId}`;
  const cachedMemory = getSimpleCache<BranchGoogleReviews>(cacheKey);
  if (cachedMemory) return cachedMemory;

  const cachedRedis = await getCache(cacheKey);
  if (cachedRedis) {
    try {
      const parsed = JSON.parse(cachedRedis) as BranchGoogleReviews;
      setSimpleCache(cacheKey, parsed, CACHE_TTL_SEC * 1000);
      return parsed;
    } catch {
      // ignore corrupt cache
    }
  }

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { BranchConfig: true }
  });

  if (!branch) {
    throw { code: "NOT_FOUND", message: "Branch not found" };
  }

  const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const configPlaceId =
    String(config.googlePlaceId ?? getBranchPlaces()[branchId]?.placeId ?? "").trim() || null;

  let result: BranchGoogleReviews = {
    branchId,
    branchName: branch.name,
    source: "unavailable",
    rating: null,
    reviewCount: null,
    googleMapsUrl: googleMapsUrlFor(branchId, configPlaceId),
    reviews: []
  };

  if (apiKey) {
    try {
      const placeId = await resolvePlaceId(apiKey, branchId, configPlaceId ?? undefined);
      if (placeId) {
        const live = await fetchFromGoogle(apiKey, placeId);
        if (live && live.reviews.length > 0) {
          result = {
            branchId,
            branchName: branch.name,
            source: "google",
            ...live,
            googleMapsUrl: live.googleMapsUrl ?? googleMapsUrlFor(branchId, placeId)
          };
        }
      }
    } catch (err) {
      logger.warn({ err, branchId }, "Google reviews fetch failed");
    }
  }

  if (result.reviews.length === 0) {
    const snapshot = loadSnapshot(branchId);
    if (snapshot) result = { ...snapshot, branchName: branch.name };
  }

  setSimpleCache(cacheKey, result, CACHE_TTL_SEC * 1000);
  await setCache(cacheKey, JSON.stringify(result), CACHE_TTL_SEC);
  return result;
}
