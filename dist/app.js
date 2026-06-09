import express from "express";
import http from 'http';
import { initSocket } from './realtime/socket.js';
import { initWebSocket } from './ws/ws.js';
import cors from "cors";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { auth } from './middleware/auth.js';
import branchesRoutes from "./routes/branches.js";
import menuRoutes from "./routes/menu.js";
import branchMenuRoutes from "./api/branches/menu/menu.routes.js";
import deliveryRoutes from './api/branches/delivery/delivery.routes.js';
import branchSelectionRoutes from './api/delivery/branchSelection.routes.js';
import checkoutRoutes from './api/checkout/checkout.routes.js';
import apiOrderRoutes from './api/orders/order.routes.js';
import paymentRoutes from './api/payments/payment.routes.js';
import { handleStripeWebhook } from './api/payments/payment.controller.js';
import orderStatusRoutes from './api/orderStatus/orderStatus.routes.js';
import driverAssignmentRoutes from './api/driverAssignment/driverAssignment.routes.js';
import driverLocationRoutes from './api/driverLocation/driverLocation.routes.js';
// removed duplicate orderRoutes import
import sunmiRoutes from "./routes/sunmi.js";
import authRoutes from "./routes/auth.js";
import courierRoutes from "./routes/courier.js";
import marketingRoutes from "./routes/marketing.js";
import campaignRoutes from "./routes/campaigns.js";
import kdsRoutes from "./routes/kds.js";
import trackRoutes from "./routes/track.js";
import menuApiRoutes from './api/menu/menu.routes.js';
import customerMenuRoutes from './api/menu/customerMenu.routes.js';
import deliverySettingsRoutes from './api/deliverySettings/deliverySettings.routes.js';
import branchRoutes from './api/branch/branch.routes.js';
import printerRoutes from './api/branch/printer.routes.js';
import staffRoutes from './api/staff/staff.routes.js';
import analyticsRoutes from './api/analytics/analytics.routes.js';
import driverAuthRoutes from './api/driverAuth/driverAuth.routes.js';
import driverOrdersRoutes from './api/driverOrders/driverOrders.routes.js';
import driverRatingRoutes from './api/drivers/rating.routes.js';
import driverNavigationRoutes from './api/driverNavigation/driverNavigation.routes.js';
import customerAuthRoutes from './api/customerAuth/customerAuth.routes.js';
import customerProfileRoutes from './api/customerProfile/customerProfile.routes.js';
import customerAddressesRoutes from './api/customerAddresses/customerAddresses.routes.js';
import customerOrdersRoutes from './api/customerOrders/customerOrders.routes.js';
import customerRefreshRoutes from './api/customerAuth/refresh.routes.js';
import adminAuthRoutes from './api/adminAuth/adminAuth.routes.js';
import adminBranchesRoutes from './api/adminBranches/adminBranches.routes.js';
import adminSettingsRoutes from './api/adminSettings/adminSettings.routes.js';
import adminAnalyticsRoutes from './api/adminAnalytics/adminAnalytics.routes.js';
import adminPanelAuthRoutes from './api/admin/adminAuth.routes.js';
import branchAdminRoutes from './api/admin/branch.routes.js';
import menuAdminRoutes from './api/admin/menu.routes.js';
import variantAddonRoutes from './api/admin/variantAddon.routes.js';
import inventoryRoutes from './api/admin/inventory.routes.js';
import promoAdminRoutes from './api/admin/promo.routes.js';
import customerPromoRoutes from './api/promo/customerPromo.routes.js';
import branchPricingRoutes from './api/admin/branchPricing.routes.js';
import branchHoursRoutes from './api/admin/branchHours.routes.js';
import customerSchedulingRoutes from './api/scheduling/customerScheduling.routes.js';
import etaRoutes from './api/eta/eta.routes.js';
import loyaltySettingsRoutes from './api/admin/loyaltySettings.routes.js';
import rewardsAdminRoutes from './api/admin/rewards.routes.js';
import customerLoyaltyRoutes from './api/loyalty/customerLoyalty.routes.js';
import kitchenLoadRoutes from './api/admin/kitchenLoad.routes.js';
import driverAccessRoutes from './api/driverAccess/driverAccess.routes.js';
import driverRealtimeRoutes from './api/driverAccess/driverRealtime.routes.js';
import driverLocationAccessRoutes from './api/driverAccess/driverLocation.routes.js';
import driverDispatchRoutes from './api/driverAccess/driverDispatch.routes.js';
import autoDispatchRoutes from './api/dispatch/autoDispatch.routes.js';
import driverAccessAuthRoutes from './api/driverAccess/driverAuth.routes.js';
import driverAccessOrdersRoutes from './api/driverAccess/driverOrders.routes.js';
import driverAvailabilityRoutes from './api/driverAccess/driverAvailability.routes.js';
import driverClaimRoutes from './api/driverAccess/driverClaim.routes.js';
import kdsApiRoutes from './api/kds/kds.routes.js';
import customerTrackingRoutes from './api/orders/customerTracking.routes.js';
import managerDashboardRoutes from './api/manager/managerDashboard.routes.js';
import customerNotificationRoutes from './api/orders/customerNotification.routes.js';
import cartRoutes from './api/cart/cart.routes.js';
import customerIssueRoutes from './api/issues/customerIssue.routes.js';
import adminIssueRoutes from './api/admin/orderIssues.routes.js';
import pushRoutes from './api/push/push.routes.js';
import orderRoutes from "./api/order/order.routes.js";
import { httpLogger } from "./logger.js";
import errorHandler from "./middleware/errorHandler.js";
import requestContextMiddleware from "./middleware/requestContext.js";
import inputValidation from "./middleware/inputValidation.js";
const app = express();
/* -------------------------------------------------------
   Security & CORS
------------------------------------------------------- */
app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));
// Security headers
app.use((_req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
// Prevent XSS attacks
app.use(xss());
// Prevent NoSQL injection
app.use(mongoSanitize());
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP
    message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);
// Production-wide rate limiter
const prodLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200
});
app.use(prodLimiter);
/* -------------------------------------------------------
   Core Middleware
------------------------------------------------------- */
app.use(express.json());
app.use(inputValidation);
app.use(httpLogger);
app.use(requestContextMiddleware);
// Log suspicious requests
app.use((req, _res, next) => {
    if (req.url.includes('..') || req.url.includes('%00')) {
        console.warn('Suspicious request detected:', req.url);
    }
    next();
});
// Basic request logging
app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});
// Performance logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[PERF] ${req.method} ${req.url} - ${ms}ms`);
    });
    next();
});
import { slowQueryDetector } from './middleware/slowQuery.js';
app.use(slowQueryDetector(250));
/* -------------------------------------------------------
   Health Check
------------------------------------------------------- */
app.use('/api/drivers/ratings', driverRatingRoutes);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
/* -------------------------------------------------------
   Routes
------------------------------------------------------- */
app.use("/branches", branchesRoutes);
app.use('/api/branches/:branchId/menu', branchMenuRoutes);
app.use('/api/branches/:branchId/delivery', deliveryRoutes);
app.use('/api/delivery', branchSelectionRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', apiOrderRoutes);
// Stripe webhook needs raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.use('/api/payments', paymentRoutes);
app.use('/api/order-status', orderStatusRoutes);
app.use('/api/driver-assignment', driverAssignmentRoutes);
app.use('/api/driver-location', driverLocationRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/sunmi", sunmiRoutes);
app.use("/auth", authRoutes);
app.use("/courier", courierRoutes);
app.use("/customer", marketingRoutes);
app.use("/admin", campaignRoutes);
app.use("/kds", kdsRoutes);
app.use(trackRoutes);
// Manager dashboard endpoints
app.use('/api/menu', menuApiRoutes);
app.use('/api/menu', customerMenuRoutes);
app.use('/api/delivery-settings', deliverySettingsRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/branch/printer', printerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/analytics', analyticsRoutes);
// Driver app endpoints
app.use('/api/driver/auth', driverAuthRoutes);
app.use('/api/driver/orders', driverOrdersRoutes);
app.use('/api/driver/navigation', driverNavigationRoutes);
// Customer app endpoints
app.use('/api/customer/auth', customerAuthRoutes);
app.use('/api/customer/profile', customerProfileRoutes);
app.use('/api/customer/addresses', customerAddressesRoutes);
app.use('/api/customer/orders', customerOrdersRoutes);
app.use('/api/customer/auth', customerRefreshRoutes);
app.use('/api/issues', customerIssueRoutes);
app.use('/api/order', orderRoutes);
// Admin panel endpoints
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/branches', auth, adminBranchesRoutes);
app.use('/api/admin/settings', auth, adminSettingsRoutes);
app.use('/api/admin/analytics', auth, adminAnalyticsRoutes);
app.use('/api/admin-auth', adminPanelAuthRoutes);
app.use('/api/admin/branches', auth, branchAdminRoutes);
app.use('/api/admin/menu', auth, menuAdminRoutes);
app.use('/api/admin/menu-options', auth, variantAddonRoutes);
app.use('/api/admin/inventory', auth, inventoryRoutes);
app.use('/api/admin/promos', auth, promoAdminRoutes);
app.use('/api/promo', customerPromoRoutes);
app.use('/api/admin/branch-pricing', auth, branchPricingRoutes);
app.use('/api/admin/branch-hours', auth, branchHoursRoutes);
app.use('/api/scheduling', customerSchedulingRoutes);
app.use('/api/eta', etaRoutes);
app.use('/api/admin/loyalty-settings', auth, loyaltySettingsRoutes);
app.use('/api/admin/rewards', auth, rewardsAdminRoutes);
app.use('/api/loyalty', customerLoyaltyRoutes);
app.use('/api/admin/kitchen-load', auth, kitchenLoadRoutes);
app.use('/api/admin/order-issues', auth, adminIssueRoutes);
app.use('/api/admin/analytics', auth, analyticsRoutes);
app.use('/api/push', pushRoutes);
// Driver access (QR) endpoints
app.use('/api/driver-access', driverAccessRoutes);
app.use('/api/driver-realtime', driverRealtimeRoutes);
app.use('/api/driver-location', driverLocationAccessRoutes);
app.use('/api/driver-dispatch', driverDispatchRoutes);
app.use('/api/dispatch/auto', autoDispatchRoutes);
app.use('/api/driver-auth', driverAccessAuthRoutes);
app.use('/api/driver-orders', driverAccessOrdersRoutes);
app.use('/api/driver-availability', driverAvailabilityRoutes);
app.use('/api/driver', driverClaimRoutes);
app.use('/api/kds', kdsApiRoutes);
app.use('/api/customer-tracking', customerTrackingRoutes);
app.use('/api/manager', managerDashboardRoutes);
app.use('/api/customer-notifications', customerNotificationRoutes);
app.use('/api/cart', cartRoutes);
/* -------------------------------------------------------
   Global Error Handler
------------------------------------------------------- */
app.use(errorHandler);
// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
initSocket(server);
// Also initialize new WS helper (shares same server)
initWebSocket(server);
// Start listening when this file is executed directly
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${port}`);
    });
}
export default app;
