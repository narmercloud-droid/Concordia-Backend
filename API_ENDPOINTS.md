# API Endpoints Inventory

Generated: 2026-06-05

This file maps Express mount points (as registered in `src/app.ts`) to their route modules and lists extracted router method paths found in the repository (`router.get|post|put|patch|delete`).

## Mount → Module (from `src/app.ts` imports + registrations)

- /api/drivers/ratings → src/api/drivers/rating.routes.js (variable: driverRatingRoutes)
- /branches → src/routes/branches.ts (branchesRoutes)
- /api/branches/:branchId/menu → src/api/branches/menu/menu.routes.js (branchMenuRoutes)
- /api/branches/:branchId/delivery → src/api/branches/delivery/delivery.routes.js (deliveryRoutes)
- /api/delivery → src/api/delivery/branchSelection.routes.js (branchSelectionRoutes)
- /api/checkout → src/api/checkout/checkout.routes.js (checkoutRoutes)
- /api/orders → src/api/orders/order.routes.js (apiOrderRoutes)
- POST /api/payments/webhook → src/api/payments/payment.controller.js (handleStripeWebhook)
- /api/payments → src/api/payments/payment.routes.js (paymentRoutes)
- /api/order-status → src/api/orderStatus/orderStatus.routes.js (orderStatusRoutes)
- /api/driver-assignment → src/api/driverAssignment/driverAssignment.routes.js (driverAssignmentRoutes)
- /api/driver-location → src/api/driverLocation/driverLocation.routes.js (driverLocationRoutes)
- /menu → src/routes/menu.ts (menuRoutes)
- /orders → src/api/order/order.routes.js (orderRoutes)
- /sunmi → src/routes/sunmi.ts (sunmiRoutes)
- /auth → src/routes/auth.ts (authRoutes)
- /courier → src/routes/courier.ts (courierRoutes)
- /customer → src/routes/marketing.ts (marketingRoutes)
- /admin → src/routes/campaigns.ts (campaignRoutes)
- /kds → src/routes/kds.ts (kdsRoutes)
- [unprefixed routes] → src/routes/track.ts (trackRoutes) — mounted directly via `app.use(trackRoutes)`

Manager / Admin / Other API mounts:

- /api/menu → src/api/menu/menu.routes.js and src/api/menu/customerMenu.routes.js
- /api/delivery-settings → src/api/deliverySettings/deliverySettings.routes.js
- /api/branch → src/api/branch/branch.routes.js
- /api/branch/printer → src/api/branch/printer.routes.js
- /api/staff → src/api/staff/staff.routes.js
- /api/analytics → src/api/analytics/analytics.routes.js
- /api/driver/auth → src/api/driverAuth/driverAuth.routes.js
- /api/driver/orders → src/api/driverOrders/driverOrders.routes.js
- /api/driver/navigation → src/api/driverNavigation/driverNavigation.routes.js
- /api/customer/auth → src/api/customerAuth/customerAuth.routes.js and src/api/customerAuth/refresh.routes.js
- /api/customer/profile → src/api/customerProfile/customerProfile.routes.js
- /api/customer/addresses → src/api/customerAddresses/customerAddresses.routes.js
- /api/customer/orders → src/api/customerOrders/customerOrders.routes.js
- /api/issues → src/api/issues/customerIssue.routes.js
- /api/order → src/api/order/order.routes.js
- /api/admin/auth → src/api/adminAuth/adminAuth.routes.js
- /api/admin/branches → src/api/adminBranches/adminBranches.routes.js and src/api/admin/branch.routes.js
- /api/admin/settings → src/api/adminSettings/adminSettings.routes.js
- /api/admin/analytics → src/api/adminAnalytics/adminAnalytics.routes.js
- /api/admin-auth → src/api/admin/adminAuth.routes.js
- /api/admin/menu → src/api/admin/menu.routes.js
- /api/admin/menu-options → src/api/admin/variantAddon.routes.js
- /api/admin/inventory → src/api/admin/inventory.routes.js
- /api/admin/promos → src/api/admin/promo.routes.js
- /api/promo → src/api/promo/customerPromo.routes.js
- /api/admin/branch-pricing → src/api/admin/branchPricing.routes.js
- /api/admin/branch-hours → src/api/admin/branchHours.routes.js
- /api/scheduling → src/api/scheduling/customerScheduling.routes.js
- /api/eta → src/api/eta/eta.routes.js
- /api/admin/loyalty-settings → src/api/admin/loyaltySettings.routes.js
- /api/admin/rewards → src/api/admin/rewards.routes.js
- /api/loyalty → src/api/loyalty/customerLoyalty.routes.js
- /api/admin/kitchen-load → src/api/admin/kitchenLoad.routes.js
- /api/admin/order-issues → src/api/admin/orderIssues.routes.js
- /api/push → src/api/push/push.routes.js
- /api/driver-access → src/api/driverAccess/driverAccess.routes.js
- /api/driver-realtime → src/api/driverAccess/driverRealtime.routes.js
- /api/driver-location → src/api/driverAccess/driverLocation.routes.js
- /api/driver-dispatch → src/api/driverAccess/driverDispatch.routes.js
- /api/dispatch/auto → src/api/dispatch/autoDispatch.routes.js
- /api/driver-auth → src/api/driverAccess/driverAuth.routes.js
- /api/driver-orders → src/api/driverAccess/driverOrders.routes.js
- /api/driver-availability → src/api/driverAccess/driverAvailability.routes.js
- /api/driver → src/api/driverAccess/driverClaim.routes.js
- /api/kds → src/api/kds/kds.routes.js
- /api/customer-tracking → src/api/orders/customerTracking.routes.js
- /api/manager → src/api/manager/managerDashboard.routes.js
- /api/customer-notifications → src/api/orders/customerNotification.routes.js
- /api/cart → src/api/cart/cart.routes.js


