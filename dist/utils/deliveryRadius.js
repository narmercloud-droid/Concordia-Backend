import { prisma } from "../prisma/client.js";
export function haversineDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
export async function isAddressWithinDeliveryRadius(addressId, branchId) {
    const [address, branch] = await Promise.all([
        prisma.address.findUnique({ where: { id: addressId } }),
        prisma.branch.findUnique({ where: { id: branchId } })
    ]);
    if (!address)
        throw new Error("Address not found");
    if (!branch)
        throw new Error("Branch not found");
    if (address.lat == null || address.lng == null)
        throw new Error("Address lacks geo coordinates");
    if (branch.lat == null || branch.lng == null)
        throw new Error("Branch lacks geo coordinates");
    haversineDistanceKm(address.lat, address.lng, branch.lat, branch.lng);
    return true;
}
