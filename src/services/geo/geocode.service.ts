import logger from "../../logger.ts";

type GeoPoint = { lat: number; lng: number } | null;

export type GeocodeOptions = {
  postalCode?: string;
  lat?: number;
  lng?: number;
};

function stripFloorFromAddress(address: string): string {
  return address
    .replace(/,\s*((?:\d+\.\s*)?(?:OG|Etage|Stock|Floor|Etag(?:e)?))(?=\s*,|\s*$)/i, "")
    .replace(/,\s*(?:Wohnung|Whg|Apartment|Apt\.?)[^,]*/i, "")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .trim();
}

function buildGeocodeQueries(address: string, postalCode?: string): string[] {
  const trimmed = address.trim();
  if (!trimmed) return [];

  const withoutFloor = stripFloorFromAddress(trimmed);
  const queries = [trimmed, withoutFloor];

  const postcode = postalCode?.trim() || trimmed.match(/\b(\d{5})\b/)?.[1];
  const cityMatch = trimmed.match(/\b\d{5}\s+([^,]+?)\s*$/i);
  const city = cityMatch?.[1]?.trim();

  if (postcode && city) {
    queries.push(`${postcode} ${city}, Germany`);
  } else if (postcode) {
    queries.push(`${postcode}, Germany`);
  }

  return [...new Set(queries.filter(Boolean))];
}

async function geocodeViaNominatim(query: string): Promise<GeoPoint> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
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
}

async function geocodeViaPhoton(query: string, postalCode?: string): Promise<GeoPoint> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "1");
  url.searchParams.set("lang", "de");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const payload = await res.json();
  const feature = Array.isArray(payload?.features) ? payload.features[0] : null;
  if (!feature) return null;

  const parsed = parsePhotonStreet(feature as Record<string, unknown>);
  if (!parsed) return null;
  if (postalCode && parsed.postalCode && parsed.postalCode !== postalCode) return null;

  return { lat: parsed.lat, lng: parsed.lng };
}

export async function geocodeAddress(
  address: string,
  options?: GeocodeOptions
): Promise<GeoPoint> {
  if (Number.isFinite(options?.lat) && Number.isFinite(options?.lng)) {
    return { lat: Number(options!.lat), lng: Number(options!.lng) };
  }

  if (!address?.trim()) return null;

  const queries = buildGeocodeQueries(address, options?.postalCode);

  try {
    for (const query of queries) {
      const point = await geocodeViaNominatim(query);
      if (point) return point;
    }

    for (const query of queries) {
      const point = await geocodeViaPhoton(query, options?.postalCode);
      if (point) return point;
    }

    return null;
  } catch (err) {
    logger.warn({ err, address }, "Geocoding failed");
    return null;
  }
}

export type AddressSuggestion = {
  label: string;
  street: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
};

