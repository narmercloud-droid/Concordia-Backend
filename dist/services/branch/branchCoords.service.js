import { prisma } from "../../prisma/client.js";
export async function getBranchCoords(branchId) {
    const config = await prisma.branchConfig.findUnique({ where: { branchId } });
    const json = (config?.configJson ?? {});
    const lat = Number(json.lat);
    const lng = Number(json.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng, address: String(json.address ?? "") };
    }
    return null;
}
export async function getGuestCourierId(branchId) {
    const guestId = `guest-driver-${branchId}`;
    const existing = await prisma.courier.findUnique({ where: { id: guestId } });
    if (existing)
        return guestId;
    await prisma.courier.create({
        data: {
            id: guestId,
            name: "Guest Driver",
            email: `guest-driver-${branchId}@concordia.internal`,
            phone: "0000000000",
            branchId,
            active: true
        }
    });
    return guestId;
}
