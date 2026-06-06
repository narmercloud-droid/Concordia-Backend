### Schemas

This document contains the Zod validation schemas (from `src/validation/*.ts`) and the Prisma data model list (from `prisma/schema.prisma`). It is intended as a machine-friendly reference and a developer reference for request/response DTOs.

---

## Zod validation schemas (full list)

Below are the validation files discovered under `src/validation` together with the exported schema definitions. These are presented as-is (code blocks) so they can be copied into client validation or API docs.

### `src/validation/auth.schema.ts`
```ts
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const adminRefreshSchema = z.object({
  refreshToken: z.string().optional()
});
```

### `src/validation/orders.schema.ts`
```ts
import { z } from "zod";

const orderItemSchema = z.object({
  itemId: z.string().min(1),
  variantId: z.string().min(1),
  addOnIds: z.array(z.string()).optional(),
  quantity: z.number().min(1),
  notes: z.string().nullable().optional(),
  price: z.number()
});

// legacyCreateOrderSchema removed — use current order creation schemas

export const courierOrderActionSchema = z.object({
  orderId: z.string().min(1),
  courierToken: z.string().min(1)
});

export const orderStatusBodySchema = z.object({
  status: z.string().min(1)
});
```

### `src/validation/order.schema.ts`
```ts
import { z } from "zod";

export const kitchenCreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        variantId: z.string().min(1),
        addOnIds: z.array(z.string()).optional(),
        quantity: z.number().min(1),
        notes: z.string().optional(),
        price: z.number()
      })
    )
    .min(1),
  paymentMethod: z.string().min(1),
  customerId: z.string().optional(),
  isGuest: z.boolean().optional()
});

export const kitchenUpdateStatusSchema = z.object({
  status: z.string().min(1),
  estimated_time: z.number().optional()
});
```

### `src/validation/menu.schema.ts`
```ts
import { z } from "zod";

export const menuQuerySchema = z.object({}).passthrough();

export const menuEntityBodySchema = z.record(z.string(), z.unknown());

export const menuAvailabilityBodySchema = z.object({
  available: z.boolean()
});
```

### `src/validation/kds.schema.ts`
```ts
import { z } from "zod";

export const kdsUpdateStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["preparing", "ready", "completed"])
});
```

### `src/validation/customers.schema.ts`
```ts
import { z } from "zod";

export const customerRegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().optional()
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const customerRefreshSchema = z.object({
  refreshToken: z.string().min(1)
});
```

### `src/validation/payments.schema.ts`
```ts
import { z } from "zod";

export const paymentsBodySchema = z.record(z.string(), z.unknown());

export const createStripeIntentBodySchema = z.object({
  orderId: z.string().min(1),
  amount: z.number()
});

export const createPayPalOrderBodySchema = z.object({
  orderId: z.string().min(1),
  amount: z.number()
});

export const capturePayPalBodySchema = z.object({
  orderId: z.string().min(1)
});
```

### `src/validation/common.schema.ts`
```ts
import { z } from "zod";

/** First string from Express `req.query` values (`string | string[] | undefined`). */
export const queryStringOptional = z.preprocess((v: unknown) => {
  if (v === undefined || v === null || v === "") return undefined;
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : undefined;
  return typeof v === "string" ? v : undefined;
}, z.string().optional());

export const idParamSchema = z.object({ id: z.string().min(1) });
export const orderIdParamSchema = z.object({ orderId: z.string().min(1) });
export const branchIdParamSchema = z.object({ branchId: z.string().min(1) });
export const driverIdParamSchema = z.object({ driverId: z.string().min(1) });
export const itemIdParamSchema = z.object({ itemId: z.string().min(1) });
export const reviewIdParamSchema = z.object({ reviewId: z.string().min(1) });
export const customerIdParamSchema = z.object({ customerId: z.string().min(1) });
```

### Additional validation files

The project contains many other validation files; below are the filenames and their exported schema symbols (see file for definitions):