## Extracted router definitions (sampled from `src/` files)

Below are router method paths discovered in route modules. For each module file, the listed entries are the values passed to `router.<method>(path, ...)` (these are the internal route suffixes to be appended to the mount path above).

- src/api/payments/payment.routes.js
  - POST /intent
  - POST /cod
  - POST /webhook

- src/api/orders/order.routes.js
  - POST /
  - (other order-related routes exist in src/api/order/* and src/routes/order/*)

- src/api/customerProfile/customerProfile.routes.js
  - GET /
  - PATCH /

- src/api/customerOrders/customerOrders.routes.js
  - GET /
  - GET /:orderId

- src/api/orderStatus/orderStatus.routes.js
  - PATCH /:orderId/status

- src/api/scheduling/customerScheduling.routes.js
  - GET /slots/:branchId
  - POST /schedule

- src/api/deliverySettings/deliverySettings.routes.js
  - GET /:branchId
  - PATCH /:branchId

- src/api/push/push.routes.js
  - POST /subscribe

- src/api/promo/customerPromo.routes.js
  - POST /apply

- src/routes/webhooks.routes.ts
  - POST /stripe
  - POST /paypal

- src/routes/wallet.routes.ts
  - GET /balance
  - GET /transactions
  - POST /add
  - POST /deduct

- src/routes/terminal.routes.ts and src/routes/terminal/*
  - POST /activate
  - POST /register
  - POST /login
  - POST /heartbeat
  - POST /orders/:order_id/assign
  - POST /orders/:order_id/accept
  - POST /orders/:order_id/reject
  - POST /orders/:order_id/acknowledge
  - GET /orders/stream
  - etc.

- src/routes/menu.routes.ts
  - GET /
  - POST /category
  - PUT /category/:id
  - DELETE /category/:id
  - POST /item
  - PUT /item/:id
  - DELETE /item/:id
  - POST /variant
  - PUT /variant/:id
  - DELETE /variant/:id
  - PUT /item/:id/availability
  - PUT /variant/:id/availability

- src/routes/orders.routes.ts
  - POST /
  - GET /branch/:branchId
  - PUT /:id/status
  - POST /courier/claim
  - POST /courier/picked-up
  - POST /courier/delivered

- src/routes/track.ts
  - GET /track/:token
  - GET /track/order/:orderId

- src/routes/sunmi.ts
  - GET /status
  - POST /print
  - POST /order-push
  - POST /order-status

- src/routes/review.routes.ts
  - POST /
  - PUT /:reviewId
  - DELETE /:reviewId
  - POST /item

- src/routes/managerDashboard.routes.ts
  - GET /menu
  - POST /menu/availability
  - GET /orders
  - GET /couriers
  - GET /terminals
  - GET /schedule
  - POST /schedule

(There are many more route modules under `src/routes/` and `src/api/` — the repository contains ~200 router entries; for a complete per-file listing, search for `router.get|post|put|patch|delete` under `src/`.)


## How to get a fully expanded list (optional next step)

I can produce a fully expanded file that enumerates, for every mounted path above, all fully-qualified endpoints (mount + internal path) with HTTP methods and the source file/line. Options:

- Generate `API_ENDPOINTS_FULL.md` with every endpoint listed (recommended).
- Export `api_inventory.csv` with columns: `method,path,mount,module,internal_path,source_file,source_line`.

Tell me which output you want and I'll generate it. If you want the `CSV` I will produce it next.

---

Report produced from static source inspection of `src/` files (router registrations) and `src/app.ts` (mount points). To verify runtime routes, start the app and run `npx express-list-endpoints` or similar tooling in your environment.