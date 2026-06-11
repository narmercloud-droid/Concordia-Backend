import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../../prisma/client.js";
import { getSimpleCache, setSimpleCache } from "../../lib/simpleCache.js";
import { getCache, setCache } from "../../lib/redis.js";
import logger from "../../logger.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.join(__dirname, "../../config");
const SNAPSHOT_PATH = path.join(CONFIG_DIR, "googleReviewsSnapshot.json");
let branchPlacesCache = null;
function getBranchPlaces() {
    if (branchPlacesCache)
        return branchPlacesCache;
    const filePath = path.join(CONFIG_DIR, "branchGooglePlaces.json");
    try {
        branchPlacesCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    catch (err) {
        logger.warn({ err, filePath }, "branchGooglePlaces.json missing or invalid");
        branchPlacesCache = {};
    }
    return branchPlacesCache;
}
const CACHE_TTL_SEC = 6 * 60 * 60;
function googleMapsUrlFor(branchId, placeId) {
    const meta = getBranchPlaces()[branchId];
    if (placeId) {
        return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    }
    if (meta?.googleMapsQuery) {
        return `https://www.google.com/maps/search/?api=1&query=${meta.googleMapsQuery}`;
    }
    return null;
}
function enhancePhotoUrl(url) {
    if (!url)
        return undefined;
    return url.replace(/=w\d+-h\d+/, "=w72-h72");
}
function relativeTimeSortKey(relativeTime) {
    if (!relativeTime)
        return Number.MAX_SAFE_INTEGER;
    const t = relativeTime.toLowerCase();
    const week = t.match(/vor (\d+) woche/);
    if (week)
        return Number(week[1]) * 7;
    const weeks = t.match(/vor (\d+) wochen/);
    if (weeks)
        return Number(weeks[1]) * 7;
    const month = t.match(/vor (\d+) monat/);
    if (month)
        return Number(month[1]) * 30;
    const months = t.match(/vor (\d+) monaten/);
    if (months)
        return Number(months[1]) * 30;
    if (t.includes("vor einem monat"))
        return 30;
    if (t.includes("vor einem jahr"))
        return 365;
    const years = t.match(/vor (\d+) jahr/);
    if (years)
        return Number(years[1]) * 365;
    const yearsPlural = t.match(/vor (\d+) jahren/);
    if (yearsPlural)
        return Number(yearsPlural[1]) * 365;
    const parsed = Date.parse(relativeTime);
    if (!Number.isNaN(parsed))
        return Math.max(0, Math.floor((Date.now() - parsed) / 86400000));
    return 10000;
}
function normalizeReview(r) {
    return {
        ...r,
        profilePhotoUrl: enhancePhotoUrl(r.profilePhotoUrl)
    };
}
function sortReviewsNewestFirst(reviews) {
    return [...reviews].sort((a, b) => relativeTimeSortKey(a.relativeTime) - relativeTimeSortKey(b.relativeTime));
}
function pickBestReviews(reviews) {
    return sortReviewsNewestFirst(reviews
        .map((r) => normalizeReview({
        author: String(r.author_name ?? "Google user"),
        rating: Number(r.rating ?? 0),
        text: String(r.text ?? "").trim(),
        relativeTime: r.relative_time_description,
        profilePhotoUrl: r.profile_photo_url
    }))
        .filter((r) => r.rating >= 4 && r.text.length >= 20)).slice(0, 8);
}
function loadSnapshot(branchId) {
    if (!fs.existsSync(SNAPSHOT_PATH))
        return null;
    try {
        const all = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
        const row = all[branchId];
        if (!row?.reviews?.length)
            return null;
        return {
            branchId,
            branchName: "",
            source: "snapshot",
            rating: row.rating ?? null,
            reviewCount: row.reviewCount ?? null,
            googleMapsUrl: row.googleMapsUrl ?? googleMapsUrlFor(branchId),
            reviews: sortReviewsNewestFirst(row.reviews.map(normalizeReview))
        };
    }
    catch {
        return null;
    }
}
async function resolvePlaceId(apiKey, branchId, configPlaceId) {
    if (configPlaceId)
        return configPlaceId;
    const meta = getBranchPlaces()[branchId];
    if (!meta?.textQuery)
        return null;
    const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    url.searchParams.set("input", meta.textQuery);
    url.searchParams.set("inputtype", "textquery");
    url.searchParams.set("fields", "place_id");
    url.searchParams.set("key", apiKey);
    const res = await fetch(url.toString());
    if (!res.ok)
        return null;
    const data = (await res.json());
    if (data.status !== "OK" || !data.candidates?.[0]?.place_id) {
        logger.warn({ branchId, status: data.status }, "Google place lookup failed");
        return null;
    }
    return data.candidates[0].place_id;
}
async function fetchFromGoogle(apiKey, placeId) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url,place_id");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("reviews_sort", "newest");
    const res = await fetch(url.toString());
    if (!res.ok)
        return null;
    const data = (await res.json());
    if (data.status !== "OK" || !data.result) {
        logger.warn({ placeId, status: data.status }, "Google place details failed");
        return null;
    }
    const reviews = pickBestReviews((data.result.reviews ?? []));
    return {
        rating: Number.isFinite(data.result.rating) ? Number(data.result.rating) : null,
        reviewCount: Number.isFinite(data.result.user_ratings_total)
            ? Number(data.result.user_ratings_total)
            : null,
        googleMapsUrl: data.result.url ?? googleMapsUrlFor("", data.result.place_id),
        reviews
    };
}
export async function getBranchGoogleReviews(branchId) {
    const cacheKey = `google-reviews:${branchId}`;
    const cachedMemory = getSimpleCache(cacheKey);
    if (cachedMemory)
        return cachedMemory;
    const cachedRedis = await getCache(cacheKey);
    if (cachedRedis) {
        try {
            const parsed = JSON.parse(cachedRedis);
            setSimpleCache(cacheKey, parsed, CACHE_TTL_SEC * 1000);
            return parsed;
        }
        catch {
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
    const config = (branch.BranchConfig?.configJson ?? {});
    const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
    const configPlaceId = String(config.googlePlaceId ?? getBranchPlaces()[branchId]?.placeId ?? "").trim() || null;
    let result = {
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
        }
        catch (err) {
            logger.warn({ err, branchId }, "Google reviews fetch failed");
        }
    }
    if (result.reviews.length === 0) {
        const snapshot = loadSnapshot(branchId);
        if (snapshot)
            result = { ...snapshot, branchName: branch.name };
    }
    setSimpleCache(cacheKey, result, CACHE_TTL_SEC * 1000);
    await setCache(cacheKey, JSON.stringify(result), CACHE_TTL_SEC);
    return result;
}
