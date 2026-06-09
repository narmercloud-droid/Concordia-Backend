import logger from "../../logger.js";
export async function geocodeAddress(address) {
    if (!address?.trim())
        return null;
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
        if (!res.ok)
            return null;
        const results = await res.json();
        if (!Array.isArray(results) || results.length === 0)
            return null;
        const lat = Number(results[0].lat);
        const lng = Number(results[0].lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng))
            return null;
        return { lat, lng };
    }
    catch (err) {
        logger.warn({ err, address }, "Geocoding failed");
        return null;
    }
}
function parseSuggestion(row) {
    const address = row.address;
    const postalCode = String(address?.postcode ?? "").trim();
    const city = String(address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? "").trim();
    const houseNumber = String(address?.house_number ?? "").trim();
    const road = String(address?.road ?? address?.pedestrian ?? row.name ?? "").trim();
    const street = [road, houseNumber].filter(Boolean).join(" ").trim();
    const lat = Number(row.lat);
    const lng = Number(row.lon);
    const displayName = String(row.display_name ?? "").trim();
    if (!postalCode || !Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
    }
    const label = street.length > 0
        ? [street, `${postalCode} ${city}`.trim()].filter(Boolean).join(", ")
        : displayName || `${postalCode} ${city}`.trim();
    return {
        label,
        street: street || road || label.split(",")[0]?.trim() || label,
        postalCode,
        city: city || "Kempen",
        lat,
        lng
    };
}
export async function suggestAddresses(query, options) {
    const trimmed = query?.trim();
    if (!trimmed || trimmed.length < 3)
        return [];
    const limit = options?.limit ?? 6;
    const hasPostcode = /\b\d{5}\b/.test(trimmed);
    const searchQuery = options?.postalCode
        ? `${trimmed}, ${options.postalCode}, Germany`
        : hasPostcode
            ? `${trimmed}, Germany`
            : `${trimmed}, Kempen, Germany`;
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
        if (!res.ok)
            return [];
        const results = await res.json();
        if (!Array.isArray(results))
            return [];
        const seen = new Set();
        const suggestions = [];
        for (const row of results) {
            const parsed = parseSuggestion(row);
            if (!parsed)
                continue;
            if (options?.postalCode && parsed.postalCode !== options.postalCode)
                continue;
            if (seen.has(parsed.label))
                continue;
            seen.add(parsed.label);
            suggestions.push(parsed);
        }
        return suggestions;
    }
    catch (err) {
        logger.warn({ err, query }, "Address suggest failed");
        return [];
    }
}
