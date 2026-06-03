import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Haversine distance
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2)**2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function scoreDriver(driver, order) {
  // Try to read location from driver fields (lat,lng) if available
  const drv = await prisma.driver.findUnique({ where: { id: driver.id } });
  let loc = null;

  if (drv && typeof drv.lat === 'number' && typeof drv.lng === 'number') {
    loc = { lat: drv.lat, lng: drv.lng };
  }

  // Fallback: check courier locations table if driver has courier mapping
  if (!loc) {
    const courierLoc = await prisma.courierLocation.findFirst({
      where: { courierId: driver.id },
      orderBy: { createdAt: 'desc' }
    }).catch(() => null);

    if (courierLoc) loc = { lat: courierLoc.latitude, lng: courierLoc.longitude };
  }

  if (!loc) return null;

  const dist = distanceKm(
    loc.lat, loc.lng,
    order.customerLat ?? order.branchLat ?? 0,
    order.customerLng ?? order.branchLng ?? 0
  );

  const activeOrders = await prisma.order.count({
    where: {
      driverId: driver.id,
      status: { in: ['assigned', 'picked-up'] }
    }
  });

  const score =
    (1 / (dist + 0.1)) * 0.7 +
    (1 / (activeOrders + 1)) * 0.3;

  return { driver, score };
}