- `src/validation/terminal.schema.ts` — `terminalActivateSchema`, `terminalRegisterSchema`, `terminalLoginSchema`, `terminalOrderIdParamSchema`.
- `src/validation/search.schema.ts` — `searchQuerySchema`.
- `src/validation/review.schema.ts` — `reviewBodySchema`, `reviewRatingBodySchema`.
- `src/validation/recommendation.schema.ts` — `recommendationBodySchema`, `recommendationQuerySchema`.
- `src/validation/public.schema.ts` — `trackingTokenParamSchema`.
- `src/validation/notifications.schema.ts` — `notificationPreferencesSchema`, `marketingSmsSchema`.
- `src/validation/nlae.schema.ts` — `nlaeAskSchema`.
- `src/validation/managerDashboard.schema.ts` — `managerItemAvailabilitySchema`, `managerScheduleUpdateSchema`, `managerOrdersQuerySchema`.
- `src/validation/ltml.schema.ts` — `ltmlBodySchema`, `ltmlSaveBodySchema`.
- `src/validation/loyalty.schema.ts` — `loyaltyRedeemSchema`, `loyaltyPromoSchema`, `loyaltyReferralSchema`, `loyaltyRewardCreateSchema`, `loyaltyPromoCreateSchema`.
- `src/validation/intelligence.schema.ts` — `itemIdBodySchema`, `branchScopedBodySchema`, `orchestrationEventBodySchema`.
- `src/validation/fraud.schema.ts` — `fraudScoreOrderBodySchema`.
- `src/validation/favorites.schema.ts` — `favoritesBodySchema`.
- `src/validation/deliveryFee.schema.ts` — `deliveryFeeAddressSchema`, `deliveryFeeCalculateBodySchema`, `deliveryFeeZoneBodySchema`.
- `src/validation/dashboard.schema.ts` — `dashboardParamsSchema`.
- `src/validation/couriers.schema.ts` — `couriersBodySchema`, `courierStatusUpdateSchema`.
- `src/validation/courier.schema.ts` — `courierTrackingEventSchema`, `courierLocationUpdateSchema`.
- `src/validation/conversational.schema.ts` — `conversationalTalkBodySchema`.
- `src/validation/cart.schema.ts` — `cartAddItemSchema`, `cartQuantitySchema`, `cartLoadQuerySchema`, `cartCheckoutBodySchema`, `cartIdParamSchema`, `cartItemIdParamSchema`.
- `src/validation/analytics.schema.ts` — `analyticsBodySchema`, `analyticsBranchQuerySchema`.
- `src/validation/admin.schema.ts` — many admin schemas for CRUD and auth (see file for full list).
- `src/validation/address.schema.ts` — address validation schemas.

(All `src/validation/*.ts` files should be referenced for precise field-level validation when generating client code.)

---

## Prisma models (summary)

The complete Prisma schema is maintained at `prisma/schema.prisma`. Below is a list of models defined there (use the Prisma file for exact field types and relations):

- Order
- OrderItem
- OrderItemVariant
- OrderItemExtra
- Branch
- Admin
- Manager
- Terminal
- Customer
- Courier
- Driver
- BranchSettings
- LoyaltySettings
- Reward
- UserReward
- DriverRating
- BranchTerminal
- Campaign
- CloudPrinter
- Device
- Offer
- PrinterAnomaly
- PrinterFleet
- PrinterHealth
- PrinterQueue
- PrinterSecurity
- PrinterTrace
- Segment
- TerminalError
- TerminalEvent
- TerminalStatus
- VirtualPrinter
- Voucher
- Wallet
- WalletTransaction
- ingredients
- promotions
- Cart
- BranchSchedule
- Category
- CartItem
- PriceHistory
- Relation
- Address
- Favorite
- LoyaltyPoints
- NotificationPreference
- Referral
- MenuItem
- VariantGroup
- Variant
- AddOnGroup
- AddOn
- CourierLocation
- OrderTrackingEvent
- Review
- ItemRating
- RiskScore
- OrderRiskEvent
- DeliveryZone
- KitchenDisplay
- CustomerSession
- ManagerSession
- AdminSession
- DriverAccessToken
- ActivationCode
- BranchConfig
- BranchMenuItem
- BranchCategory
- MenuItemExtra
- MenuItemNote
- GlobalSettings
- BranchItemAvailability
- PromoCode
- BranchItemPricing
- BranchHours
- OrderIssue
- driver_locations
- restaurant_settings

Also: enum `TransactionType` (CREDIT, DEBIT, REFUND, VOUCHER, PROMO, TOPUP).

For full model definitions, see `prisma/schema.prisma` in the repository.

---

Notes / next steps:
- Use these Zod and Prisma definitions as the canonical source of truth when generating API clients or OpenAPI specs.
- If you want, I can generate an OpenAPI skeleton using the Zod schemas (next step requires mapping file-by-file endpoints to schemas). 

