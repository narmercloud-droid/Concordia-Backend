import logger from "../../logger.ts";

type GeoPoint = { lat: number; lng: number } | null;

export async function geocodeAddress(address: string): Promise<GeoPoint> {
  if (!address?.trim()) return null;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", address);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "de");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Concordia-Restaurant-Platform/1.0"
      }
    });

    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const lat = Number(results[0].lat);
    const lng = Number(results[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch (err) {
    logger.warn({ err, address }, "Geocoding failed");
    return null;
  }
}
