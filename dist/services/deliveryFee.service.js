import { prisma } from "../prisma/client.js";
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export class DeliveryFeeService {
    async calculate(branchId, address) {
        const zone = await prisma.deliveryZone.findUnique({
            where: { branchId }
        });
        if (!zone)
            throw new Error("Delivery zone not configured");
        const branch = await prisma.branch.findUnique({
            where: { id: branchId }
        });
        const distance = haversine(branch?.lat || 0, branch?.lng || 0, address.lat, address.lng);
        if (distance > zone.maxDistanceKm) {
            return { allowed: false };
        }
        let fee = zone.baseFee + distance * zone.perKmFee;
        if (zone.freeDeliveryThreshold && address.orderTotal >= zone.freeDeliveryThreshold) {
            fee = 0;
        }
        if (zone.minimumOrderAmount && address.orderTotal < zone.minimumOrderAmount) {
            return { allowed: false, reason: "Minimum order not met" };
        }
        return {
            allowed: true,
            distance,
            fee
        };
    }
}
export const deliveryFeeService = new DeliveryFeeService();
