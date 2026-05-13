import { courierTrackingService } from "../services/courierTracking.service.js";
export const CourierTrackingController = {
    // Courier updates GPS
    updateLocation: async (req, res, next) => {
        const courierId = req.user.id;
        const data = req.body;
        const result = await courierTrackingService.updateLocation(courierId, data);
        res.json(result);
    },
    // Customer tracking screen
    customerTracking: async (req, res, next) => {
        const { orderId } = req.params;
        const result = await courierTrackingService.getCustomerTracking(orderId);
        res.json(result);
    },
    // Add tracking event (courier or system)
    addEvent: async (req, res, next) => {
        const { orderId, status } = req.body;
        const event = await courierTrackingService.addTrackingEvent(orderId, status);
        res.json(event);
    },
    // Manager live map
    managerLiveMap: async (req, res, next) => {
        const branchId = req.user.branchId;
        const couriers = await courierTrackingService.getActiveCouriers(branchId);
        res.json(couriers);
    }
};
