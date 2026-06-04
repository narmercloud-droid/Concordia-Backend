### Admin API

Admin routes provide branch configuration, opening hours, and holiday overrides (non-DB-backed JSON storage).

Response envelope: most admin controllers use the controller `wrap()` helper and therefore return the Api-style envelope: `{ success: true, data: ... }` for success and `{ success: false, error: { code, message, details? } }` for errors. Some older admin route handlers still call `res.json()` directly — those are noted per-endpoint.

---

### Get Opening Hours
Method: GET
URL: /api/admin/opening-hours
Auth: Admin (routes live under admin namespace; actual auth enforced where router is mounted)
Description: Returns branch opening hours and holiday overrides.

#### Response
- 200: `{ success: true, branches: { [branchId]: { hours: [...] } }, holidayOverrides: [...] }`

#### Notes
- Hours are read from a JSON file under `data.opening-hours.tson` and validated/normalized before returning.

---

### Update Opening Hours
Method: POST
URL: /api/admin/opening-hours
Auth: Admin
Description: Patch or replace opening hours for a branch; supports copying from source branch.

#### Request
- Body fields (one of):
  - `branchId` (string)
  - `hours` (array of 7 day objects) — full replacement
  - `updateDays` (array of weekday names) + `open`/`close`/`closed`/`relativeOpenMinutes`/`relativeCloseMinutes` for partial update
  - `copySourceBranchId`, `copyTargetBranchId` for copying

#### Responses
- 200: `{ success: true, updated: { branchId, hours, changedDays } }
`
- 400: `{ success: false, error: <validation message> }`

---

### Get Holiday Overrides
Method: GET
URL: /api/admin/holiday-overrides?branchId=...
Auth: Admin
Description: Return stored holiday overrides; optional branch filter.

---

### Create/Update Holiday Override
Method: POST
URL: /api/admin/holiday-overrides
Auth: Admin
Description: Create or update a holiday override record.

#### Request body (validated):
- `branchId` (string)
- `date` (YYYY-MM-DD)
- `open` (string time) | `close` (string time) | `isClosed` (boolean)

#### Responses
- 200: `{ success: true, holidayOverride: { branchId, date, open, close, isClosed } }`
- 400: `{ success: false, error: <message> }`

---

Notes / Open questions:
- Admin routes perform file-based persistence under `data/` and rely on `config/branches.json` for allowed branches.
- Many other admin sub-routers exist under `src/routes/admin/*` that manage printers, orders, coupons, etc. These should be documented in follow-up passes.

---

## Voucher endpoints

### Create Voucher
Method: POST
URL: /api/admin/voucher/create
Auth: `adminAuth`
Controller: `createVoucher` (`controllers/admin/voucherAdmin.controller.ts`)
Description: Create a voucher record in the `Voucher` Prisma model.

#### Request
- Body: `{ code: string, amount: number, expiresAt?: string (ISO) }`

#### Response
- 200: created `Voucher` object (Prisma model including `id`, `code`, `amount`, `expiresAt`, `isUsed`)
- Errors: `400` invalid input, `500` DB error

### Invalidate Voucher
Method: POST
URL: /api/admin/voucher/invalidate
Auth: `adminAuth`
Controller: `invalidateVoucher`
Description: Marks a voucher as used (`isUsed=true`).

#### Request
- Body: `{ code: string }`

#### Response
- 200: updated `Voucher` object

### List Vouchers
Method: GET
URL: /api/admin/voucher/list
Auth: `adminAuth`
Controller: `listVouchers`
Response: array of `Voucher` objects

---

## Refunds (Admin)

### Refund Order
Method: POST
URL: /api/admin/refund
Auth: `adminAuth`
Controller: `adminRefundOrder` (aliases `refundOrder` from `orderLifecycle.controller.ts`)
Description: Triggers the order refund flow (delegates to order lifecycle refund controller).

#### Response
- 200: refund result object (service-specific)
- Errors: `400`/`404` if order invalid, `500` on processing errors

---

## Admin Courier endpoints

### Assign Courier
Method: POST
URL: /api/admin/assign (mounted under admin-courier router)
Auth: `adminAuth`
Controller: `assignCourier` (`controllers/admin/adminCourier.controller.ts`)
Description: Assigns a courier to an order, sets courier token and updates order lifecycle status to `courier_assigned`.

#### Request
- Body: `{ orderId: string, courierId: string }`

#### Response
- 200: `{ success: true, courierToken: string, qrUrl: string }`
- Errors: `404` if order not found, `500` internal

### Courier Location
Method: GET
URL: /api/admin/location/:orderId
Auth: `adminAuth`
Controller: `getCourierLocation`
Description: Returns last known `CourierLocation` record for the order (may return `{}` when not found)

### Order Timeline
Method: GET
URL: /api/admin/timeline/:orderId
Auth: `adminAuth`
Controller: `getOrderTimeline`
Description: Returns `OrderTrackingEvent[]` for the specified order.

---

## Admin Item CRUD
These endpoints use `verifyAdmin` middleware (higher-permission checks) and call `ItemController`.

- `GET /api/admin/item/` — `ItemController.getAll` — returns list of items
- `GET /api/admin/item/:id` — `ItemController.getById` — returns single item or `NOT_FOUND` (mapped to 404)
- `POST /api/admin/item/` — `ItemController.create` — creates item, returns created model
- `PUT /api/admin/item/:id` — `ItemController.update` — updates item
- `DELETE /api/admin/item/:id` — `ItemController.remove` — returns `{ success: true }` on success

Errors across admin endpoints:
- `401` / `403` for auth/role failures
- `404` for missing resources (`fail('NOT_FOUND', ...)` returned by controllers)
- `INTERNAL_ERROR` / `500` for unexpected exceptions

Related socket events:
- Admin flows may trigger analytics socket events (`admin:ai_update`, `admin:demand_update`, etc.) when back-office processes update metrics. Order refunds/assignment may lead to `order_updated` or `order_assigned` events emitted by lifecycle services.
