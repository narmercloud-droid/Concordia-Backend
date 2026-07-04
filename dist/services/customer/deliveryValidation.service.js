import { prisma } from "../../prisma/client.js";
import { geocodeAddress } from "../geo/geocode.service.js";
import { getBranchCoords } from "../branch/branchCoords.service.js";
import { haversineDistance } from "../../utils/distance.js";
const DEFAULT_RADIUS_ZONES = [
    { maxDistanceKm: 15, minimumOrder: 15, deliveryFee: 2 }
];
function normalizeRadiusZones(json) {
    if (Array.isArray(json.deliveryRadiusZones) && json.deliveryRadiusZones.length > 0) {
        return json.deliveryRadiusZones
            .map((zone) => ({
            maxDistanceKm: Number(zone.maxDistanceKm ?? 0),
            minimumOrder: Number(zone.minimumOrder ?? 0),
            deliveryFee: Number(zone.deliveryFee ?? 0),
            freeDeliveryMinimum: zone.freeDeliveryMinimum != null
                ? Number(zone.freeDeliveryMinimum)
                : undefined,
            label: zone.label
        }))
            .filter((z) => z.maxDistanceKm > 0)
            .sort((a, b) => a.maxDistanceKm - b.maxDistanceKm);
    }
    const legacy = json.deliveryRadius;
    if (legacy && legacy.maxDistanceKm != null) {
        return [
            {
                maxDistanceKm: Number(legacy.maxDistanceKm),
                minimumOrder: Number(legacy.minimumOrder ?? 15),
                deliveryFee: Number(legacy.deliveryFee ?? 2)
            }
        ];
    }
    return DEFAULT_RADIUS_ZONES;
}
export async function getDeliverySettings(branchId) {
    const config = await prisma.branchConfig.findUnique({ where: { branchId } });
    const json = (config?.configJson ?? {});
    const areas = Array.isArray(json.deliveryAreas)
        ? json.deliveryAreas.map((area) => ({
            postalCode: String(area.postalCode ?? area.deliveryAreaId ?? ""),
            city: area.city,
            minimumOrder: Number(area.minimumOrder ?? 0),
            deliveryFee: Number(area.deliveryFee ?? 0)
        }))
        : [];
    return {
        deliveryMode: json.deliveryMode ?? "postcodes",
        freeDeliveryAtMinimum: json.freeDeliveryAtMinimum !== false,
        deliveryAreas: areas,
        deliveryRadiusZones: normalizeRadiusZones(json)
    };
}
export async function getBranchDeliveryAreas(branchId) {
    const settings = await getDeliverySettings(branchId);
    return settings.deliveryAreas;
}
/** True when GPS coords fall in a branch postcode list and/or radius zone. */
export async function isDeliverableAtCoords(branchId, lat, lng, postalCode) {
    const settings = await getDeliverySettings(branchId);
    const postcode = postalCode?.trim() || null;
    if (postcode && settings.deliveryMode !== "radius") {
        if (settings.deliveryAreas.some((area) => area.postalCode === postcode)) {
            return true;
        }
    }
    if (settings.deliveryMode === "postcodes") {
        return false;
    }
    if (!settings.deliveryRadiusZones.length) {
        return false;
    }
    const branchCoords = await getBranchCoords(branchId);
    if (!branchCoords) {
        return false;
    }
    const distanceKm = haversineDistance(branchCoords.lat, branchCoords.lng, lat, lng) / 1000;
    return matchRadiusZone(settings.deliveryRadiusZones, distanceKm) != null;
}
export function extractPostalCode(address) {
    const match = address.match(/\b(\d{5})\b/);
    return match ? match[1] : null;
}
function finalFee(baseFee, orderTotal, minimumOrder, freeDeliveryAtMinimum, freeDeliveryMinimum) {
    const threshold = freeDeliveryMinimum != null && Number.isFinite(freeDeliveryMinimum)
        ? freeDeliveryMinimum
        : freeDeliveryAtMinimum
            ? minimumOrder
            : null;
    if (threshold != null && orderTotal >= threshold) {
        return 0;
    }
    return baseFee;
}
function maxRadiusKm(zones) {
    if (!zones.length)
        return 0;
    return Math.max(...zones.map((z) => z.maxDistanceKm));
}
function matchRadiusZone(zones, distanceKm) {
    const sorted = [...zones].sort((a, b) => a.maxDistanceKm - b.maxDistanceKm);
    return sorted.find((zone) => distanceKm <= zone.maxDistanceKm) ?? null;
}
async function matchPostcode(settings, postalCode) {
    if (settings.deliveryMode === "radius")
        return null;
    const area = settings.deliveryAreas.find((a) => a.postalCode === postalCode);
    if (!area)
        return null;
    return {
        method: "postcode",
        minimumOrder: area.minimumOrder,
        deliveryFee: area.deliveryFee,
        postalCode
    };
}
async function matchRadiusForBranch(settings, branchId, address, options) {
    if (settings.deliveryMode === "postcodes")
        return null;
    if (!settings.deliveryRadiusZones.length)
        return null;
    const branchCoords = await getBranchCoords(branchId);
    if (!branchCoords)
        return null;
    const geo = await geocodeAddress(address, {
        postalCode: options?.postalCode,
        lat: options?.lat,
        lng: options?.lng
    });
    if (!geo)
        return null;
    const distanceMeters = haversineDistance(branchCoords.lat, branchCoords.lng, geo.lat, geo.lng);
    const distanceKm = distanceMeters / 1000;
    const zone = matchRadiusZone(settings.deliveryRadiusZones, distanceKm);
    if (!zone)
        return null;
    return {
        method: "radius",
        minimumOrder: zone.minimumOrder,
        deliveryFee: zone.deliveryFee,
        freeDeliveryMinimum: zone.freeDeliveryMinimum,
        distanceKm: Math.round(distanceKm * 10) / 10,
        radiusLabel: zone.label ?? `up to ${zone.maxDistanceKm} km`
    };
}
export async function quoteDelivery(branchId, address, orderTotal, options) {
    const settings = await getDeliverySettings(branchId);
    const postalCode = options?.postalCode?.trim() ||
        extractPostalCode(address) ||
        null;
    const fullAddress = address?.trim() ||
        (postalCode ? `${postalCode}, Germany` : "");
    let match = null;
    if (postalCode && settings.deliveryMode !== "radius") {
        match = await matchPostcode(settings, postalCode);
    }
    if (!match && settings.deliveryMode !== "postcodes" && fullAddress) {
        match = await matchRadiusForBranch(settings, branchId, fullAddress, {
            postalCode: postalCode ?? undefined,
            lat: options?.lat,
            lng: options?.lng
        });
    }
    if (!match) {
        const maxKm = maxRadiusKm(settings.deliveryRadiusZones);
        const modeHint = settings.deliveryMode === "radius"
            ? `within ${maxKm} km`
            : settings.deliveryMode === "both"
                ? "a supported postcode or within our delivery radius"
                : "a supported postcode";
        return {
            allowed: false,
            deliveryFee: 0,
            postalCode,
            freeDelivery: false,
            message: `Sorry, we do not deliver to this address. We deliver to ${modeHint}.`
        };
    }
    if (orderTotal < match.minimumOrder) {
        return {
            allowed: false,
            deliveryFee: 0,
            postalCode: match.postalCode ?? postalCode,
            method: match.method,
            minimumOrder: match.minimumOrder,
            freeDelivery: false,
            distanceKm: match.distanceKm,
            radiusLabel: match.radiusLabel,
            message: `Minimum order is €${match.minimumOrder.toFixed(2)}.`
        };
    }
    const freeDeliveryThreshold = match.freeDeliveryMinimum != null && Number.isFinite(match.freeDeliveryMinimum)
        ? match.freeDeliveryMinimum
        : settings.freeDeliveryAtMinimum
            ? match.minimumOrder
            : null;
    const deliveryFee = finalFee(match.deliveryFee, orderTotal, match.minimumOrder, settings.freeDeliveryAtMinimum, match.freeDeliveryMinimum);
    const amountToFreeDelivery = freeDeliveryThreshold != null && orderTotal < freeDeliveryThreshold
        ? Math.round((freeDeliveryThreshold - orderTotal) * 100) / 100
        : 0;
    return {
        allowed: true,
        deliveryFee,
        postalCode: match.postalCode ?? postalCode,
        method: match.method,
        minimumOrder: match.minimumOrder,
        freeDeliveryMinimum: freeDeliveryThreshold ?? undefined,
        amountToFreeDelivery,
        freeDelivery: deliveryFee === 0,
        distanceKm: match.distanceKm,
        radiusLabel: match.radiusLabel
    };
}
export async function validateDeliveryOrder(branchId, address, orderTotal, options) {
    if (!address?.trim()) {
        throw new Error("Delivery address is required.");
    }
    const quote = await quoteDelivery(branchId, address, orderTotal, options);
    if (!quote.allowed) {
        throw new Error(quote.message ?? "Delivery not available for this address.");
    }
    return {
        deliveryFee: quote.deliveryFee,
        postalCode: quote.postalCode ?? extractPostalCode(address) ?? ""
    };
}
