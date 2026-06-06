import { haversineDistance } from '../utils/distance.js';

export async function validateDelivery(branch, customer, orderTotal) {
  const { lat, lng } = customer;
  const config = branch.config;

  if (!config.deliveryEnabled) {
    return { deliverable: false, reason: 'Delivery disabled' };
  }

  for (const zone of branch.deliveryZones) {
    if (pointInPolygon([lng, lat], zone.polygon)) {
      return {
        deliverable: true,
        method: 'zone',
        zone: zone.name,
        deliveryFee: zone.zoneDeliveryFee,
        minimumOrder: zone.zoneMinimumOrder,
        freeDeliveryThreshold: config.freeDeliveryThreshold
      };
    }
  }

  const distance = haversineDistance(
    branch.latitude,
    branch.longitude,
    lat,
    lng
  );

  if (distance <= config.deliveryRadius) {
    return {
      deliverable: true,
      method: 'radius',
      deliveryFee: config.baseDeliveryFee,
      minimumOrder: config.minimumOrderAmount,
      freeDeliveryThreshold: config.freeDeliveryThreshold
    };
  }

  return { deliverable: false, reason: 'Outside delivery area' };
}