function parseSuggestion(row: Record<string, unknown>): AddressSuggestion | null {
  const address = row.address as Record<string, unknown> | undefined;
  const postalCode = String(address?.postcode ?? "").trim();
  const city = String(
    address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? ""
  ).trim();
  const houseNumber = String(address?.house_number ?? "").trim();
  const road = String(address?.road ?? address?.pedestrian ?? row.name ?? "").trim();
  const street = [road, houseNumber].filter(Boolean).join(" ").trim();
  const lat = Number(row.lat);
  const lng = Number(row.lon);
  const displayName = String(row.display_name ?? "").trim();

  if (!postalCode || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const label =
    street.length > 0
      ? [street, `${postalCode} ${city}`.trim()].filter(Boolean).join(", ")
      : displayName || `${postalCode} ${city}`.trim();

  return {
    label,
    street: street || road || label.split(",")[0]?.trim() || label,
    postalCode,
    city,
    lat,
    lng
  };
}

function parsePhotonStreet(feature: Record<string, unknown>): AddressSuggestion | null {
  const props = feature.properties as Record<string, unknown> | undefined;
  const geometry = feature.geometry as { coordinates?: number[] } | undefined;
  const coords = geometry?.coordinates ?? [];
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);

  const street = String(props?.name ?? props?.street ?? "").trim();
  const postalCode = String(props?.postcode ?? "").trim();
  const city = String(props?.city ?? props?.district ?? "").trim();

  if (!street || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const label = [street, `${postalCode} ${city}`.trim()].filter(Boolean).join(", ");

  return {
    label,
    street,
    postalCode,
    city,
    lat,
    lng
  };
}

async function suggestViaPhoton(
  query: string,
  options?: {
    postalCode?: string;
    city?: string;
    nearCity?: string;
    limit?: number;
    lat?: number;
    lng?: number;
  }
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  const limit = options?.limit ?? 10;
  const cityHint = options?.city ?? options?.nearCity ?? "";
  const searchParts = [trimmed, options?.postalCode, cityHint, "Deutschland"].filter(Boolean);

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", searchParts.join(" "));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("lang", "de");
  url.searchParams.set("layer", "street");

  if (Number.isFinite(options?.lat) && Number.isFinite(options?.lng)) {
    url.searchParams.set("lat", String(options!.lat));
    url.searchParams.set("lon", String(options!.lng));
  }

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const payload = await res.json();
  const features = Array.isArray(payload?.features) ? payload.features : [];

  const seen = new Set<string>();
  const suggestions: AddressSuggestion[] = [];

  for (const feature of features) {
    const parsed = parsePhotonStreet(feature as Record<string, unknown>);
    if (!parsed) continue;
    if (options?.postalCode && parsed.postalCode && parsed.postalCode !== options.postalCode) {
      continue;
    }
    const key = `${parsed.street}|${parsed.postalCode}|${parsed.city}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push(parsed);
  }

  return suggestions;
}

export type ReverseGeocodeResult = {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
};

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Concordia-Restaurant-Platform/1.0"
      }
    });

    if (!res.ok) return null;

    const row = (await res.json()) as Record<string, unknown>;
    const address = row.address as Record<string, unknown> | undefined;
    const postalCode = String(address?.postcode ?? "").trim();
    const city = String(
      address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? ""
    ).trim();
    const road = String(address?.road ?? address?.pedestrian ?? "").trim();
    const houseNumber = String(address?.house_number ?? "").trim();
    const resultLat = Number(row.lat);
    const resultLng = Number(row.lon);

    if (!postalCode || !Number.isFinite(resultLat) || !Number.isFinite(resultLng)) {
      return null;
    }

    return {
      street: road,
      houseNumber,
      city: city || "",
      postalCode,
      lat: resultLat,
      lng: resultLng
    };
  } catch (err) {
    logger.warn({ err, lat, lng }, "Reverse geocoding failed");
    return null;
  }
}

export async function suggestAddresses(
  query: string,
  options?: {
    postalCode?: string;
    city?: string;
    limit?: number;
    nearCity?: string;
    lat?: number;
    lng?: number;
  }
): Promise<AddressSuggestion[]> {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const photon = await suggestViaPhoton(trimmed, options);
    if (photon.length > 0) return photon;
  } catch (err) {
    logger.warn({ err, query }, "Photon address suggest failed");
  }

  const limit = options?.limit ?? 8;
  const nearCity = options?.city ?? options?.nearCity ?? "";
  const hasPostcode = /\b\d{5}\b/.test(trimmed);
  const searchQuery = options?.postalCode
    ? `${trimmed}, ${options.postalCode}, Germany`
    : hasPostcode
      ? `${trimmed}, Germany`
      : nearCity
        ? `${trimmed}, ${nearCity}, Germany`
        : `${trimmed}, Germany`;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", searchQuery);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("countrycodes", "de");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Concordia-Restaurant-Platform/1.0"
      }
    });

    if (!res.ok) return [];

    const results = await res.json();
    if (!Array.isArray(results)) return [];

    const seen = new Set<string>();
    const suggestions: AddressSuggestion[] = [];

    for (const row of results) {
      const parsed = parseSuggestion(row as Record<string, unknown>);
      if (!parsed) continue;
      if (options?.postalCode && parsed.postalCode !== options.postalCode) continue;
      if (seen.has(parsed.label)) continue;
      seen.add(parsed.label);
      suggestions.push(parsed);
    }

    return suggestions;
  } catch (err) {
    logger.warn({ err, query }, "Address suggest failed");
    return [];
  }
}
