import { PrismaClient } from '@prisma/client';
import { validateDelivery } from './deliveryValidation.service.js';
import { haversineDistance } from '../utils/distance.js';

const prisma = new PrismaClient();

export async function selectBestBranch(customer, orderTotal) {
  const { lat, lng } = customer;

  const branches = await prisma.branch.findMany({
    include: {
      config: true,
      deliveryZones: true
    }
  });

  const results = [];

  for (const branch of branches) {
    const validation = await validateDelivery(branch, customer, orderTotal);

    if (validation.deliverable) {
      const distance = haversineDistance(
        branch.latitude,
        branch.longitude,
        lat,
        lng
      );

      results.push({
        branch,
        distance,
        ...validation
      });
    }
  }

  if (results.length === 0) {
    return {
      deliverable: false,
      reason: 'No branch can deliver to this address'
    };
  }

  function score(result) {
    let s = 0;
    if (result.method === 'zone') s += 1000;
    s += (100 - result.distance);
    s += (10 - result.deliveryFee);
    return s;
  }

  results.sort((a, b) => score(b) - score(a));

  const best = results[0];

  return {
    deliverable: true,
    branchId: best.branch.id,
    branchName: best.branch.name,
    method: best.method,
    zone: best.zone ?? null,
    distance: best.distance,
    deliveryFee: best.deliveryFee,
    minimumOrder: best.minimumOrder,
    freeDeliveryThreshold: best.freeDeliveryThreshold
  };
}
