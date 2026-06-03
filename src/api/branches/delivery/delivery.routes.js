import { Router } from 'express';
import * as radiusCtrl from './radius.controller.js';
import * as zonesCtrl from './zones.controller.js';
import * as feesCtrl from './fees.controller.js';
import * as minCtrl from './minimumOrder.controller.js';
import * as freeCtrl from './freeDelivery.controller.js';
import * as enabledCtrl from './enabled.controller.js';

const router = Router({ mergeParams: true });

// Radius
router.get('/radius', radiusCtrl.getRadius);
router.put('/radius', radiusCtrl.updateRadius);
router.put('/radius/enabled', radiusCtrl.toggleRadius);

// Zones
router.get('/zones', zonesCtrl.getZones);
router.post('/zones', zonesCtrl.createZone);
router.put('/zones/:zoneId', zonesCtrl.updateZone);
router.delete('/zones/:zoneId', zonesCtrl.deleteZone);

// Fees
router.put('/fee', feesCtrl.setFlatFee);
router.put('/fee/distance', feesCtrl.setDistanceFee);

// Minimum order
router.put('/minimum-order', minCtrl.setMinimumOrder);

// Free delivery
router.put('/free-delivery', freeCtrl.setFreeDelivery);

// Enabled
router.put('/enabled', enabledCtrl.toggleDelivery);

export default router;
